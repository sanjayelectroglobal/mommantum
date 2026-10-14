import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Serverless backend is alive",
    timestamp: new Date().toISOString(),
  })
}
