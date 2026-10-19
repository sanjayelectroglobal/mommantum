import { NextRequest, NextResponse } from "next/server"
import { getUserSession } from "@lib/auth-helpers"
import { supabaseAdmin } from "@lib/supabase-admin"

export async function GET(req: NextRequest) {
  try {
    const session = await getUserSession(req)
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const customAdminPath = process.env.CUSTOM_ADMIN_PATH || "admin"

    return NextResponse.json({
      ok: true,
      email: session.email,
      role: session.role,
      customAdminPath
    })
  } catch (error) {
    console.error("Auth me error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
