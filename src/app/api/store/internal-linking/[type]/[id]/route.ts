import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const params = await props.params
    const { type, id } = params

    if (!type || !id) {
      return NextResponse.json({ error: "Type and ID are required" }, { status: 400 })
    }

    const sourceId = `${type}:${id}`
    console.log(`Fetching link suggestions for source_id: ${sourceId}`)

    const { data: suggestions, error } = await supabaseAdmin
      .from("link_suggestion")
      .select("target_type, target_id, target_title, target_url, anchor_text, score, mode")
      .eq("source_id", sourceId)
      .eq("status", "active")
      .order("score", { ascending: false })

    if (error) {
      console.warn(`Note: Error querying link_suggestion for ${sourceId} (table may be pending creation):`, error.message)
      return NextResponse.json({ suggestions: [] })
    }

    return NextResponse.json({ suggestions: suggestions || [] })
  } catch (err: any) {
    console.error("Internal linking fetch failed:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
