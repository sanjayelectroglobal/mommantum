# Mommantum Security Audit & Hardening Specification

> **Classification:** High-Priority Security Assessment & Remediation Blueprint  
> **Target Environment:** Next.js 15 App Router + Supabase PostgreSQL + Vercel Serverless  
> **Audit Date:** Current Baseline (October 2026)  
> **Status:** Actionable Findings & Hardening Roadmap  

---

## 1. Executive Security Assessment

A comprehensive source code review and threat analysis of the Mommantum platform identified **four (4) Critical**, **two (2) High**, and **two (2) Medium** vulnerability classes. 

Immediate hardening is required to prevent:
* Unauthorized administrative takeover.
* Unauthenticated database-wide read/write bypass.
* Scraping of customer personally identifiable information (PII).
* Denial of Wallet via unauthenticated AI API exhaustion.

---

## 2. Vulnerability Findings & Threat Analysis

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            VULNERABILITY MATRIX                             │
├──────┬─────────────────────────────────────────────────────┬────────┬───────┤
│ ID   │ Title                                               │ CVSS   │ Level │
├──────┼─────────────────────────────────────────────────────┼────────┼───────┤
│ V-01 │ Client-Controlled Role Escalation via Cookie        │ 9.8    │ CRIT  │
│ V-02 │ Hardcoded Supabase Service Role Key in Source Code   │ 9.8    │ CRIT  │
│ V-03 │ Auto-Approved Admin Account Creation on First Login │ 9.1    │ CRIT  │
│ V-04 │ Unenforced CRON_SECRET on AI Auto-Fill Endpoint     │ 7.5    │ HIGH  │
│ V-05 │ Lack of CSRF / Origin Validation on Admin APIs      │ 7.1    │ HIGH  │
│ V-06 │ Insecure Direct Object Reference (IDOR) on Carts    │ 6.5    │ MED   │
│ V-07 │ Client-Accessible `sb-role` Cookie (httpOnly=false) │ 6.5    │ MED   │
│ V-08 │ Process-Level Memory Leak in Edge Map Role Cache    │ 5.3    │ MED   │
└──────┴─────────────────────────────────────────────────────┴────────┴───────┘
```

---

### Detailed Findings

#### 🚨 V-01: Client-Controlled Role Escalation via Cookie
* **Location:** `src/lib/auth-helpers.ts` (lines 60–66) & `src/middleware.ts` (lines 149–153)
* **Vulnerability:** The session validator explicitly trusts an unsigned cookie named `sb-role`:
  ```typescript
  // src/lib/auth-helpers.ts:61
  const roleCookie = cookieStore.get("sb-role")?.value
  if (roleCookie && rolesConfig[roleCookie]) {
    const session = { role: roleCookie, email: userEmail }
    roleCache.set(accessToken, { ...session, expires: Date.now() + 15 * 60 * 1000 })
    return session
  }
  ```
* **Exploit Vector:** Any registered customer or attacker with a valid Supabase JWT can set `document.cookie = "sb-role=admin; path=/"` in their browser. Subsequent requests to `/api/admin/*` will accept the attacker as an `admin`, bypassing database checks.
* **Impact:** Complete administrative takeover and database compromise.

---

#### 🚨 V-02: Hardcoded Supabase Service Role Key in Source Code
* **Location:** `src/lib/supabase-admin.ts` (lines 11–13) & `src/middleware.ts` (line 172)
* **Vulnerability:** The production `service_role` secret JWT is hardcoded as a fallback string directly in the repository:
  ```typescript
  const SUPABASE_SERVICE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Full service role JWT
  ```
* **Exploit Vector:** Anyone with read access to the repository (or if source maps are ever generated in client bundles) can extract this key. The service role key bypasses **all** Supabase Row Level Security (RLS) policies and allows full database modification, user deletion, and bucket manipulation.
* **Impact:** Total infrastructure compromise.

---

#### 🚨 V-03: Auto-Approved Admin Account Creation on First Login
* **Location:** `src/app/api/auth/login/route.ts` (lines 40–54)
* **Vulnerability:** When a user logs in, if they do not yet have a record in `profiles`, the login handler automatically provisions one with `role: "admin"` and `status: "approved"`:
  ```typescript
  if (!fetchedProfile) {
    const { data: newProfile } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authData.user.id,
        email: authData.user.email || cleanEmail,
        role: "admin",
        status: "approved"
      })
  }
  ```
* **Exploit Vector:** If public signup is enabled in Supabase GoTrue Auth, any stranger can register an account and immediately log in to receive full administrative rights.
* **Impact:** Immediate unauthenticated privilege escalation to administrator.

---

#### ⚠️ V-04: Unenforced Secret on Expensive AI Cron Endpoint
* **Location:** `src/app/api/cron/seo-auto-fill/route.ts` (lines 15–21)
* **Vulnerability:** The endpoint checks for `CRON_SECRET`, but only executes the check if `CRON_SECRET` is actually set in the environment:
  ```typescript
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }
  ```
* **Exploit Vector:** If `CRON_SECRET` is omitted or undefined in Vercel environment variables, authentication is skipped entirely. Anyone can send `GET /api/cron/seo-auto-fill` and trigger hundreds of automated OpenAI GPT-4o-mini API calls and bulk database writes.
* **Impact:** Denial of Wallet (API quota depletion) and unwanted automated overwriting of SEO keywords.

---

#### ⚠️ V-05: Missing CSRF & Origin Validation on Admin APIs
* **Location:** All `src/app/api/admin/*/route.ts` mutation handlers (POST/PUT/DELETE)
* **Vulnerability:** Authentication relies exclusively on ambient cookies (`sb-access-token`) without verifying the `Origin` or `Sec-Fetch-Site` header, and without Anti-CSRF tokens.
* **Exploit Vector:** A logged-in administrator visiting a malicious website could have their session abused via Cross-Site Request Forgery (CSRF) to delete services, alter keywords, or create new users.
* **Impact:** Unauthorized state modification performed on behalf of authenticated administrators.

---

#### ℹ️ V-06: Insecure Direct Object Reference (IDOR) on Carts
* **Location:** `src/app/api/store/[[...path]]/route.ts` (`handleGetCart` & `handleUpdateCart`)
* **Vulnerability:** Cart access is governed solely by the `id` path parameter (`/api/store/carts/[id]`) without cryptographic session verification or signed cart tokens.
* **Exploit Vector:** If a cart ID is disclosed or intercepted, an attacker can retrieve the full shipping address, billing address, phone number, and email stored on the cart.
* **Impact:** Disclosure and modification of customer Personally Identifiable Information (PII).

---

## 3. Step-by-Step Remediation Plan

### Remediation 1: Eliminate Cookie Trust & Strictly Verify Database Roles
* **Action:** Never read `sb-role` from request cookies to make authorization decisions. Read the user ID strictly from the verified Supabase JWT payload, and query the user's role from the database `profiles` table. Cache roles server-side by `user_id`, not by cookie.
* **Implementation in `src/lib/auth-helpers.ts`:**
  ```typescript
  export async function getUserSession(req: NextRequest): Promise<UserSession | null> {
    const cookieStore = await nextCookies()
    const accessToken = cookieStore.get("sb-access-token")?.value
    if (!accessToken) return null

    // Verify token signature with Supabase GoTrue Auth
    const { data: { user }, error } = await supabaseAnon.auth.getUser(accessToken)
    if (error || !user) return null

    // Check memory cache keyed by user.id
    const cached = roleCache.get(user.id)
    if (cached && cached.expires > Date.now()) {
      return { role: cached.role, email: user.email || "" }
    }

    // Query profiles table strictly via server
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single()

    if (profile?.role && profile?.status === "approved") {
      const session = { role: profile.role, email: user.email || "" }
      roleCache.set(user.id, { ...session, expires: Date.now() + 5 * 60 * 1000 })
      return session
    }

    return null
  }
  ```

---

### Remediation 2: Remove Hardcoded Secrets & Rotate Keys
* **Action:**
  1. Rotate the Supabase `service_role` key immediately in the Supabase Dashboard (`Settings > API`).
  2. Remove all hardcoded JWT fallbacks from `src/lib/supabase-admin.ts` and `src/middleware.ts`.
  3. Enforce runtime failure if environment variables are missing:
  ```typescript
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_SERVICE_KEY) {
    throw new Error("CRITICAL: SUPABASE_SERVICE_ROLE_KEY environment variable is not defined.")
  }
  ```

---

### Remediation 3: Disable Auto-Admin Provisioning
* **Action:** Remove the auto-insert block in `src/app/api/auth/login/route.ts`. Users must be explicitly granted administrative roles by an existing administrator or seeded via controlled database migrations.
  ```typescript
  if (!fetchedProfile || fetchedProfile.status !== "approved") {
    return NextResponse.json({ error: "Account pending approval or unauthorized" }, { status: 403 })
  }
  ```

---

### Remediation 4: Strict Cron Authorization
* **Action:** Make `CRON_SECRET` mandatory. If missing or mismatched, deny requests with HTTP 401.
  ```typescript
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 })
  }
  ```

---

### Remediation 5: Implement Origin & CSRF Protection on API Routes
* **Action:** Add an Origin check in `src/middleware.ts` or route handlers for all state-changing methods (`POST`, `PUT`, `DELETE`, `PATCH`):
  ```typescript
  const origin = req.headers.get("origin")
  const host = req.headers.get("host")
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (!origin || !origin.includes(host || "")) {
      return NextResponse.json({ error: "Cross-origin request rejected" }, { status: 403 })
    }
  }
  ```

---

## 4. Supabase Row Level Security (RLS) Policy Checklist

| Table | Public Read | Public Insert | Public Update | Service Role Admin |
| :--- | :---: | :---: | :---: | :---: |
| `site_setting` | ✅ (Anon) | ❌ | ❌ | ✅ |
| `seo_setting` | ✅ (Anon) | ❌ | ❌ | ✅ |
| `services` | ✅ (Anon) | ❌ | ❌ | ✅ |
| `case_studies` | ✅ (Anon) | ❌ | ❌ | ✅ |
| `post` | ✅ (`status='published'`) | ❌ | ❌ | ✅ |
| `profiles` | ❌ | ❌ | ❌ | ✅ |
| `cart` | ❌ | ❌ | ❌ | ✅ (Via Backend Proxy) |
| `cart_line_item` | ❌ | ❌ | ❌ | ✅ (Via Backend Proxy) |
| `cart_address` | ❌ | ❌ | ❌ | ✅ (Via Backend Proxy) |
