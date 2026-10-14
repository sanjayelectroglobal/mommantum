import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyUserRole } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const slug = body.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    const { error } = await supabaseAdmin.from("services").insert({
      slug,
      title: body.title,
      short_label: body.shortLabel,
      description: body.description,
      intro: body.intro,
      image: body.image || "",
      points: body.points || [],
      outcomes: body.outcomes || [],
      why_it_matters: body.whyItMatters || [],
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    await revalidateContent({ type: "service", slug })
    return NextResponse.json({ ok: true, slug })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
