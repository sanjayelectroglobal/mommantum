import { NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"

export async function GET() {
  try {
    const [servicesRes, workRes] = await Promise.all([
      supabaseAdmin.from("services").select("title, slug"),
      supabaseAdmin.from("case_studies").select("title, slug")
    ])

    return NextResponse.json({
      services: servicesRes.data || [],
      work: workRes.data || []
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

