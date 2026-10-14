import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"

// GET /api/admin/seo - List page settings
export async function GET(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data: settings, error } = await supabaseAdmin
      .from("seo_setting")
      .select("*")
      .order("page_key", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ settings })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/admin/seo - Create or Update setting by page_key
export async function POST(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()

    if (!body.page_key) {
      return NextResponse.json({ error: "page_key is required" }, { status: 400 })
    }

    const { data: existing, error: findError } = await supabaseAdmin
      .from("seo_setting")
      .select("id")
      .eq("page_key", body.page_key)

    if (findError) {
      console.error("[POST /api/admin/seo find error]:", findError)
      return NextResponse.json({ error: findError.message }, { status: 500 })
    }

    const allowedFields = [
      "page_key",
      "page_label",
      "meta_title",
      "meta_description",
      "slug",
      "canonical_url",
      "robots_index",
      "robots_follow",
      "primary_keyword",
      "secondary_keywords",
      "meta_keywords",
      "og_title",
      "og_description",
      "og_image",
      "og_url",
      "og_type",
      "twitter_card",
      "twitter_title",
      "twitter_description",
      "twitter_image",
      "schema_json",
      "faq_section",
    ]

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updatePayload[key] = body[key]
      }
    }

    let setting
    if (existing && existing.length > 0) {
      const { data, error } = await supabaseAdmin
        .from("seo_setting")
        .update(updatePayload)
        .eq("id", existing[0].id)
        .select()
        .single()
      
      if (error) {
        console.error("[POST /api/admin/seo update error]:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      setting = data
    } else {
      const insertPayload: Record<string, any> = {
        ...updatePayload,
        page_label: body.page_label || body.page_key,
        secondary_keywords: body.secondary_keywords ?? null,
        faq_section: body.faq_section ?? null,
      }

      const { data, error } = await supabaseAdmin
        .from("seo_setting")
        .insert(insertPayload)
        .select()
        .single()
      
      if (error) {
        console.error("[POST /api/admin/seo insert error]:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      setting = data
    }

    await revalidateContent({ type: "seo", pageKey: body.page_key })
    return NextResponse.json({ setting })
  } catch (err: any) {
    console.error("[POST /api/admin/seo exception]:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

