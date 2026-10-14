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

// GET /api/admin/products/[id]
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await props.params

    const { data: product, error: pErr } = await supabaseAdmin
      .from("product")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle()

    if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 })
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 })

    const { data: variants } = await supabaseAdmin
      .from("product_variant")
      .select("*")
      .eq("product_id", id)
      .is("deleted_at", null)

    const formattedProduct = { ...product, variants: [] as any[] }

    if (variants && variants.length > 0) {
      const variantIds = variants.map((v) => v.id)
      const { data: pvps } = await supabaseAdmin
        .from("product_variant_price_set")
        .select("*")
        .in("variant_id", variantIds)

      let pricesByPriceSet: Record<string, any[]> = {}
      if (pvps && pvps.length > 0) {
        const priceSetIds = pvps.map((p) => p.price_set_id)
        const { data: prices } = await supabaseAdmin
          .from("price")
          .select("*")
          .in("price_set_id", priceSetIds)
          .is("deleted_at", null)

        ;(prices || []).forEach((p) => {
          pricesByPriceSet[p.price_set_id] = pricesByPriceSet[p.price_set_id] || []
          pricesByPriceSet[p.price_set_id].push(p)
        })
      }

      const priceSetByVariant = (pvps || []).reduce((acc: any, item: any) => {
        acc[item.variant_id] = item.price_set_id
        return acc
      }, {})

      formattedProduct.variants = variants.map((v: any) => {
        const priceSetId = priceSetByVariant[v.id]
        const prices = priceSetId ? (pricesByPriceSet[priceSetId] || []) : []
        return {
          ...v,
          price_set_id: priceSetId,
          prices: prices.map((p) => ({
            id: p.id,
            currency_code: p.currency_code,
            amount: parseFloat(p.amount),
          })),
        }
      })
    }

    return NextResponse.json(formattedProduct)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT /api/admin/products/[id]
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
    const { title, handle, description, thumbnail, status, price, sku, inventory_quantity, collection_id } = body

    if (!title || !handle) {
      return NextResponse.json({ error: "Title and handle are required" }, { status: 400 })
    }

    // Update product
    const { error: pErr } = await supabaseAdmin
      .from("product")
      .update({
        title,
        handle,
        description,
        thumbnail,
        status,
        collection_id: collection_id || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 })

    // Find first variant
    const { data: variants } = await supabaseAdmin
      .from("product_variant")
      .select("*")
      .eq("product_id", id)
      .is("deleted_at", null)
      .limit(1)

    if (variants && variants.length > 0) {
      const variant = variants[0]
      // Update variant SKU and inventory
      await supabaseAdmin
        .from("product_variant")
        .update({
          sku: sku || variant.sku,
          inventory_quantity: inventory_quantity !== undefined ? parseInt(inventory_quantity) : variant.inventory_quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", variant.id)

      // Find price_set
      const { data: pvp } = await supabaseAdmin
        .from("product_variant_price_set")
        .select("price_set_id")
        .eq("variant_id", variant.id)
        .maybeSingle()

      if (pvp) {
        // Update or Insert Price
        const rawPrice = price !== undefined ? parseFloat(price) : 0
        const { data: existingPrice } = await supabaseAdmin
          .from("price")
          .select("id")
          .eq("price_set_id", pvp.price_set_id)
          .limit(1)
          .maybeSingle()

        if (existingPrice) {
          await supabaseAdmin
            .from("price")
            .update({
              amount: rawPrice,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingPrice.id)
        } else {
          await supabaseAdmin.from("price").insert({
            id: generateId("price"),
            price_set_id: pvp.price_set_id,
            currency_code: "inr",
            amount: rawPrice,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id]
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
      .from("product")
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Soft delete variants too
    await supabaseAdmin
      .from("product_variant")
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("product_id", id)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
