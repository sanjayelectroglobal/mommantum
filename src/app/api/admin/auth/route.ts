import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    if (!password || password !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      )
    }

    const res = NextResponse.json({ ok: true, message: "Login successful" })

    res.cookies.set("admin_auth", process.env.ADMIN_SECRET!, {
      httpOnly: true,       // JS cannot read this cookie
      secure: true,         // only sent over HTTPS
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "strict",
    })

    return res
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// Logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true, message: "Logged out" })
  res.cookies.delete("admin_auth")
  return res
}