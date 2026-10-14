import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyUserRole } from "@lib/auth-helpers"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/admin/orders - List all orders
export async function GET(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data: orders, error } = await supabaseAdmin
      .from("order")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!orders || orders.length === 0) return NextResponse.json([])

    // Retrieve order_item sum/details if needed or return order base
    const orderIds = orders.map((o) => o.id)
    
    // Retrieve items to compute line-item totals for list view
    const { data: orderItems } = await supabaseAdmin
      .from("order_item")
      .select("order_id, quantity, unit_price")
      .in("order_id", orderIds)

    const itemsByOrder = (orderItems || []).reduce((acc: any, item: any) => {
      acc[item.order_id] = acc[item.order_id] || []
      acc[item.order_id].push(item)
      return acc
    }, {})

    const formatted = orders.map((o: any) => {
      const items = itemsByOrder[o.id] || []
      const totalAmount = items.reduce(
        (sum: number, item: any) => sum + parseFloat(item.unit_price || "0") * item.quantity,
        0
      )
      return {
        ...o,
        total: totalAmount,
        items_count: items.length,
      }
    })

    return NextResponse.json(formatted)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
