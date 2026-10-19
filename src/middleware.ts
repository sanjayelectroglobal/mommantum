import { NextRequest, NextResponse } from "next/server"
import { rolesConfig, isPathAllowed } from "./lib/config/roles"

// Fast in-memory role cache for Edge Runtime
const globalForMiddlewareCache = globalThis as unknown as {
  roleCache?: Map<string, { role: string; expires: number }>
}

if (!globalForMiddlewareCache.roleCache) {
  globalForMiddlewareCache.roleCache = new Map<string, { role: string; expires: number }>()
}

const roleCache = globalForMiddlewareCache.roleCache

function parseJwt(token: string): { exp?: number; sub?: string; email?: string } | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const json = atob(base64)
    return JSON.parse(json)
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("sb-access-token")?.value

  // ── Removed schema panel endpoints — always return 404 ──
  if (
    pathname === "/admin/schema" ||
    pathname.startsWith("/admin/schema/") ||
    pathname === "/api/admin/schema" ||
    pathname.startsWith("/api/admin/schema/")
  ) {
    return new NextResponse("Not Found", { status: 404 })
  }

  // ── 1. SITEMAP — always pass through immediately ──
  if (pathname.startsWith("/sitemap")) {
    return NextResponse.next()
  }

  // ── 2. STATIC FILES & API — always pass through immediately ──
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // ── 3. PUBLIC ROUTE BYPASS ──
  const isPublicRoute = 
    pathname === "/" ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/work") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/faq") ||
    pathname.startsWith("/privacy-policy") ||
    pathname.startsWith("/terms-and-conditions") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/collections") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/store") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/order") ||
    pathname.startsWith("/checkout")

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Resolve custom admin path
  const customAdminPath = process.env.CUSTOM_ADMIN_PATH || "admin"

  // Block direct access to "/admin" if custom path is configured
  if (customAdminPath !== "admin") {
    if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/admin-login") {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>404</title>
            <style>
              body { background-color: #ffffff; color: #111827; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .container { text-align: center; display: flex; flex-direction: column; gap: 16px; align-items: center; }
              h1 { font-size: 30px; font-weight: 600; margin: 0; }
              p { font-size: 14px; color: #6b7280; margin: 0; }
              a { font-size: 14px; color: #3b82f6; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Page not found</h1>
              <p>The page you tried to access does not exist.</p>
              <a href="/">Go to frontpage ↗</a>
            </div>
          </body>
        </html>`,
        { status: 404, headers: { "Content-Type": "text/html" } }
      )
    }
  }

  // Handle access to the admin path
  const isCustomAdminRoute = pathname === `/${customAdminPath}` || pathname.startsWith(`/${customAdminPath}/`)

  if (isCustomAdminRoute) {
    const subpath = pathname.substring(customAdminPath.length + 1)
    const targetInternalPath = `/admin${subpath || ""}`

    // Instant check for active token
    if (!accessToken) {
      const refreshToken = request.cookies.get("sb-refresh-token")?.value
      if (!refreshToken) {
        // WHAT: Redirect unauthenticated requests to the admin login page (HTTP 307).
        // WHY: Must redirect rather than rewrite in Next.js 15 App Router because /admin and /admin-login
        // have different layout structures; an internal rewrite causes client-side webpack chunk hydration mismatch.
        const response = NextResponse.redirect(new URL(`/admin-login${request.nextUrl.search}`, request.url))
        response.headers.set("X-Robots-Tag", "noindex, nofollow")
        return response
      }
    }

    try {
      let role: string | null = null
      let isTokenActive = false

      if (accessToken) {
        // Fast in-memory cache check
        const cached = roleCache.get(accessToken)
        if (cached && cached.expires > Date.now()) {
          role = cached.role
          isTokenActive = true
        } else {
          // Decode JWT payload locally (0ms)
          const payload = parseJwt(accessToken)
          if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
            isTokenActive = true
            // Check cookie role first
            const roleCookie = request.cookies.get("sb-role")?.value
            if (roleCookie && rolesConfig[roleCookie]) {
              role = roleCookie
              roleCache.set(accessToken, { role, expires: payload.exp * 1000 })
            }
          }
        }
      }

      // Fast pass-through for client-side RSC navigation if token is active
      const isRsc = request.headers.get("rsc") === "1" || request.headers.has("next-router-prefetch")
      if (isTokenActive && isRsc) {
        if (customAdminPath === "admin") {
          return NextResponse.next()
        }
        const response = NextResponse.rewrite(new URL(targetInternalPath + request.nextUrl.search, request.url))
        response.headers.set("X-Robots-Tag", "noindex, nofollow")
        return response
      }

      // If role is still undetermined, fetch profile once
      if (!role) {
        const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zuwgqlwrkhmlmcvaqxyl.supabase.co"
        const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1d2dxbHdya2htbG1jdmFxeHlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTMxNTgwNCwiZXhwIjoyMTAwODkxODA0fQ.ZZHljxfRDou3APHI864wh6h6iCTKCcC5rrstg-LIMYM"
        
        let userId: string | null = null
        if (accessToken) {
          const payload = parseJwt(accessToken)
          if (payload?.sub) userId = payload.sub
        }

        if (userId) {
          const { createClient } = await import("@supabase/supabase-js")
          const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("role, status")
            .eq("id", userId)
            .single()

          if (profile?.status === "approved" && profile?.role) {
            const userRole = String(profile.role)
            role = userRole
            if (accessToken) {
              roleCache.set(accessToken, { role: userRole, expires: Date.now() + 15 * 60 * 1000 })
            }
          }
        }
      }

      if (!role) {
        // WHAT: Redirect invalid/expired roles back to the login page with an error notice.
        // WHY: Clears invalid session cookies and safely redirects without crashing client bundles.
        const response = NextResponse.redirect(new URL("/admin-login?error=Not+authorized", request.url))
        response.cookies.delete("sb-access-token")
        response.cookies.delete("sb-refresh-token")
        response.cookies.delete("sb-role")
        response.headers.set("X-Robots-Tag", "noindex, nofollow")
        return response
      }

      const config = rolesConfig[role]
      if (!config || !isPathAllowed(targetInternalPath, config.allowedFrontendPaths)) {
        return NextResponse.redirect(new URL(`/${customAdminPath}?error=Unauthorized`, request.url))
      }

      // Direct pass-through if path is already standard /admin
      if (customAdminPath === "admin") {
        return NextResponse.next()
      }

      // Rewrite internally for custom admin path disguise
      const response = NextResponse.rewrite(new URL(targetInternalPath + request.nextUrl.search, request.url))
      response.headers.set("X-Robots-Tag", "noindex, nofollow")
      return response

    } catch (err) {
      console.error("Middleware admin error:", err)
      const response = NextResponse.rewrite(new URL("/admin-login?error=Session+verification+failed", request.url))
      response.headers.set("X-Robots-Tag", "noindex, nofollow")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|assets).*)",
  ],
}
