/**
 * Admin Client-Side Cache Utility (admin-cache.ts)
 * 
 * Purpose:
 * Provides two-tier caching (in-memory Map + sessionStorage) for admin data tables
 * (Services, Blog posts, SEO settings, etc.). Enables instant (0ms) layout switching
 * using a stale-while-revalidate pattern so administrators do not see empty loading spinners
 * on repeated visits.
 * 
 * Architecture:
 * 1. L1 Cache: In-memory Map for instantaneous synchronous retrieval within current page session.
 * 2. L2 Cache: sessionStorage for persistence across tab refreshes and cross-page admin navigation.
 * 3. Invalidation: Allows granular key eviction or complete cache wipe on mutations (create/edit/delete).
 */

const memoryCache = new Map<string, { data: any; timestamp: number }>()
const DEFAULT_TTL_MS = 5 * 60 * 1000 // 5 minutes default time-to-live

export function getAdminCache<T>(key: string, maxAgeMs = DEFAULT_TTL_MS): T | null {
  const item = memoryCache.get(key)
  if (item && Date.now() - item.timestamp < maxAgeMs) {
    return item.data as T
  }

  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem(`admin_c_${key}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && Date.now() - parsed.timestamp < maxAgeMs) {
          memoryCache.set(key, parsed)
          return parsed.data as T
        }
      }
    } catch {}
  }
  return null
}

export function setAdminCache<T>(key: string, data: T): void {
  const payload = { data, timestamp: Date.now() }
  memoryCache.set(key, payload)

  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(`admin_c_${key}`, JSON.stringify(payload))
    } catch {}
  }
}

export function invalidateAdminCache(key?: string): void {
  if (key) {
    memoryCache.delete(key)
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(`admin_c_${key}`)
      } catch {}
    }
  } else {
    memoryCache.clear()
    if (typeof window !== "undefined") {
      try {
        const keysToRemove: string[] = []
        for (let i = 0; i < sessionStorage.length; i++) {
          const k = sessionStorage.key(i)
          if (k?.startsWith("admin_c_")) keysToRemove.push(k)
        }
        keysToRemove.forEach((k) => sessionStorage.removeItem(k))
      } catch {}
    }
  }
}
