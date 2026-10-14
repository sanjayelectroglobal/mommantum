import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole } from "@lib/auth-helpers"

const BLOG_IMAGES_BUCKET = "blog-images"

function sanitizeFileName(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() || "webp"
  const baseName = name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)

  return `${baseName || "blog-image"}-${Date.now()}.${extension}`
}

// GET /api/admin/blog/images - List images
export async function GET(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager", "seo"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data, error } = await supabaseAdmin.storage
      .from(BLOG_IMAGES_BUCKET)
      .list("", {
        limit: 200,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const imageFiles = (data || []).filter((file) =>
      file.name !== ".emptyFolderPlaceholder" &&
      file.name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)
    )

    const images = imageFiles.map((file) => ({
      name: file.name,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BLOG_IMAGES_BUCKET}/${file.name}`,
      created_at: file.created_at,
    }))

    return NextResponse.json({ images })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/admin/blog/images - Upload base64 image
export async function POST(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager", "seo"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json() as {
      name?: string
      type?: string
      data?: string
    }

    if (!body?.name || !body?.type || !body?.data) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 })
    }

    if (!body.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    const path = sanitizeFileName(body.name)
    const bytes = Buffer.from(body.data, "base64")

    const { error } = await supabaseAdmin.storage
      .from(BLOG_IMAGES_BUCKET)
      .upload(path, bytes, {
        contentType: body.type,
        upsert: false,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      name: path,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BLOG_IMAGES_BUCKET}/${path}`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/admin/blog/images - Delete image
export async function DELETE(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager", "seo"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const name = searchParams.get("name")

    if (!name) {
      return NextResponse.json({ error: "Image name is required" }, { status: 400 })
    }

    const { error } = await supabaseAdmin.storage
      .from(BLOG_IMAGES_BUCKET)
      .remove([name])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, message: "Image deleted successfully" })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

