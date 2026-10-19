import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyUserRole } from "@lib/auth-helpers"
import { revalidateContent } from "@lib/revalidate"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/admin/blog/[slug]
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params
    if (!(await verifyUserRole(req, ["admin", "manager", "seo"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data, error } = await supabaseAdmin
      .from("post")
      .select("*")
      .eq("slug", params.slug)
      .is("deleted_at", null)
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ error: "Post not found" }, { status: 404 })

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT /api/admin/blog/[slug]
export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params
    if (!(await verifyUserRole(req, ["admin", "manager", "seo"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { title, slug, category_id, featured_image, image_urls, excerpt, content, author_name, meta_title, meta_description, status, faqs } = body

    const { error } = await supabaseAdmin
      .from("post")
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq("slug", params.slug)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await revalidateContent({ type: "blog", slug, oldSlug: params.slug })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/admin/blog/[slug]
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params
    if (!(await verifyUserRole(req, ["admin", "manager", "seo"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const raw = params.slug || ""
    const decoded = decodeURIComponent(raw)

    // Soft delete matching by slug or id
    const { data, error } = await supabaseAdmin
      .from("post")
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .or(`slug.eq."${decoded}",id.eq."${decoded}",slug.eq."${raw}",id.eq."${raw}"`)
      .select("id, slug")

    if (error) {
      console.error("[DELETE /api/admin/blog] Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Clean up corresponding seo_setting if any
    try {
      await supabaseAdmin
        .from("seo_setting")
        .delete()
        .or(`page_key.eq."blog:${decoded}",page_key.eq."blog:${raw}"`)
    } catch {
      // ignore
    }

    await revalidateContent({ type: "blog", slug: decoded })
    return NextResponse.json({ ok: true, deleted: data })
  } catch (err: any) {
    console.error("[DELETE /api/admin/blog] Catch error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}