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

    // Phase 3: Removed counts for deleted store tables (product, product_collection, product_category, order).
    // Run count queries in parallel using head: true for marketing entities only
    const [
      blogRes,
      servicesRes,
    ] = await Promise.allSettled([
      supabaseAdmin.from("post").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabaseAdmin.from("services").select("slug", { count: "exact", head: true }),
    ])

    const getCount = (r: PromiseSettledResult<any>) =>
      r.status === "fulfilled" && !r.value?.error ? r.value?.count || 0 : 0

    const statsData = {
      blog: getCount(blogRes),
      services: getCount(servicesRes),
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
