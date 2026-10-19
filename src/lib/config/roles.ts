export interface RolePermission {
  allowedFrontendPaths: string[]
  allowedApiPaths: string[]
}

export const rolesConfig: Record<string, RolePermission> = {
  admin: {
    allowedFrontendPaths: ["*"],
    allowedApiPaths: ["*"],
  },
  manager: {
    allowedFrontendPaths: [
      "/admin",
      "/admin/orders",
      "/admin/products",
      "/admin/inventory",
      "/admin/customers",
      "/admin/promotions",
      "/admin/price-lists",
      "/admin/collections",
      "/admin/categories",
      "/admin/services",
      "/admin/case-studies",
      "/admin/seo",
      "/admin/pages",
      "/admin/sitemap",
      "/admin/blog"
    ],
    allowedApiPaths: [
      "/api/admin/stats",
      "/api/admin/orders",
      "/api/admin/products",
      "/api/admin/inventory",
      "/api/admin/customers",
      "/api/admin/promotions",
      "/api/admin/price-lists",
      "/api/admin/collections",
      "/api/admin/categories",
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
      "/admin/collections",
      "/admin/categories",
      "/admin/services",
      "/admin/case-studies",
      "/admin/seo",
      "/admin/sitemap",
      "/admin/blog"
    ],
    allowedApiPaths: [
      "/api/admin/stats",
      "/api/admin/collections",
      "/api/admin/categories",
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
      "/admin/orders",
      "/admin/products",
      "/admin/inventory",
      "/admin/customers",
      "/admin/promotions",
      "/admin/price-lists",
      "/admin/collections",
      "/admin/categories",
      "/admin/services",
      "/admin/case-studies",
      "/admin/seo",
      "/admin/sitemap",
      "/admin/blog"
    ],
    allowedApiPaths: [
      "/api/admin/stats",
      "/api/admin/orders",
      "/api/admin/products",
      "/api/admin/inventory",
      "/api/admin/customers",
      "/api/admin/promotions",
      "/api/admin/price-lists",
      "/api/admin/collections",
      "/api/admin/categories",
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
