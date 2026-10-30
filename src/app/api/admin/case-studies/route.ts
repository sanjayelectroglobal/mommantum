import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"

// GET /api/admin/case-studies - List case studies
export async function GET(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data, error } = await supabaseAdmin
      .from("case_studies")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data || [])
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/admin/case-studies - Create case study
export async function POST(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { title, slug, category, tagline, about, challenge, overview, solution, insights, image, accent, what_we_did, results, metrics } = body

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("case_studies")
      .insert({
        title,
        slug,
        category: category || "",
        tagline: tagline || "",
        about: about || "",
        challenge: challenge || "",
        overview: overview || "",
        solution: solution || "",
        insights: insights || "",
        image: image || "",
        accent: accent || "#e61e73",
        what_we_did: what_we_did || [],
        results: results || [],
        metrics: metrics || [],
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    await revalidateContent({ type: "case-study", slug: data?.slug || slug })
    return NextResponse.json({ ok: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
