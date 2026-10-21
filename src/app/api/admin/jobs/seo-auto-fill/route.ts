import { NextRequest, NextResponse } from "next/server"
import { AiSeoService } from "@lib/services/ai-seo-service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { type, id, force, limit } = body

    // Phase 4: Updated allowed types to remove store product/category; only service, blog, page remain.
    const result = await AiSeoService.runAutoFillJob({
      type: type as "service" | "blog" | "page" | undefined,
      id: id ? String(id) : undefined,
      force: Boolean(force),
      limit: limit ? Number(limit) : 100,
    })

    return NextResponse.json({
      success: true,
      message: `SEO Auto-Fill Job completed. Updated: ${result.updatedCount}/${result.processedCount}`,
      data: result,
    })
  } catch (err: any) {
    console.error("API /admin/jobs/seo-auto-fill error:", err)
    return NextResponse.json(
      { success: false, error: err.message || "Failed to execute SEO Auto-Fill job" },
      { status: 500 }
    )
  }
}
