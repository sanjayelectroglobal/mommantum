import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyUserRole } from "@lib/auth-helpers"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// PUT /api/admin/categories/[id]
export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await props.params
    const body = await req.json()
    const { name, handle, description, is_active, is_internal, rank, parent_category_id } = body

    if (!name || !handle) {
      return NextResponse.json({ error: "Name and handle are required" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("product_category")
      .update({
        name,
        handle,
        description: description || "",
        is_active: is_active ?? true,
        is_internal: is_internal ?? false,
        rank: rank !== undefined ? parseInt(rank) : 0,
        parent_category_id: parent_category_id || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await props.params

    // Soft delete
    const { error } = await supabaseAdmin
      .from("product_category")
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
