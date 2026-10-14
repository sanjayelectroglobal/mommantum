/**
 * Dev- and test-only schema validators.
 */

export interface ValidationIssue {
  field: string
  message: string
  severity: "error" | "warning"
}

export interface ValidationResult {
  valid: boolean
  issues: ValidationIssue[]
}

/**
 * Validates whether a URL is a valid absolute HTTPS URL without localhost.
 */
export function isValidAbsoluteUrl(url: unknown): boolean {
  if (typeof url !== "string" || !url.trim()) return false
  const trimmed = url.trim()
  if (trimmed.includes("localhost") || trimmed.includes("127.0.0.1")) return false
  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === "https:" || parsed.protocol === "http:"
  } catch {
    return false
  }
}

/**
 * Validates whether a date string is valid ISO 8601 format.
 */
export function isValidIsoDate(dateStr: unknown): boolean {
  if (typeof dateStr !== "string" || !dateStr.trim()) return false
  const trimmed = dateStr.trim()
  // YYYY-MM-DD or full ISO 8601 timestamp
  const isoPattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/
  if (!isoPattern.test(trimmed)) return false
  const timestamp = Date.parse(trimmed)
  return !isNaN(timestamp)
}

/**
 * Verifies that every `@id` referenced inside an entity's properties
 * exists as an `@id` of an entity within the `@graph`.
 */
export function verifyGraphIdReferences(graph: Array<Record<string, any>>): ValidationResult {
  const issues: ValidationIssue[] = []
  const definedIds = new Set<string>()

  // 1. Collect all defined @id values (from top-level nodes and nested typed entities)
  function collectDefinedIds(val: any) {
    if (!val || typeof val !== "object") return
    if (Array.isArray(val)) {
      val.forEach(collectDefinedIds)
      return
    }
    if (typeof val["@id"] === "string" && typeof val["@type"] === "string") {
      definedIds.add(val["@id"])
    }
    for (const propVal of Object.values(val)) {
      if (typeof propVal === "object" && propVal !== null) {
        collectDefinedIds(propVal)
      }
    }
  }
  graph.forEach(collectDefinedIds)

  // 2. Recursively find all { "@id": string } references
  function checkReferences(val: any, path: string) {
    if (!val || typeof val !== "object") return

    if (Array.isArray(val)) {
      val.forEach((item, idx) => checkReferences(item, `${path}[${idx}]`))
      return
    }

    // Check if this object is a reference (only has @id or is a reference property)
    if (typeof val["@id"] === "string" && !val["@type"]) {
      const refId = val["@id"]
      if (!definedIds.has(refId)) {
        issues.push({
          field: path,
          message: `Referenced @id "${refId}" is not defined in the schema graph`,
          severity: "error",
        })
      }
    }

    for (const [key, propVal] of Object.entries(val)) {
      if (key !== "@id") {
        checkReferences(propVal, `${path}.${key}`)
      }
    }
  }

  graph.forEach((node, idx) => {
    const nodeType = node?.["@type"] || `Node[${idx}]`
    for (const [key, propVal] of Object.entries(node || {})) {
      if (key !== "@id" && key !== "@type") {
        checkReferences(propVal, `${nodeType}.${key}`)
      }
    }
  })

  return {
    valid: issues.filter((i) => i.severity === "error").length === 0,
    issues,
  }
}

/**
 * Verifies that forbidden entities (Brand, aggregateRating, Review) are absent.
 */
export function verifyNoForbiddenEntities(graph: Array<Record<string, any>>): ValidationResult {
  const issues: ValidationIssue[] = []

  function checkForbidden(val: any, path: string) {
    if (!val || typeof val !== "object") return

    if (Array.isArray(val)) {
      val.forEach((item, idx) => checkForbidden(item, `${path}[${idx}]`))
      return
    }

    if (val["@type"] === "Brand") {
      issues.push({
        field: path,
        message: "Forbidden '@type: Brand' entity found. Brand node must not duplicate Organization.",
        severity: "error",
      })
    }

    if (val["aggregateRating"] !== undefined) {
      issues.push({
        field: `${path}.aggregateRating`,
        message: "Forbidden property 'aggregateRating' found. No verified aggregate review data exists.",
        severity: "error",
      })
    }

    if (val["review"] !== undefined || val["reviews"] !== undefined) {
      issues.push({
        field: `${path}.review`,
        message: "Forbidden property 'review' found. No fabricated reviews allowed.",
        severity: "error",
      })
    }

    for (const [key, propVal] of Object.entries(val)) {
      checkForbidden(propVal, `${path}.${key}`)
    }
  }

  graph.forEach((node, idx) => checkForbidden(node, `graph[${idx}]`))

  return {
    valid: issues.filter((i) => i.severity === "error").length === 0,
    issues,
  }
}

/**
 * Dev-only logger for omitted fields or validation notes.
 */
export function devWarn(message: string, context?: Record<string, any>): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[Schema Warning] ${message}`, context || "")
  }
}
