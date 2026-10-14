import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole } from "@lib/auth-helpers"

// GET /api/admin/users - List all users
export async function GET(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("email", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(profiles || [])
  } catch (error) {
    console.error("Fetch users error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// POST /api/admin/users - Create a new user with role
export async function POST(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { email, password, role } = await req.json()

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 }
      )
    }

    if (!["admin", "manager", "seo"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role value" },
        { status: 400 }
      )
    }


    // Create user in Supabase Auth
    const { data: newUserData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError || !newUserData.user) {
      return NextResponse.json(
        { error: authError?.message || "Failed to create user in authentication" },
        { status: 500 }
      )
    }

    // Explicitly update role and status in profiles table (trigger will insert default 'seo', we overwrite it)
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ role, status: "approved" })
      .eq("id", newUserData.user.id)

    if (profileError) {
      return NextResponse.json(
        { error: "Created user but failed to update their role profile" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: "User created successfully",
      user: {
        id: newUserData.user.id,
        email: newUserData.user.email,
        role,
      },
    })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
