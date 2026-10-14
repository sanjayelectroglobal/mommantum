import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyUserRole } from "@lib/auth-helpers"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/admin/orders/[id] - Fetch detailed order
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await props.params

    const { data: order, error: oErr } = await supabaseAdmin
      .from("order")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle()

    if (oErr) return NextResponse.json({ error: oErr.message }, { status: 500 })
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

    const { data: links } = await supabaseAdmin
      .from("order_item")
      .select("*")
      .eq("order_id", id)
      .is("deleted_at", null)

    let items: any[] = []
    if (links && links.length > 0) {
      const lineItemIds = links.map((l) => l.item_id)
      const { data: lineItems } = await supabaseAdmin
        .from("order_line_item")
        .select("*")
        .in("id", lineItemIds)
        .is("deleted_at", null)

      items = (lineItems || []).map((li) => {
        const link = links.find((l) => l.item_id === li.id)
        return {
          ...li,
          quantity: link ? parseInt(link.quantity as any) : li.quantity,
          unit_price: link ? parseFloat(link.unit_price as any) : li.unit_price,
        }
      })
    }

    let shippingAddress = null
    if (order.shipping_address_id) {
      const { data: sAddr } = await supabaseAdmin
        .from("order_address")
        .select("*")
        .eq("id", order.shipping_address_id)
        .maybeSingle()
      shippingAddress = sAddr
    }

    let billingAddress = null
    if (order.billing_address_id) {
      const { data: bAddr } = await supabaseAdmin
        .from("order_address")
        .select("*")
        .eq("id", order.billing_address_id)
        .maybeSingle()
      billingAddress = bAddr
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + parseFloat(item.unit_price || "0") * item.quantity,
      0
    )

    return NextResponse.json({
      ...order,
      items,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      total: totalAmount,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT /api/admin/orders/[id] - Update status
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
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("order")
      .update({
        status,
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
