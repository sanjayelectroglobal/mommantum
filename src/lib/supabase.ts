import { createClient } from "@supabase/supabase-js"

const isBrowser = typeof window !== "undefined"

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://zuwgqlwrkhmlmcvaqxyl.supabase.co"

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1d2dxbHdya2htbG1jdmFxeHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTU4MDQsImV4cCI6MjEwMDg5MTgwNH0.hPPVUAGotMfVzHbClp7v8Q496_sgRLbwo9Q6zMYNjQI"

// Custom cookie storage for PKCE flow verifier sharing with server
const cookieStorage = {
  getItem(key: string) {
    if (!isBrowser) return null
    const name = key + "="
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
      }
    }
    return null
  },
  setItem(key: string, value: string) {
    if (!isBrowser) return
    const d = new Date()
    d.setTime(d.getTime() + (2 * 60 * 60 * 1000)) // 2 hours is more than enough for OAuth redirects
    const expires = "expires=" + d.toUTCString()
    const secureFlag = window.location.protocol === "https:" ? "Secure;" : ""
    document.cookie = `${key}=${value};${expires};path=/;SameSite=Lax;${secureFlag}`
  },
  removeItem(key: string) {
    if (!isBrowser) return
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax;`
  }
}

// Public client — for storefront pages
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: "pkce",
      storage: cookieStorage,
    },
  }
)