import { NextRequest, NextResponse } from "next/server"
import { getUserSession } from "@lib/auth-helpers"
import { supabaseAdmin } from "@lib/supabase-admin"

export async function GET(req: NextRequest) {
  try {
    const session = await getUserSession(req)
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { data } = await supabaseAdmin
      .from("site_setting")
      .select("custom_admin_path")
      .limit(1)
    const customAdminPath = data && data.length > 0 ? data[0].custom_admin_path : null

    return NextResponse.json({
      ok: true,
      email: session.email,
      role: session.role,
      customAdminPath: customAdminPath || "admin"
    })
  } catch (error) {
    console.error("Auth me error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
