/**
 * @file use-admin-path.ts
 * @description Custom React hook to dynamically detect and prefix the active admin route segment.
 * 
 * WHY: The application supports customizable admin URL paths (configured via CUSTOM_ADMIN_PATH,
 * such as /staff or /portal instead of standard /admin). This hook inspects the active browser pathname
 * and automatically prefixes navigation links so internal admin links always point to the correct route.
 */

"use client"
import { useState, useEffect } from "react"

/**
 * useAdminPath
 * 
 * WHAT: Reads the current top-level admin path from window.location and provides a helper function
 * (prefixPath) to adapt standard "/admin/..." URLs to the active path.
 * 
 * WHY: Prevents hardcoded links from breaking when a custom admin path is configured.
 * 
 * @returns { adminPath: string, prefixPath: (href: string) => string }
 */
export function useAdminPath() {
  // Default to standard "admin" route segment until client-side pathname is parsed
  const [adminPath, setAdminPath] = useState("admin")

  useEffect(() => {
    // Only execute on the client where window and pathname are available
    if (typeof window !== "undefined") {
      // Extract the first path segment (e.g. "/admin/orders" -> "admin")
      const pathSegments = window.location.pathname.split("/").filter(Boolean)
      const currentRoot = pathSegments[0] || "admin"
      setAdminPath(currentRoot)
    }
  }, [])

  /**
   * prefixPath
   * WHAT: Replaces leading "/admin" with the currently active root segment.
   * WHY: Ensures that navigation links point to the current custom admin path.
   */
  const prefixPath = (href: string) => {
    if (adminPath === "admin") return href
    return href.replace(/^\/admin/, `/${adminPath}`)
  }

  return { adminPath, prefixPath }
}
