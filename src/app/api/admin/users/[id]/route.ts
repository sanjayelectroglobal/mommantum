import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole, getUserSession } from "@lib/auth-helpers"

// Owner email defined as system constant
const OWNER_EMAIL = "admin@mommantum.com"

// PUT /api/admin/users/[id] - Update a user (email, role, optional password)
export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Only admins can modify users
    if (!(await verifyUserRole(req, ["admin"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await props.params
    const session = await getUserSession(req)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { email, password, role, status } = body

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      )
    }

    if (!["admin", "manager", "seo"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role value" },
        { status: 400 }
      )
    }

    // 2. Fetch the target user's current profile from database
    const { data: targetProfile, error: getProfileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single()

    if (getProfileError || !targetProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // 3. OWNER PROTECTION: If target is owner, only the owner can modify it (e.g. to change password)
    if (targetProfile.email === OWNER_EMAIL && session.email !== OWNER_EMAIL) {
      return NextResponse.json(
        { error: "Only the owner (admin@mommantum.com) can modify their own account." },
        { status: 403 }
      )
    }

    // 4. OWNER PROTECTION: Prevent demotion, status changes, or changing email of the owner
    if (targetProfile.email === OWNER_EMAIL) {
      if (role !== "admin") {
        return NextResponse.json(
          { error: "The owner account must remain an Admin." },
          { status: 400 }
        )
      }
      if (email !== OWNER_EMAIL) {
        return NextResponse.json(
          { error: "The owner account email address cannot be changed." },
          { status: 400 }
        )
      }
      if (status && status !== "approved") {
        return NextResponse.json(
          { error: "The owner account status must remain Approved." },
          { status: 400 }
        )
      }
    }

    // 5. SELF PROTECTION: Logged-in admin cannot demote themselves or lock themselves out
    if (targetProfile.email === session.email) {
      if (role !== "admin") {
        return NextResponse.json(
          { error: "You cannot demote yourself from the Admin role." },
          { status: 400 }
        )
      }
      if (status && status !== "approved") {
        return NextResponse.json(
          { error: "You cannot change your own status to non-approved." },
          { status: 400 }
        )
      }
    }

    // Validate status if provided
    if (status && !["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      )
    }

    // 6. Update user credentials in Supabase Auth
    const updateData: { email?: string; password?: string } = { email }
    if (password && password.trim().length >= 6) {
      updateData.password = password
    }

    const { data: authData, error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
      id,
      updateData
    )

    if (authUpdateError) {
      return NextResponse.json(
        { error: authUpdateError.message || "Failed to update authentication details" },
        { status: 500 }
      )
    }

    // 7. Update profile role/email/status in public.profiles table
    const profileUpdate: { email: string; role: string; status?: string } = { email, role }
    if (status) {
      profileUpdate.status = status
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update(profileUpdate)
      .eq("id", id)

    if (profileError) {
      return NextResponse.json(
        { error: "Updated user auth but failed to update their role profile" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: "User updated successfully",
      user: {
        id,
        email,
        role,
      },
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// DELETE /api/admin/users/[id] - Delete a user
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Only admins can delete users
    if (!(await verifyUserRole(req, ["admin"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await props.params
    const session = await getUserSession(req)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Fetch the target user's profile
    const { data: targetProfile, error: getProfileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single()

    if (getProfileError || !targetProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // 3. OWNER PROTECTION: The owner cannot be deleted
    if (targetProfile.email === OWNER_EMAIL) {
      return NextResponse.json(
        { error: "The owner account (admin@mommantum.com) cannot be deleted." },
        { status: 403 }
      )
    }

    // 4. SELF PROTECTION: An admin cannot delete their own account
    if (targetProfile.email === session.email) {
      return NextResponse.json(
        { error: "You cannot delete your own administrative account." },
        { status: 400 }
      )
    }

    // 5. Delete the user from Supabase Auth
    // Because of profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
    // this will automatically delete the profile row.
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(id)

    if (authDeleteError) {
      return NextResponse.json(
        { error: authDeleteError.message || "Failed to delete user from authentication" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
