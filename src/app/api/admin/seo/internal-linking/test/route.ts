import { NextRequest, NextResponse } from "next/server"
import { verifyUserRole } from "@lib/auth-helpers"
import { LinkingService } from "@lib/services/linking-service"

export async function GET(req: NextRequest) {
  try {
    // 1. Authorize user (allow bypassing in development for easy verification)
    const isDev = process.env.NODE_ENV === "development"
    if (!isDev && !(await verifyUserRole(req, ["admin", "manager", "seo"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const results: any = {}

    // Test 1: OpenAI Embedding Generation
    try {
      const testText = "Mommentum performance marketing and SEO growth engine."
      const embedding = await LinkingService.generateEmbedding(testText)
      results.openai = {
        success: true,
        dimensions: embedding.length,
        slice: embedding.slice(0, 5)
      }
    } catch (err: any) {
      results.openai = { success: false, error: err.message }
    }

    // Test 2: Database Sync and Recalculate
    try {
      const syncRes = await LinkingService.syncEmbeddings()
      results.sync = { success: true, ...syncRes }

      const recalcRes = await LinkingService.recalculateSuggestions()
      results.recalc = { success: true, ...recalcRes }
    } catch (err: any) {
      results.database = {
        success: false,
        error: err.message,
        hint: "This is expected if pgvector has not been enabled or tables are missing in Supabase."
      }
    }

    return NextResponse.json({ testResults: results })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
