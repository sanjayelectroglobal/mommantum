/**
 * Development & Testing Direct Admin Authentication Route (/api/auth/dev-login)
 * 
 * Purpose:
 * Generates and verifies an administrative magic-link session for 'admin@mommantum.com'
 * in local development and test automation environments without manual email clicks.
 * Sets the appropriate authentication cookies ('sb-access-token', 'sb-refresh-token', 'sb-role')
 * and automatically redirects to the '/admin' dashboard.
 */

import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin, supabaseAnon } from "@lib/supabase-admin"
import { setCachedUserSession } from "@lib/auth-helpers"

export async function GET(req: NextRequest) {
  // Security Guard: Disallow automated developer login in production deployments
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not Found", { status: 404 })
  }

  try {
    const email = "admin@mommantum.com"
    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
    })

    if (linkErr || !linkData?.properties?.email_otp) {
      return NextResponse.json({ error: linkErr?.message || "Failed to generate login token" }, { status: 500 })
    }

    const { data: authData, error: authErr } = await supabaseAnon.auth.verifyOtp({
      email,
      token: linkData.properties.email_otp,
      type: "magiclink",
    })

    if (authErr || !authData?.session) {
      return NextResponse.json({ error: authErr?.message || "Failed to verify session" }, { status: 500 })
    }

    setCachedUserSession(authData.session.access_token, "admin", email)

    const response = NextResponse.redirect(new URL("/admin", req.url))

    response.cookies.set("sb-access-token", authData.session.access_token, {
      httpOnly: true,
      secure: false,
      maxAge: authData.session.expires_in || 3600,
      path: "/",
      sameSite: "lax",
    })

    response.cookies.set("sb-refresh-token", authData.session.refresh_token, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    })

    response.cookies.set("sb-role", "admin", {
      httpOnly: false,
      secure: false,
      maxAge: authData.session.expires_in || 3600,
      path: "/",
      sameSite: "lax",
    })

    return response
  } catch (err: any) {
    console.error("dev-login error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
