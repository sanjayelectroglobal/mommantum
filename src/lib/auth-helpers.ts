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

const roleCache = globalForCache.roleCache

function parseJwt(token: string): { exp?: number; sub?: string; email?: string } | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const json = Buffer.from(base64, "base64").toString("utf8")
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function setCachedUserSession(token: string, role: string, email: string) {
  roleCache.set(token, { role, email, expires: Date.now() + 15 * 60 * 1000 })
}

export interface UserSession {
  email: string
  role: string
}

export async function getUserSession(req: NextRequest): Promise<UserSession | null> {
  try {
    const cookieStore = await nextCookies()
    let accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) return null

    // 1. Check in-memory cache first (0ms)
    const cached = roleCache.get(accessToken)
    if (cached && cached.expires > Date.now()) {
      return { role: cached.role, email: cached.email }
    }

    // 2. Decode JWT payload locally (0ms)
    const payload = parseJwt(accessToken)
    if (!payload || !payload.sub || (payload.exp && payload.exp * 1000 < Date.now())) {
      return null
    }

    const userId = payload.sub
    const userEmail = payload.email || ""

    // 3. Fast check: if sb-role cookie is set and valid
    const roleCookie = cookieStore.get("sb-role")?.value
    if (roleCookie && rolesConfig[roleCookie]) {
      const session = { role: roleCookie, email: userEmail }
      roleCache.set(accessToken, { ...session, expires: Date.now() + 15 * 60 * 1000 })
      return session
    }

    // 4. Query profile directly by user ID (1 indexed query)
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role, status")
      .eq("id", userId)
      .single()

    if (profile?.role && profile?.status === "approved") {
      const session = {
        role: profile.role,
        email: userEmail,
      }
      roleCache.set(accessToken, {
        ...session,
        expires: Date.now() + 15 * 60 * 1000,
      })
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

  if (!isAllowedRole) return false

  const config = rolesConfig[session.role]
  if (!config) return false

  const apiPath = req.nextUrl.pathname
  const pathAllowed = isPathAllowed(apiPath, config.allowedApiPaths)
  if (!pathAllowed) return false

  if (session.role === "viewer" && req.method !== "GET") {
    return false
  }

  return true
}
