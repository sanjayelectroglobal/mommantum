export interface RolePermission {
  allowedFrontendPaths: string[]
  allowedApiPaths: string[]
}

export const rolesConfig: Record<string, RolePermission> = {
  admin: {
    allowedFrontendPaths: ["*"],
    allowedApiPaths: ["*"],
  },
  // Phase 3: Removed deleted store admin routes from manager, content_manager, and viewer roles.
  manager: {
    allowedFrontendPaths: [
      "/admin",
      "/admin/services",
      "/admin/case-studies",
      "/admin/seo",
      "/admin/pages",
      "/admin/sitemap",
      "/admin/blog"
    ],
    allowedApiPaths: [
      "/api/admin/stats",
      "/api/admin/services",
      "/api/admin/case-studies",
      "/api/admin/seo",
      "/api/admin/blog",
      "/api/admin/custom"
    ],
  },
  seo: {
    allowedFrontendPaths: [
      "/admin",
      "/admin/sitemap",
      "/admin/blog"
    ],
    allowedApiPaths: [
      "/api/admin/stats",
      "/api/admin/blog",
      "/api/admin/custom"
    ],
  },
  content_manager: {
    allowedFrontendPaths: [
      "/admin",
      "/admin/services",
      "/admin/case-studies",
      "/admin/seo",
      "/admin/sitemap",
      "/admin/blog"
    ],
    allowedApiPaths: [
      "/api/admin/stats",
      "/api/admin/services",
      "/api/admin/case-studies",
      "/api/admin/seo",
      "/api/admin/blog",
      "/api/admin/custom"
    ],
  },
  editor: {
    allowedFrontendPaths: [
      "/admin",
      "/admin/blog",
      "/admin/case-studies"
    ],
    allowedApiPaths: [
      "/api/admin/stats",
      "/api/admin/blog",
      "/api/admin/case-studies"
    ],
  },
  viewer: {
    allowedFrontendPaths: [
      "/admin",
      "/admin/services",
      "/admin/case-studies",
      "/admin/seo",
      "/admin/sitemap",
      "/admin/blog"
    ],
    allowedApiPaths: [
      "/api/admin/stats",
      "/api/admin/services",
      "/api/admin/case-studies",
      "/api/admin/seo",
      "/api/admin/blog",
      "/api/admin/custom"
    ],
  },
}

export function isPathAllowed(pathname: string, allowedPaths: string[]): boolean {
  if (allowedPaths.includes("*")) return true
  return allowedPaths.some(p => {
    if (pathname === p) return true
    if (p === "/admin") return false // do not allow "/admin" to wildcard-match all subpaths
    return pathname.startsWith(p + "/")
  })
}
