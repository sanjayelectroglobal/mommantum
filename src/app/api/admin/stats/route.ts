import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole } from "@lib/auth-helpers"

let cachedStats: { data: any; expiry: number } | null = null

export async function GET(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager", "seo"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (cachedStats && cachedStats.expiry > Date.now()) {
      return NextResponse.json(cachedStats.data)
    }

    // Run count queries in parallel using head: true
    const [
      blogRes,
      servicesRes,
      productsRes,
      collectionsRes,
      categoriesRes,
      ordersRes,
    ] = await Promise.allSettled([
      supabaseAdmin.from("post").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabaseAdmin.from("services").select("slug", { count: "exact", head: true }),
      supabaseAdmin.from("product").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabaseAdmin.from("product_collection").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabaseAdmin.from("product_category").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabaseAdmin.from("order").select("id", { count: "exact", head: true }).is("deleted_at", null),
    ])

    const getCount = (r: PromiseSettledResult<any>) =>
      r.status === "fulfilled" && !r.value?.error ? r.value?.count || 0 : 0

    const statsData = {
      blog: getCount(blogRes),
      services: getCount(servicesRes),
      products: getCount(productsRes),
      collections: getCount(collectionsRes),
      categories: getCount(categoriesRes),
      orders: getCount(ordersRes),
    }

    cachedStats = {
      data: statsData,
      expiry: Date.now() + 60 * 1000,
    }

    return NextResponse.json(statsData)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
