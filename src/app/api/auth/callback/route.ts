import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { supabaseAdmin } from "@lib/supabase-admin"

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://zuwgqlwrkhmlmcvaqxyl.supabase.co"

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1d2dxbHdya2htbG1jdmFxeHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTU4MDQsImV4cCI6MjEwMDg5MTgwNH0.hPPVUAGotMfVzHbClp7v8Q496_sgRLbwo9Q6zMYNjQI"

export async function GET(req: NextRequest) {
  let adminPathPrefix = "admin"
  try {
    const { data: siteSetting } = await supabaseAdmin
      .from("site_setting")
      .select("custom_admin_path")
      .limit(1)
    if (siteSetting && siteSetting.length > 0 && siteSetting[0].custom_admin_path) {
      adminPathPrefix = siteSetting[0].custom_admin_path
    }
  } catch (err) {
    console.error("Callback route failed to fetch custom admin path:", err)
  }

  try {
    const requestUrl = new URL(req.url)
    const code = requestUrl.searchParams.get("code")

    if (!code) {
      return NextResponse.redirect(new URL(`/${adminPathPrefix}?error=No+code+provided`, req.url))
    }

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        auth: {
          flowType: "pkce",
          storage: {
            getItem(key: string) {
              return req.cookies.get(key)?.value || null
            },
            setItem() {},
            removeItem() {},
          }
        },
      }
    )

    // Exchange PKCE code for a session
    const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code)

    if (authError || !authData.session) {
      return NextResponse.redirect(
        new URL(`/${adminPathPrefix}?error=${encodeURIComponent(authError?.message || "Exchange failed")}`, req.url)
      )
    }

    // Fetch user profile and role
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role, status")
      .eq("id", authData.user.id)
      .single()

    // If profile doesn't exist, we will create one default role 'seo' with status 'pending'
    let role = "seo"
    let status = "pending"
    if (profileError || !profile) {
      const { data: newProfile } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          role: "seo",
          status: "pending"
        })
        .select("role, status")
        .single()
        
      if (newProfile) {
        role = newProfile.role
        status = newProfile.status
      }
    } else {
      role = profile.role
      status = profile.status
    }

    // If the account is not approved yet, redirect to login page with error (no session cookies set)
    if (status !== "approved") {
      const errorMsg = status === "rejected"
        ? "Your access request has been rejected"
        : "Your access request is pending approval"
      return NextResponse.redirect(
        new URL(`/${adminPathPrefix}?error=${encodeURIComponent(errorMsg)}`, req.url)
      )
    }

    const targetPath = role === "seo" ? `/${adminPathPrefix}/blog` : `/${adminPathPrefix}`
    const redirectResponse = NextResponse.redirect(new URL(targetPath, req.url))

    // Set secure HTTP-only cookies for the session tokens
    redirectResponse.cookies.set("sb-access-token", authData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: authData.session.expires_in,
      path: "/",
      sameSite: "lax",
    })

    redirectResponse.cookies.set("sb-refresh-token", authData.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "lax",
    })

    return redirectResponse
  } catch (error) {
    console.error("Auth callback error:", error)
    return NextResponse.redirect(new URL(`/${adminPathPrefix}?error=Server+error`, req.url))
  }
}
