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

// GET /api/admin/products - List all products with variants & prices
export async function GET(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data: products, error } = await supabaseAdmin
      .from("product")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!products || products.length === 0) return NextResponse.json([])

    const productIds = products.map((p) => p.id)
    const { data: variants } = await supabaseAdmin
      .from("product_variant")
      .select("*")
      .in("product_id", productIds)
      .is("deleted_at", null)

    const formattedProducts = [...products]

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

      const variantsWithPrices = variants.map((v: any) => {
        const priceSetId = priceSetByVariant[v.id]
        const prices = priceSetId ? (pricesByPriceSet[priceSetId] || []) : []
        return {
          ...v,
          prices: prices.map((p) => ({
            id: p.id,
            currency_code: p.currency_code,
            amount: parseFloat(p.amount),
          })),
        }
      })

      const variantsByProduct = variantsWithPrices.reduce((acc: any, v: any) => {
        acc[v.product_id] = acc[v.product_id] || []
        acc[v.product_id].push(v)
        return acc
      }, {})

      return NextResponse.json(
        products.map((p: any) => ({
          ...p,
          variants: variantsByProduct[p.id] || [],
        }))
      )
    }

    return NextResponse.json(
      products.map((p: any) => ({ ...p, variants: [] }))
    )
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/admin/products - Create a new product with default variant & price
export async function POST(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { title, handle, description, thumbnail, status, price, sku, inventory_quantity, collection_id } = body

    if (!title || !handle) {
      return NextResponse.json({ error: "Title and handle are required" }, { status: 400 })
    }

    const productId = generateId("prod")

    // Insert Product
    const { data: product, error: pErr } = await supabaseAdmin
      .from("product")
      .insert({
        id: productId,
        title,
        handle,
        description: description || "",
        thumbnail: thumbnail || "",
        status: status || "draft",
        collection_id: collection_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (pErr || !product) {
      return NextResponse.json({ error: pErr?.message || "Failed to create product" }, { status: 500 })
    }

    // Insert Default Variant
    const variantId = generateId("variant")
    const { data: variant, error: vErr } = await supabaseAdmin
      .from("product_variant")
      .insert({
        id: variantId,
        product_id: productId,
        title: "Default Variant",
        sku: sku || `SKU-${productId.slice(5).toUpperCase()}`,
        inventory_quantity: inventory_quantity !== undefined ? parseInt(inventory_quantity) : 10,
        thumbnail: thumbnail || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (vErr || !variant) {
      // rollback product? Let's just return error
      return NextResponse.json({ error: vErr?.message || "Failed to create product variant" }, { status: 500 })
    }

    // Insert Price Set
    const priceSetId = generateId("pset")
    await supabaseAdmin.from("price_set").insert({ id: priceSetId })
    await supabaseAdmin.from("product_variant_price_set").insert({
      variant_id: variantId,
      price_set_id: priceSetId,
    })

    // Insert Price (in cents/INR)
    const rawPrice = price !== undefined ? parseFloat(price) : 0
    await supabaseAdmin.from("price").insert({
      id: generateId("price"),
      price_set_id: priceSetId,
      currency_code: "inr",
      amount: rawPrice,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true, id: productId })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
