/**
 * Mommantum is a service agency, not an online store.
 * Removes any return-policy / online-store data, even if it arrives from a DB `schema_json` override.
 */
const BLOCKED_KEYS = new Set([
  "hasMerchantReturnPolicy",
  "merchantReturnPolicy",
  "returnPolicyCategory",
  "merchantReturnDays",
  "returnMethod",
  "returnFees",
  "applicableCountry",
])

const BLOCKED_TYPES = new Set(["MerchantReturnPolicy", "OnlineStore"])

export function stripEcommerceArtifacts<T>(val: T): T {
  if (Array.isArray(val)) {
    return val
      .filter((item) => !(item && typeof item === "object" && BLOCKED_TYPES.has((item as any)["@type"])))
      .map((item) => stripEcommerceArtifacts(item)) as unknown as T
  }
  if (val && typeof val === "object") {
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(val as Record<string, any>)) {
      if (BLOCKED_KEYS.has(k)) continue
      if (k === "@type") {
        if (Array.isArray(v)) {
          const kept = v.filter((t) => !BLOCKED_TYPES.has(t))
          out[k] = kept.length === 1 ? kept[0] : kept
          continue
        }
        if (typeof v === "string" && BLOCKED_TYPES.has(v)) continue
      }
      out[k] = stripEcommerceArtifacts(v)
    }
    return out as T
  }
  return val
}
