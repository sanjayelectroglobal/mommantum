import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole, getUserSession } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"
import crypto from "crypto"

// GET /api/admin/seo/site - Get site setting
export async function GET(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data, error } = await supabaseAdmin
      .from("site_setting")
      .select("*")
      .limit(1)


    const setting = data && data.length > 0 ? data[0] : null
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ setting })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/admin/seo/site - Create or Update site setting
export async function POST(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const session = await getUserSession(req)

    // Validate that only users with the 'admin' role can modify the custom admin path
    if (body.custom_admin_path !== undefined) {
      const { data: currentSetting } = await supabaseAdmin
        .from("site_setting")
        .select("custom_admin_path")
        .limit(1)
      const currentPath = currentSetting && currentSetting.length > 0 ? currentSetting[0].custom_admin_path : null

      if (body.custom_admin_path !== currentPath && session?.role !== "admin") {
        return NextResponse.json(
          { error: "Only administrators can configure the custom admin path." },
          { status: 403 }
        )
      }
    }

    const { data: existing } = await supabaseAdmin
      .from("site_setting")
      .select("id")
      .limit(1)

    let setting
    if (existing && existing.length > 0) {
      const { data, error } = await supabaseAdmin
        .from("site_setting")
        .update(body)
        .eq("id", existing[0].id)
        .select()
        .single()
      
      if (error) throw error
      setting = data
    } else {
      const { data, error } = await supabaseAdmin
        .from("site_setting")
        .insert({
          id: crypto.randomUUID(),
          ...body
        })
        .select()
        .single()
      
      if (error) throw error
      setting = data
    }

    // Invalidate the middleware cache in globalThis
    const globalForAdminPath = globalThis as unknown as {
      customAdminPath?: string | null
      customAdminPathExpires?: number
    }
    globalForAdminPath.customAdminPath = undefined
    globalForAdminPath.customAdminPathExpires = undefined

    await revalidateContent({ type: "site_setting" })
    return NextResponse.json({ setting })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

