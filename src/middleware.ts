import { NextRequest, NextResponse } from "next/server"
import { rolesConfig, isPathAllowed } from "./lib/config/roles"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL

const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

// Global in-memory cache to share across middleware executions in Edge Runtime
const globalForMiddlewareCache = globalThis as unknown as {
  roleCache?: Map<string, { role: string; expires: number }>
}

if (!globalForMiddlewareCache.roleCache) {
  globalForMiddlewareCache.roleCache = new Map<string, { role: string; expires: number }>()
}

const roleCache = globalForMiddlewareCache.roleCache;

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

  // ── 2. STATIC FILES — always pass through immediately ──
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // ── 3. PUBLIC ROUTE BYPASS ──
  // Skip database query for known public pages to make them load instantly.
  const isPublicRoute = 
    pathname === "/" ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/work") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/privacy-policy") ||
    pathname.startsWith("/terms-and-conditions") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/collections") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/store") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/order") ||
    pathname.startsWith("/checkout");

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Fetch custom admin path (cached for 10 minutes)
  const globalForAdminPath = globalThis as unknown as {
    customAdminPath?: string | null
    customAdminPathExpires?: number
  }

  if (
    globalForAdminPath.customAdminPath === undefined ||
    !globalForAdminPath.customAdminPathExpires ||
    globalForAdminPath.customAdminPathExpires < Date.now()
  ) {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      // Add a 500ms timeout — middleware must never block page load for DB
      const fetchWithTimeout = Promise.race([
        supabaseAdmin
          .from("site_setting")
          .select("custom_admin_path")
          .limit(1),
        new Promise<{ data: null; error: Error }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: new Error("timeout") }), 500)
        ),
      ])

      const { data } = await fetchWithTimeout

      globalForAdminPath.customAdminPath = (data && data.length > 0 && data[0].custom_admin_path) ? data[0].custom_admin_path : "admin"
      globalForAdminPath.customAdminPathExpires = Date.now() + 60 * 1000 // Refresh cache after 1 minute
    } catch (err) {
      console.error("Middleware failed to fetch custom admin path:", err)
      globalForAdminPath.customAdminPath = "admin"
      globalForAdminPath.customAdminPathExpires = Date.now() + 60 * 1000
    }
  }

  const customAdminPath = globalForAdminPath.customAdminPath || "admin"

  // Block direct access to "/admin", "/admin-login", "/admin/*" if custom path is configured
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
              body {
                background-color: #ffffff;
                color: #111827;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                user-select: none;
              }
              .container {
                text-align: center;
                display: flex;
                flex-direction: column;
                gap: 16px;
                align-items: center;
              }
              h1 {
                font-size: 30px;
                font-weight: 600;
                margin: 0;
                letter-spacing: -0.025em;
              }
              p {
                font-size: 14px;
                color: #6b7280;
                margin: 0;
              }
              a {
                font-size: 14px;
                color: #3b82f6;
                text-decoration: none;
                font-weight: 500;
                display: inline-flex;
                align-items: center;
                gap: 4px;
              }
              a:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Page not found</h1>
              <p>The page you tried to access does not exist.</p>
              <a href="/">
                <span>Go to frontpage</span>
                <span>↗</span>
              </a>
            </div>
          </body>
        </html>`,
        {
          status: 404,
          headers: {
            "Content-Type": "text/html",
          },
        }
      )
    }
  }

  // Handle access to the custom admin path (or "/admin" if that's the current configured path)
  const isCustomAdminRoute = pathname === `/${customAdminPath}` || pathname.startsWith(`/${customAdminPath}/`)

  if (isCustomAdminRoute) {
    const subpath = pathname.substring(customAdminPath.length + 1) // e.g. "/orders" or ""

    try {
      let role: string | null = null
      let user: any = null
      let refreshedSession: any = null

      // 1. Check cache first
      let cached = accessToken ? roleCache.get(accessToken) : null
      if (cached && cached.expires > Date.now()) {
        role = cached.role
      } else {
        const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zuwgqlwrkhmlmcvaqxyl.supabase.co"
        const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1d2dxbHdya2htbG1jdmFxeHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTU4MDQsImV4cCI6MjEwMDg5MTgwNH0.hPPVUAGotMfVzHbClp7v8Q496_sgRLbwo9Q6zMYNjQI"
        const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1d2dxbHdya2htbG1jdmFxeHlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTMxNTgwNCwiZXhwIjoyMTAwODkxODA0fQ.ZZHljxfRDou3APHI864wh6h6iCTKCcC5rrstg-LIMYM"

        const { createClient } = await import("@supabase/supabase-js")
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

        // 2. Try validating existing access token
        if (accessToken) {
          try {
            const { data, error: authError } = await supabase.auth.getUser(accessToken)
            if (!authError && data?.user) {
              user = data.user
            }
          } catch (err) {
            console.error("Middleware getUser exception:", err)
          }
        }

        // 3. Try refreshing if no user resolved
        if (!user) {
          const refreshToken = request.cookies.get("sb-refresh-token")?.value
          if (refreshToken) {
            try {
              const { data, error: refreshError } = await supabase.auth.refreshSession({
                refresh_token: refreshToken,
              })
              if (!refreshError && data?.session) {
                refreshedSession = data.session
                user = data.user
              }
            } catch (err) {
              console.error("Middleware refreshSession exception:", err)
            }
          }
        }

        // 4. Block and clear if unauthenticated
        if (!user) {
          const response = NextResponse.rewrite(new URL(`/admin-login${request.nextUrl.search}`, request.url))
          response.cookies.delete("sb-access-token")
          response.cookies.delete("sb-refresh-token")
          response.headers.set("X-Robots-Tag", "noindex, nofollow")
          return response
        }

        // 5. Fetch profile role and status
        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

        let { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("role, status")
          .eq("id", user.id)
          .single()

        if (!profile) {
          const { data: newProfile } = await supabaseAdmin
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email,
              role: "admin",
              status: "approved"
            })
            .select("role, status")
            .single()

          profile = newProfile || { role: "admin", status: "approved" }
        }

        const isApproved = profile?.status === "approved"
        role = isApproved && profile?.role ? profile.role : null

        if (role) {
          const activeAccessToken = refreshedSession?.access_token || accessToken
          if (activeAccessToken) {
            roleCache.set(activeAccessToken, { role, expires: Date.now() + 600 * 1000 })
          }
        } else {
          const errorMsg = profile?.status === "rejected"
            ? "Your access request has been rejected"
            : profile?.status === "pending"
            ? "Your access request is pending approval"
            : "Not authorized"
          const response = NextResponse.rewrite(new URL(`/admin-login?error=${encodeURIComponent(errorMsg)}`, request.url))
          response.cookies.delete("sb-access-token")
          response.cookies.delete("sb-refresh-token")
          response.headers.set("X-Robots-Tag", "noindex, nofollow")
          return response
        }
      }

      if (!role) {
        const response = NextResponse.rewrite(new URL("/admin-login?error=Not+authorized", request.url))
        response.cookies.delete("sb-access-token")
        response.cookies.delete("sb-refresh-token")
        response.headers.set("X-Robots-Tag", "noindex, nofollow")
        return response
      }

      const config = rolesConfig[role]
      if (!config) {
        const response = NextResponse.rewrite(new URL("/admin-login?error=Not+authorized", request.url))
        response.cookies.delete("sb-access-token")
        response.cookies.delete("sb-refresh-token")
        response.headers.set("X-Robots-Tag", "noindex, nofollow")
        return response
      }

      // Check permission for target internal path
      const targetInternalPath = `/admin${subpath || ""}`
      if (!isPathAllowed(targetInternalPath, config.allowedFrontendPaths)) {
        return NextResponse.redirect(new URL(`/${customAdminPath}?error=Unauthorized`, request.url))
      }

      // Rewrite internally to the real admin route
      const response = NextResponse.rewrite(new URL(targetInternalPath + request.nextUrl.search, request.url))
      response.headers.set("X-Robots-Tag", "noindex, nofollow")

      if (refreshedSession) {
        request.cookies.set("sb-access-token", refreshedSession.access_token)
        request.cookies.set("sb-refresh-token", refreshedSession.refresh_token)

        response.cookies.set("sb-access-token", refreshedSession.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: refreshedSession.expires_in,
          path: "/",
          sameSite: "lax",
        })
        response.cookies.set("sb-refresh-token", refreshedSession.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
          sameSite: "lax",
        })
      }
      return response

    } catch (err) {
      console.error("Middleware custom admin auth error:", err)
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
