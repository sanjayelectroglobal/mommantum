import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole } from "@lib/auth-helpers"

export async function GET(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data: keywords, error } = await supabaseAdmin
      .from("site_keywords")
      .select("*")
      .order("keyword", { ascending: true })

    if (error) throw error
    return NextResponse.json({ keywords })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    if (!body.keyword || !body.target_url) {
      return NextResponse.json({ error: "Keyword and Target URL are required" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("site_keywords")
      .insert({
        keyword: body.keyword.trim(),
        target_url: body.target_url.trim(),
        max_matches_per_page: body.max_matches_per_page || 1,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ keyword: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
