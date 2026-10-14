import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ ok: true, message: "Logged out successfully" })

  // Delete auth cookies
  response.cookies.delete("sb-access-token")
  response.cookies.delete("sb-refresh-token")

  return response
}
