import { NextRequest, NextResponse } from "next/server"
import { verifyUserRole } from "@lib/auth-helpers"
import { LinkingService } from "@lib/services/linking-service"

export const maxDuration = 60 // Allow longer execution time if Vercel supports it

export async function POST(req: NextRequest) {
  try {
    // 1. Authorize user (allow bypassing in development for easy verification)
    const isDev = process.env.NODE_ENV === "development"
    if (!isDev && !(await verifyUserRole(req, ["admin", "manager", "seo", "content_manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    console.log("Triggering internal linking sync manually...")

    // 2. Sync Embeddings
    const syncRes = await LinkingService.syncEmbeddings()

    // 3. Recalculate Suggestions
    const recalcRes = await LinkingService.recalculateSuggestions()

    return NextResponse.json({
      success: true,
      embeddings: syncRes,
      suggestions: recalcRes
    })
  } catch (err: any) {
    console.error("Internal linking sync failed:", err.message)
    return NextResponse.json(
      { success: false, error: err.message || "Unknown error occurred" },
      { status: 500 }
    )
  }
}
