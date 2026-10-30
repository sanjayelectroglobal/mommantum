import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .eq("slug", params.slug)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { error } = await supabaseAdmin
      .from("services")
      .update({
        title: body.title,
        short_label: body.shortLabel,
        description: body.description,
        intro: body.intro,
        image: body.image,
        points: body.points || [],
        outcomes: body.outcomes || [],
        why_it_matters: body.whyItMatters || [],
      })
      .eq("slug", params.slug)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    await revalidateContent({ type: "service", slug: params.slug })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const raw = params.slug
    const decoded = decodeURIComponent(raw)

    const { error } = await supabaseAdmin
      .from("services")
      .delete()
      .or(`slug.eq."${decoded}",slug.eq."${raw}"`)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabaseAdmin
      .from("seo_settings")
      .delete()
      .or(`page_key.eq."service:${decoded}",page_key.eq."service:${raw}"`)

    await revalidateContent({ type: "service", slug: decoded })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
