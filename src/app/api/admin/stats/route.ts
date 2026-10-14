import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole } from "@lib/auth-helpers"

export async function GET(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager", "seo"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Run count queries in parallel using head: true (no rows returned, extremely fast)
    const [
      blogRes,
      servicesRes,
      productsRes,
      collectionsRes,
      categoriesRes,
      ordersRes,
    ] = await Promise.all([
      supabaseAdmin.from("post").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabaseAdmin.from("services").select("slug", { count: "exact", head: true }),
      supabaseAdmin.from("product").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabaseAdmin.from("product_collection").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabaseAdmin.from("product_category").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabaseAdmin.from("order").select("id", { count: "exact", head: true }).is("deleted_at", null),
    ])

    return NextResponse.json({
      blog: blogRes.count || 0,
      services: servicesRes.count || 0,
      products: productsRes.count || 0,
      collections: collectionsRes.count || 0,
      categories: categoriesRes.count || 0,
      orders: ordersRes.count || 0,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
