import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://zuwgqlwrkhmlmcvaqxyl.supabase.co"

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1d2dxbHdya2htbG1jdmFxeHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTU4MDQsImV4cCI6MjEwMDg5MTgwNH0.hPPVUAGotMfVzHbClp7v8Q496_sgRLbwo9Q6zMYNjQI"

const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1d2dxbHdya2htbG1jdmFxeHlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTMxNTgwNCwiZXhwIjoyMTAwODkxODA0fQ.ZZHljxfRDou3APHI864wh6h6iCTKCcC5rrstg-LIMYM"

// Admin client — bypasses RLS, only used in server-side API routes
export const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY
)

// Server-side anonymous client - used for token verification on server side
export const supabaseAnon = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)
