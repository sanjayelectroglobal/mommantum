import { NextRequest } from "next/server"
import { cookies as nextCookies } from "next/headers"
import { supabaseAdmin, supabaseAnon } from "./supabase-admin"
import { rolesConfig, isPathAllowed } from "./config/roles"

// Global in-memory cache to share across all Next.js Route Handlers in Node.js
const globalForCache = globalThis as unknown as {
  roleCache?: Map<string, { role: string; email: string; expires: number }>
}

if (!globalForCache.roleCache) {
  globalForCache.roleCache = new Map<string, { role: string; email: string; expires: number }>()
}

const roleCache = globalForCache.roleCache;

export interface UserSession {
  email: string
  role: string
}

export async function getUserSession(req: NextRequest): Promise<UserSession | null> {
  try {
    const cookieStore = await nextCookies()
    let accessToken = cookieStore.get("sb-access-token")?.value

    let user: any = null
    let refreshedSession: any = null

    // 1. Try checking cache and validating existing access token
    if (accessToken) {
      const cached = roleCache.get(accessToken)
      if (cached && cached.expires > Date.now()) {
        return { role: cached.role, email: cached.email }
      }

      try {
        const { data, error: authError } = await supabaseAnon.auth.getUser(accessToken)
        if (!authError && data?.user) {
          user = data.user
        }
      } catch (err) {
        console.error("getUserSession getUser exception:", err)
      }
    }

    // 2. If access token is invalid/missing, try refreshing with refresh token
    if (!user) {
      const refreshToken = cookieStore.get("sb-refresh-token")?.value
      if (refreshToken) {
        try {
          const { data, error: refreshError } = await supabaseAnon.auth.refreshSession({
            refresh_token: refreshToken
          })
          if (!refreshError && data?.session) {
            refreshedSession = data.session
            user = data.user
            accessToken = data.session.access_token
          }
        } catch (err) {
          console.error("getUserSession refreshSession exception:", err)
        }
      }
    }

    if (!user) return null

    // 3. Check profile role and status
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single()

    if (profile?.role && profile?.status === "approved") {
      const session = {
        role: profile.role,
        email: user.email || "",
      }

      // Cache session using the active access token
      if (accessToken) {
        roleCache.set(accessToken, {
          ...session,
          expires: Date.now() + 600 * 1000 // cache for 10 minutes
        })
      }

      // If refreshed, store the new cookies on the request headers / client browser
      if (refreshedSession) {
        cookieStore.set("sb-access-token", refreshedSession.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: refreshedSession.expires_in,
          path: "/",
          sameSite: "lax",
        })
        cookieStore.set("sb-refresh-token", refreshedSession.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
          sameSite: "lax",
        })
      }

      return session
    }

    return null
  } catch (err) {
    console.error("getUserSession failed:", err)
    return null
  }
}

export async function verifyUserRole(
  req: NextRequest,
  allowedRoles: string[]
): Promise<boolean> {
  const session = await getUserSession(req)
  if (!session) return false

  // Determine if this role can act as a subset of manager
  const isSubsetRole = ["content_manager", "editor", "viewer"].includes(session.role)
  const isAllowedRole = allowedRoles.includes(session.role) || (isSubsetRole && allowedRoles.includes("manager"))

  // 1. Check if the role is allowed by the route handler definition
  if (!isAllowedRole) return false

  // 2. Double-check if the JSON configuration allows this API path for the role
  const config = rolesConfig[session.role]
  if (!config) return false

  const apiPath = req.nextUrl.pathname
  const pathAllowed = isPathAllowed(apiPath, config.allowedApiPaths)
  if (!pathAllowed) return false

  // 3. Enforce read-only constraint for viewer role on API writes
  if (session.role === "viewer" && req.method !== "GET") {
    return false
  }

  return true
}
