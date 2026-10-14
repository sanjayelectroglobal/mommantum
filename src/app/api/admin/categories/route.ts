import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyUserRole } from "@lib/auth-helpers"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper to generate IDs
function generateId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`
}

// GET /api/admin/categories - List categories
export async function GET(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data, error } = await supabaseAdmin
      .from("product_category")
      .select("*")
      .is("deleted_at", null)
      .order("rank", { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data || [])
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/admin/categories - Create category
export async function POST(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { name, handle, description, is_active, is_internal, rank, parent_category_id } = body

    if (!name || !handle) {
      return NextResponse.json({ error: "Name and handle are required" }, { status: 400 })
    }

    const id = generateId("pcat")
    const { data, error } = await supabaseAdmin
      .from("product_category")
      .insert({
        id,
        name,
        handle,
        description: description || "",
        is_active: is_active ?? true,
        is_internal: is_internal ?? false,
        rank: rank !== undefined ? parseInt(rank) : 0,
        parent_category_id: parent_category_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
