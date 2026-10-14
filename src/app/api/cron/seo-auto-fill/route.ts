import { NextRequest, NextResponse } from "next/server"
import { AiSeoService } from "@lib/services/ai-seo-service"

export async function GET(req: NextRequest) {
  return handleCronJob(req)
}

export async function POST(req: NextRequest) {
  return handleCronJob(req)
}

async function handleCronJob(req: NextRequest) {
  try {
    // Optional secret verification if CRON_SECRET is configured
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret) {
      const authHeader = req.headers.get("authorization")
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 })
      }
    }

    const result = await AiSeoService.runAutoFillJob({
      limit: 100,
      force: false,
    })

    return NextResponse.json({
      success: true,
      job: "Scheduled 1st of Month SEO AI Auto-Fill",
      schedule: "0 0 1 * *",
      result,
    })
  } catch (err: any) {
    console.error("Cron /api/cron/seo-auto-fill failed:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
