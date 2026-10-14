import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { createServerClient } from "@lib/supabase-server"

// Helper to generate IDs
function generateId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`
}

// Helper to calculate cart totals in cents
async function calculateCartTotal(cartId: string): Promise<number> {
  const { data: items } = await supabaseAdmin
    .from("cart_line_item")
    .select("unit_price, quantity")
    .eq("cart_id", cartId)

  const { data: shipping } = await supabaseAdmin
    .from("cart_shipping_method")
    .select("amount")
    .eq("cart_id", cartId)
    .maybeSingle()

  const itemsTotal = (items || []).reduce(
    (sum, item) => sum + parseFloat(item.unit_price || "0") * item.quantity,
    0
  )
  const shippingTotal = shipping ? parseFloat(shipping.amount || "0") : 0

  return Math.round(itemsTotal + shippingTotal)
}

// 1. GET /api/store/regions
async function handleGetRegions() {
  const { data: regions, error: rError } = await supabaseAdmin
    .from("region")
    .select("*")
    .is("deleted_at", null)

  if (rError || !regions) {
    return NextResponse.json({ regions: [] })
  }

  const { data: countries } = await supabaseAdmin
    .from("region_country")
    .select("*")
    .is("deleted_at", null)

  const countriesByRegion = (countries || []).reduce((acc: any, c: any) => {
    if (c.region_id) {
      acc[c.region_id] = acc[c.region_id] || []
      acc[c.region_id].push({
        id: c.iso_2,
        iso_2: c.iso_2,
        iso_3: c.iso_3,
        num_code: c.num_code,
        name: c.name,
        display_name: c.display_name,
      })
    }
    return acc;
  }, {})

  const formatted = regions.map((r: any) => ({
    ...r,
    countries: countriesByRegion[r.id] || [],
  }))

  return NextResponse.json({ regions: formatted })
}

// 2. GET /api/store/regions/[id]
async function handleGetRegion(id: string) {
  const { data: region, error: rError } = await supabaseAdmin
    .from("region")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle()

  if (rError || !region) {
    return NextResponse.json({ error: "Region not found" }, { status: 404 })
  }

  const { data: countries } = await supabaseAdmin
    .from("region_country")
    .select("*")
    .eq("region_id", id)
    .is("deleted_at", null)

  return NextResponse.json({
    region: {
      ...region,
      countries: countries || [],
    },
  })
}

// 3. GET /api/store/products
async function handleGetProducts(req: NextRequest) {
  const url = new URL(req.url)
  const handle = url.searchParams.get("handle")
  const id = url.searchParams.get("id")
  const limit = parseInt(url.searchParams.get("limit") || "100")
  const offset = parseInt(url.searchParams.get("offset") || "0")

  let q = supabaseAdmin.from("product").select("*", { count: "exact" }).is("deleted_at", null)
  if (handle) {
    q = q.eq("handle", handle)
  }
  if (id) {
    q = q.eq("id", id)
  }
  
  q = q.range(offset, offset + limit - 1)
  const { data: products, count, error } = await q

  if (error || !products || products.length === 0) {
    return NextResponse.json({ products: [], count: 0 })
  }

  const productIds = products.map((p) => p.id)
  const { data: variants } = await supabaseAdmin
    .from("product_variant")
    .select("*")
    .in("product_id", productIds)
    .is("deleted_at", null)

  let formattedProducts = [...products]

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
        .is("deleted_at", null);

      (prices || []).forEach((p) => {
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
      const primaryPrice = prices[0] || { amount: 0, currency_code: "inr" }
      return {
        ...v,
        prices: prices.map((p) => ({
          id: p.id,
          currency_code: p.currency_code,
          amount: parseFloat(p.amount),
        })),
        calculated_price: {
          id: primaryPrice.id,
          currency_code: primaryPrice.currency_code,
          amount: parseFloat(primaryPrice.amount),
        },
      }
    })

    const variantsByProduct = variantsWithPrices.reduce((acc: any, v: any) => {
      acc[v.product_id] = acc[v.product_id] || []
      acc[v.product_id].push(v)
      return acc
    }, {})

    formattedProducts = products.map((p: any) => ({
      ...p,
      variants: variantsByProduct[p.id] || [],
    }))
  }

  return NextResponse.json({ products: formattedProducts, count })
}

// 4. GET /api/store/collections
async function handleGetCollections() {
  const { data: collections, error } = await supabaseAdmin
    .from("product_collection")
    .select("*")
    .is("deleted_at", null)
  if (error || !collections) {
    return NextResponse.json({ collections: [], count: 0 })
  }
  return NextResponse.json({ collections, count: collections.length })
}

// 5. GET /api/store/collections/[id]
async function handleGetCollection(idOrHandle: string) {
  const { data: collection, error } = await supabaseAdmin
    .from("product_collection")
    .select("*")
    .or(`id.eq.${idOrHandle},handle.eq.${idOrHandle}`)
    .is("deleted_at", null)
    .maybeSingle()

  if (error || !collection) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 })
  }

  return NextResponse.json({ collection })
}

// 6. GET /api/store/shipping-options
async function handleGetShippingOptions() {
  const { data: options, error } = await supabaseAdmin
    .from("shipping_option")
    .select("*")
    .is("deleted_at", null)

  if (error || !options || options.length === 0) {
    return NextResponse.json({
      shipping_options: [
        {
          id: "so_free",
          name: "Standard Shipping",
          price_type: "flat",
          amount: 0,
          currency_code: "inr",
          data: {},
        },
      ],
    })
  }

  return NextResponse.json({ shipping_options: options })
}

// 7. POST /api/store/carts
async function handleCreateCart(req: NextRequest) {
  const body = await req.json()
  const cartId = generateId("cart")

  const { data: cart, error } = await supabaseAdmin
    .from("cart")
    .insert({
      id: cartId,
      region_id: body.region_id,
      locale: body.locale || "en",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ cart: { ...cart, items: [] } })
}

// 8. GET /api/store/carts/[id]
async function handleGetCart(id: string) {
  const { data: cart, error } = await supabaseAdmin
    .from("cart")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle()

  if (error || !cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 })
  }

  const { data: items } = await supabaseAdmin
    .from("cart_line_item")
    .select("*")
    .eq("cart_id", id)
    .is("deleted_at", null)

  let shippingAddress = null
  if (cart.shipping_address_id) {
    const { data: sAddr } = await supabaseAdmin
      .from("cart_address")
      .select("*")
      .eq("id", cart.shipping_address_id)
      .maybeSingle()
    shippingAddress = sAddr
  }

  let billingAddress = null
  if (cart.billing_address_id) {
    const { data: bAddr } = await supabaseAdmin
      .from("cart_address")
      .select("*")
      .eq("id", cart.billing_address_id)
      .maybeSingle()
    billingAddress = bAddr
  }

  return NextResponse.json({
    cart: {
      ...cart,
      items: items || [],
      shipping_address: shippingAddress,
      billing_address: billingAddress,
    },
  })
}

// 9. POST /api/store/carts/[id]
async function handleUpdateCart(id: string, req: NextRequest) {
  const body = await req.json()
  const updates: any = {}
  
  if (body.email !== undefined) updates.email = body.email
  if (body.region_id !== undefined) updates.region_id = body.region_id
  if (body.locale !== undefined) updates.locale = body.locale

  if (body.shipping_address) {
    const addrId = generateId("addr")
    await supabaseAdmin.from("cart_address").insert({
      id: addrId,
      ...body.shipping_address,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    updates.shipping_address_id = addrId
  }

  if (body.billing_address) {
    const addrId = generateId("addr")
    await supabaseAdmin.from("cart_address").insert({
      id: addrId,
      ...body.billing_address,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    updates.billing_address_id = addrId
  }

  if (Object.keys(updates).length > 0) {
    updates.updated_at = new Date().toISOString()
    await supabaseAdmin.from("cart").update(updates).eq("id", id)
  }

  return handleGetCart(id)
}

// 10. POST /api/store/carts/[id]/line-items
async function handleAddLineItem(cartId: string, req: NextRequest) {
  const body = await req.json()
  const { variant_id, quantity } = body

  const { data: variant } = await supabaseAdmin
    .from("product_variant")
    .select("*")
    .eq("id", variant_id)
    .maybeSingle()

  if (!variant) {
    return NextResponse.json({ error: "Variant not found" }, { status: 404 })
  }

  const { data: product } = await supabaseAdmin
    .from("product")
    .select("*")
    .eq("id", variant.product_id)
    .maybeSingle()

  const { data: pvps } = await supabaseAdmin
    .from("product_variant_price_set")
    .select("*")
    .eq("variant_id", variant_id)
    .maybeSingle()

  let amount = 0
  if (pvps) {
    const { data: price } = await supabaseAdmin
      .from("price")
      .select("*")
      .eq("price_set_id", pvps.price_set_id)
      .limit(1)
      .maybeSingle()
    if (price) {
      amount = parseFloat(price.amount || "0")
    }
  }

  const { data: existing } = await supabaseAdmin
    .from("cart_line_item")
    .select("*")
    .eq("cart_id", cartId)
    .eq("variant_id", variant_id)
    .is("deleted_at", null)
    .maybeSingle()

  if (existing) {
    await supabaseAdmin
      .from("cart_line_item")
      .update({
        quantity: existing.quantity + quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
  } else {
    const itemId = generateId("item")
    await supabaseAdmin.from("cart_line_item").insert({
      id: itemId,
      cart_id: cartId,
      variant_id: variant_id,
      quantity: quantity,
      product_id: variant.product_id,
      title: variant.title,
      product_title: product?.title || "",
      product_description: product?.description || "",
      thumbnail: variant.thumbnail || product?.thumbnail || "",
      unit_price: amount,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }

  return handleGetCart(cartId)
}

// 11. POST /api/store/carts/[id]/line-items/[lineId]
async function handleUpdateLineItem(cartId: string, lineId: string, req: NextRequest) {
  const body = await req.json()
  const { quantity } = body

  await supabaseAdmin
    .from("cart_line_item")
    .update({
      quantity,
      updated_at: new Date().toISOString(),
    })
    .eq("id", lineId)
    .eq("cart_id", cartId)

  return handleGetCart(cartId)
}

// 12. DELETE /api/store/carts/[id]/line-items/[lineId]
async function handleDeleteLineItem(cartId: string, lineId: string) {
  await supabaseAdmin
    .from("cart_line_item")
    .delete()
    .eq("id", lineId)
    .eq("cart_id", cartId)

  const cartRes = await handleGetCart(cartId)
  const cartData = await cartRes.json()
  
  return NextResponse.json({
    parent: cartData.cart,
    deleted: true,
  })
}

// 13. POST /api/store/carts/[id]/shipping-methods
async function handleAddShippingMethod(cartId: string, req: NextRequest) {
  const body = await req.json()
  const { option_id } = body

  const methodId = generateId("sm")
  let name = "Standard Shipping"
  let amount = 0

  if (option_id && option_id !== "so_free") {
    const { data: option } = await supabaseAdmin
      .from("shipping_option")
      .select("*")
      .eq("id", option_id)
      .maybeSingle()
    if (option) {
      name = option.name
      amount = parseFloat(option.amount || "0")
    }
  }

  await supabaseAdmin.from("cart_shipping_method").delete().eq("cart_id", cartId)
  await supabaseAdmin.from("cart_shipping_method").insert({
    id: methodId,
    cart_id: cartId,
    name: name,
    amount: amount,
    shipping_option_id: option_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  return handleGetCart(cartId)
}

// 14. POST /api/store/payment-collections
async function handleCreatePaymentCollection(req: NextRequest) {
  const body = await req.json()
  const { cart_id } = body
  const total = await calculateCartTotal(cart_id)

  return NextResponse.json({
    payment_collection: {
      id: `pay_col_${cart_id}`,
      amount: total,
    },
  })
}

// 15. POST /api/store/payment-collections/[id]/payment-sessions
async function handleCreatePaymentSession(id: string) {
  const cartId = id.replace("pay_col_", "")
  const total = await calculateCartTotal(cartId)

  let clientSecret = `mock_secret_${crypto.randomUUID().replace(/-/g, "")}`

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY
  if (stripeSecretKey) {
    try {
      const stripeRes = await fetch("https://api.stripe.com/v1/payment_intents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          amount: total.toString(),
          currency: "inr",
          "payment_method_types[]": "card",
        }),
      })
      
      if (stripeRes.ok) {
        const stripeData = await stripeRes.json()
        clientSecret = stripeData.client_secret
      } else {
        const errData = await stripeRes.json()
        console.error("Stripe payment intent creation error:", errData)
      }
    } catch (err) {
      console.error("Failed to call Stripe API:", err)
    }
  }

  return NextResponse.json({
    payment_collection: {
      id,
      payment_sessions: [
        {
          id: `pay_sess_${cartId}`,
          provider_id: "pp_stripe_stripe",
          status: "pending",
          data: {
            client_secret: clientSecret,
          },
        },
      ],
    },
  })
}

// 16. POST /api/store/carts/[id]/complete
async function handleCompleteCart(cartId: string) {
  const { data: cart, error } = await supabaseAdmin
    .from("cart")
    .select("*")
    .eq("id", cartId)
    .maybeSingle()

  if (error || !cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 })
  }

  const { data: items } = await supabaseAdmin
    .from("cart_line_item")
    .select("*")
    .eq("cart_id", cartId)
    .is("deleted_at", null)

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
  }

  const orderId = generateId("order")

  let orderShippingAddrId = null
  if (cart.shipping_address_id) {
    const { data: cartAddr } = await supabaseAdmin
      .from("cart_address")
      .select("*")
      .eq("id", cart.shipping_address_id)
      .maybeSingle()
    if (cartAddr) {
      orderShippingAddrId = generateId("addr")
      const { id, ...addrFields } = cartAddr
      await supabaseAdmin.from("order_address").insert({
        id: orderShippingAddrId,
        ...addrFields,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }
  }

  let orderBillingAddrId = null
  if (cart.billing_address_id) {
    const { data: cartAddr } = await supabaseAdmin
      .from("cart_address")
      .select("*")
      .eq("id", cart.billing_address_id)
      .maybeSingle()
    if (cartAddr) {
      orderBillingAddrId = generateId("addr")
      const { id, ...addrFields } = cartAddr
      await supabaseAdmin.from("order_address").insert({
        id: orderBillingAddrId,
        ...addrFields,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }
  }

  const displayId = Math.floor(100000 + Math.random() * 900000)
  const { data: order, error: oError } = await supabaseAdmin
    .from("order")
    .insert({
      id: orderId,
      region_id: cart.region_id,
      display_id: displayId,
      customer_id: cart.customer_id,
      email: cart.email,
      currency_code: cart.currency_code || "inr",
      shipping_address_id: orderShippingAddrId,
      billing_address_id: orderBillingAddrId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (oError) {
    return NextResponse.json({ error: oError.message }, { status: 500 })
  }

  for (const item of items) {
    const orderLineItemId = generateId("oli")
    const { id, cart_id, ...itemFields } = item
    await supabaseAdmin.from("order_line_item").insert({
      id: orderLineItemId,
      ...itemFields,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    await supabaseAdmin.from("order_item").insert({
      id: generateId("oi"),
      order_id: orderId,
      version: 1,
      item_id: orderLineItemId,
      quantity: item.quantity,
      unit_price: item.unit_price,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }

  await supabaseAdmin.from("cart_line_item").delete().eq("cart_id", cartId)
  await supabaseAdmin.from("cart").update({
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", cartId)

  return NextResponse.json({
    type: "order",
    order: {
      ...order,
      items: items.map((i) => ({ ...i, id: `oli_${i.id}` })),
    },
  })
}

// 17. GET /api/store/orders/[id]
async function handleGetOrder(id: string) {
  const { data: order, error } = await supabaseAdmin
    .from("order")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle()

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

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

  return NextResponse.json({
    order: {
      ...order,
      items,
      shipping_address: shippingAddress,
    },
  })
}

// 18. GET /api/store/customers/me
async function handleGetCustomerMe() {
  try {
    const client = await createServerClient()
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
      return NextResponse.json({ customer: null })
    }

    const { data: customer } = await supabaseAdmin
      .from("customer")
      .select("*")
      .eq("email", user.email)
      .is("deleted_at", null)
      .limit(1)
      .maybeSingle()

    if (customer) {
      return NextResponse.json({ customer })
    }

    return NextResponse.json({
      customer: {
        id: user.id,
        email: user.email,
        first_name: "",
        last_name: "",
      },
    })
  } catch {
    return NextResponse.json({ customer: null })
  }
}

// Main routing entry for catch-all handler
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ path?: string[] }> }
) {
  try {
    const params = await props.params
    const path = params.path || []
    
    // GET /api/store/regions
    if (path[0] === "regions") {
      if (path[1]) {
        return handleGetRegion(path[1])
      }
      return handleGetRegions()
    }

    // GET /api/store/products
    if (path[0] === "products") {
      return handleGetProducts(req)
    }

    // GET /api/store/collections
    if (path[0] === "collections") {
      if (path[1]) {
        return handleGetCollection(path[1])
      }
      return handleGetCollections()
    }

    // GET /api/store/shipping-options
    if (path[0] === "shipping-options") {
      return handleGetShippingOptions()
    }

    // GET /api/store/carts/[id]
    if (path[0] === "carts" && path[1]) {
      return handleGetCart(path[1])
    }

    // GET /api/store/orders/[id]
    if (path[0] === "orders" && path[1]) {
      return handleGetOrder(path[1])
    }

    // GET /api/store/customers/me
    if (path[0] === "customers" && path[1] === "me") {
      return handleGetCustomerMe()
    }

    return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ path?: string[] }> }
) {
  try {
    const params = await props.params
    const path = params.path || []

    // POST /api/store/carts
    if (path[0] === "carts" && !path[1]) {
      return handleCreateCart(req)
    }

    // POST /api/store/carts/[id]
    if (path[0] === "carts" && path[1] && !path[2]) {
      return handleUpdateCart(path[1], req)
    }

    // POST /api/store/carts/[id]/line-items
    if (path[0] === "carts" && path[1] && path[2] === "line-items" && !path[3]) {
      return handleAddLineItem(path[1], req)
    }

    // POST /api/store/carts/[id]/line-items/[lineId]
    if (path[0] === "carts" && path[1] && path[2] === "line-items" && path[3]) {
      return handleUpdateLineItem(path[1], path[3], req)
    }

    // POST /api/store/carts/[id]/shipping-methods
    if (path[0] === "carts" && path[1] && path[2] === "shipping-methods") {
      return handleAddShippingMethod(path[1], req)
    }

    // POST /api/store/carts/[id]/complete
    if (path[0] === "carts" && path[1] && path[2] === "complete") {
      return handleCompleteCart(path[1])
    }

    // POST /api/store/payment-collections
    if (path[0] === "payment-collections" && !path[1]) {
      return handleCreatePaymentCollection(req)
    }

    // POST /api/store/payment-collections/[id]/payment-sessions
    if (path[0] === "payment-collections" && path[1] && path[2] === "payment-sessions") {
      return handleCreatePaymentSession(path[1])
    }

    return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ path?: string[] }> }
) {
  try {
    const params = await props.params
    const path = params.path || []

    // DELETE /api/store/carts/[id]/line-items/[lineId]
    if (path[0] === "carts" && path[1] && path[2] === "line-items" && path[3]) {
      return handleDeleteLineItem(path[1], path[3])
    }

    return NextResponse.json({ error: "Endpoint not found" }, { status: 404 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
