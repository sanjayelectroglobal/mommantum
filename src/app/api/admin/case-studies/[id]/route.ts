import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"

// GET /api/admin/case-studies/[id]
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await props.params
    const { data, error } = await supabaseAdmin
      .from("case_studies")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ error: "Case study not found" }, { status: 404 })

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT /api/admin/case-studies/[id]
export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await props.params
    const body = await req.json()
    const { title, slug, category, tagline, about, challenge, overview, solution, insights, image, accent, what_we_did, results, metrics } = body

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("case_studies")
      .update({
        title,
        slug,
        category,
        tagline,
        about,
        challenge,
        overview,
        solution,
        insights,
        image,
        accent,
        what_we_did,
        results,
        metrics,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    await revalidateContent({ type: "case-study", slug: data?.slug || slug })
    return NextResponse.json({ ok: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/admin/case-studies/[id]
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await props.params
    const { data: existing } = await supabaseAdmin
      .from("case_studies")
      .select("slug")
      .eq("id", id)
      .maybeSingle()

    const { error } = await supabaseAdmin
      .from("case_studies")
      .delete()
      .eq("id", id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (existing?.slug) {
      await supabaseAdmin
        .from("seo_settings")
        .delete()
        .eq("page_key", `case-study:${existing.slug}`)
      await revalidateContent({ type: "case-study", slug: existing.slug })
    } else {
      await revalidateContent({ type: "case-study" })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
