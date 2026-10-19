import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin, supabaseAnon } from "@lib/supabase-admin"
import { setCachedUserSession } from "@lib/auth-helpers"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()

    // Authenticate with Supabase Auth using robust server-side anon client
    const { data: authData, error: authError } = await supabaseAnon.auth.signInWithPassword({
      email: cleanEmail,
      password: password.trim(),
    })

    if (authError || !authData?.session) {
      console.error("Supabase login auth error:", authError?.message)
      return NextResponse.json(
        { error: authError?.message || "Invalid login credentials" },
        { status: 401 }
      )
    }

    // Fetch user profile and role via service role admin client
    let profile = null
    const { data: fetchedProfile } = await supabaseAdmin
      .from("profiles")
      .select("role, status")
      .eq("id", authData.user.id)
      .single()

    if (!fetchedProfile) {
      // Auto-create approved admin profile if missing
      const { data: newProfile } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: authData.user.id,
          email: authData.user.email || cleanEmail,
          role: "admin",
          status: "approved"
        })
        .select("role, status")
        .single()

      profile = newProfile || { role: "admin", status: "approved" }
    } else {
      profile = fetchedProfile
    }

    if (profile.status !== "approved") {
      const errorMsg = profile.status === "rejected"
        ? "Your access request has been rejected."
        : "Your access request is pending approval."
      return NextResponse.json(
        { error: errorMsg },
        { status: 403 }
      )
    }

    setCachedUserSession(authData.session.access_token, profile.role, authData.user.email || cleanEmail)

    const response = NextResponse.json({
      ok: true,
      message: "Login successful",
      role: profile.role,
    })

    // Set secure cookies for session tokens and role
    response.cookies.set("sb-access-token", authData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: authData.session.expires_in,
      path: "/",
      sameSite: "lax",
    })

    response.cookies.set("sb-refresh-token", authData.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "lax",
    })

    response.cookies.set("sb-role", profile.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: authData.session.expires_in,
      path: "/",
      sameSite: "lax",
    })

    return response
  } catch (error) {
    console.error("Login route server error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
