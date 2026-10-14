import { SCHEMA_CONTEXT } from "./config"
import { verifyGraphIdReferences, verifyNoForbiddenEntities } from "./validate"

/**
 * Recursively cleans an object or array by dropping:
 * - undefined
 * - null
 * - empty strings ("")
 * - empty arrays ([])
 * - empty objects ({}) except reference objects containing "@id"
 */
export function cleanEmptyProperties<T>(val: T): T | undefined {
  if (val === null || val === undefined) {
    return undefined
  }

  if (typeof val === "string") {
    const trimmed = val.trim()
    return trimmed === "" ? undefined : (trimmed as unknown as T)
  }

  if (Array.isArray(val)) {
    const cleanedArr = val
      .map((item) => cleanEmptyProperties(item))
      .filter((item) => item !== undefined)
    return cleanedArr.length === 0 ? undefined : (cleanedArr as unknown as T)
  }

  if (typeof val === "object") {
    const cleanedObj: Record<string, any> = {}
    let hasKeys = false

    for (const [k, v] of Object.entries(val)) {
      const cleanedV = cleanEmptyProperties(v)
      if (cleanedV !== undefined) {
        cleanedObj[k] = cleanedV
        hasKeys = true
      }
    }

    if (!hasKeys) {
      return undefined
    }

    return cleanedObj as T
  }

  return val
}

/**
 * Builds a validated, deduplicated, single-graph schema object.
 * 1. Cleans empty properties
 * 2. Deduplicates nodes by @id (merges or keeps unique)
 * 3. Asserts no forbidden entities (Brand, aggregateRating, Review)
 * 4. Verifies @id references
 */
export function buildSchemaGraph(nodes: Array<Record<string, any> | null | undefined>): {
  "@context": string
  "@graph": Array<Record<string, any>>
} {
  const nodeMap = new Map<string, Record<string, any>>()

  for (const rawNode of nodes) {
    if (!rawNode) continue
    const cleaned = cleanEmptyProperties(rawNode)
    if (!cleaned || typeof cleaned !== "object") continue

    const id = cleaned["@id"]
    if (id && typeof id === "string") {
      if (nodeMap.has(id)) {
        // Merge node properties if same @id (e.g. extending an existing node)
        const existing = nodeMap.get(id)!
        nodeMap.set(id, { ...existing, ...cleaned })
      } else {
        nodeMap.set(id, cleaned)
      }
    } else {
      // Node without @id (rare)
      const anonymousId = `_anon_${nodeMap.size}`
      nodeMap.set(anonymousId, cleaned)
    }
  }

  const graphArray = Array.from(nodeMap.values())

  // Dev checks
  verifyNoForbiddenEntities(graphArray)
  verifyGraphIdReferences(graphArray)

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": graphArray,
  }
}
