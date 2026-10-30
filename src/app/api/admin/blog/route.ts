import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"

// Helper to generate IDs
function generateId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`
}

// GET /api/admin/blog - List posts from 'post' table
export async function GET(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager", "seo"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data, error } = await supabaseAdmin
      .from("post")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data || [])
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/admin/blog - Create new post in 'post' table
export async function POST(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager", "seo"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { title, slug, category_id, featured_image, image_urls, excerpt, content, author_name, meta_title, meta_description, status, faqs } = body

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 })
    }

    const id = generateId("post")
    const { data, error } = await supabaseAdmin
      .from("post")
      .insert({
        id,
        title,
        slug,
        category_id: category_id || null,
        featured_image: featured_image || "",
        image_urls: image_urls || [],
        excerpt: excerpt || "",
        content: content || "",
        author_name: author_name || "Mommantum Team",
        meta_title: meta_title || title,
        meta_description: meta_description || excerpt || "",
        status: status || "draft",
        faqs: faqs || [],
        published_at: status === "published" ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await revalidateContent({ type: "blog", slug: data?.slug || slug })
    return NextResponse.json({ ok: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}