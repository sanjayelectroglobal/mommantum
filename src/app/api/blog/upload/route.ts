/**
 * @file route.ts
 * @module api/blog/upload
 * @description Automated Blog Image Upload Endpoint for external pipelines (e.g., n8n).
 * 
 * Capabilities:
 * - Accepts multipart/form-data with binary image files in the `files` (or `file`) field.
 * - Enforces Bearer token authentication via N8N_API_KEY or ADMIN_SECRET.
 * - Sanitizes filenames with timestamp and entropy to prevent Supabase storage collisions.
 * - Uploads to Supabase Storage bucket `blog-images`.
 * - Returns public URLs formatted as `{ "files": [{ "url": "<public-url>" }] }`.
 */

import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"

const BLOG_IMAGES_BUCKET = "blog-images"

function sanitizeFileName(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() || "webp"
  const baseName = name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)

  return `${baseName || "blog-image"}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    endpoint: "POST /api/blog/upload",
    message: "Mommantum Blog Image Upload API is active. Send an HTTP POST request with multipart/form-data ('files' field) and Bearer authorization.",
  })
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    const expectedToken = process.env.N8N_API_KEY || process.env.ADMIN_SECRET

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    let fileEntries = formData.getAll("files")

    // Fallback if 'file' or a single entry was passed instead of 'files'
    if (fileEntries.length === 0) {
      const singleFile = formData.get("file")
      if (singleFile) {
        fileEntries = [singleFile]
      }
    }

    if (!fileEntries || fileEntries.length === 0) {
      return NextResponse.json(
        { error: "No files provided. Please attach files in multipart/form-data under the 'files' field." },
        { status: 400 }
      )
    }

    const uploadedFiles: Array<{ url: string }> = []

    for (const entry of fileEntries) {
      if (!entry || typeof entry === "string") continue
      const file = entry as File

      if (file.type && !file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: `File '${file.name}' is not a valid image` },
          { status: 400 }
        )
      }

      const path = sanitizeFileName(file.name || "upload")
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const contentType = file.type || "image/jpeg"

      const { error } = await supabaseAdmin.storage
        .from(BLOG_IMAGES_BUCKET)
        .upload(path, buffer, {
          contentType,
          upsert: false,
        })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BLOG_IMAGES_BUCKET}/${path}`
      uploadedFiles.push({ url: publicUrl })
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { error: "No valid image files found to upload" },
        { status: 400 }
      )
    }

    return NextResponse.json({ files: uploadedFiles })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 })
  }
}

