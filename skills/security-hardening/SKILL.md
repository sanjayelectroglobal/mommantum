---
name: security-hardening
description: Guidelines, audit checklists, and remediation workflows for securing Next.js Route Handlers, Supabase RLS, GoTrue Auth, and secret management.
---

# Security Hardening & Threat Remediation Guide

Use this skill when auditing security, implementing authentication, creating or modifying API Route Handlers, and configuring database permissions in the Mommantum platform.

---

## 1. Authentication & Role-Based Access Control (RBAC) Rules

1. **Never Trust Client-Supplied Role Cookies:**
   * Do not use cookie values like `sb-role` to grant administrative permissions.
   * Always authenticate the user's JWT with Supabase Auth (`supabaseAnon.auth.getUser(token)`).
   * Verify roles exclusively against the verified `profiles` table in Supabase.

2. **No Hardcoded Secrets or Service Role Fallbacks:**
   * Never store JWTs, API keys, or database service role secrets as default fallback strings in code.
   * If `process.env.SUPABASE_SERVICE_ROLE_KEY` is not present, throw an immediate startup error.

3. **Strict Origin & CSRF Checks on State Mutations:**
   * Any API handling `POST`, `PUT`, `DELETE`, or `PATCH` must verify the `Origin` / `Sec-Fetch-Site` header to prevent Cross-Site Request Forgery (CSRF).

4. **Mandatory Secrets on Cron & Background Triggers:**
   * Endpoints like `/api/cron/*` must require a strong `CRON_SECRET` in the `Authorization: Bearer <secret>` header.
   * If `CRON_SECRET` is not set in the environment, the endpoint must reject all requests with HTTP 401.

---

## 2. Supabase Row Level Security (RLS) Protocol

1. **Default Deny:**
   * Enable RLS on every newly created table (`ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`).
2. **Read Policies:**
   * Public tables (`site_setting`, `services`, `case_studies`) should have explicit `SELECT` policies for the `anon` role.
   * Content tables (`post`) must restrict anonymous read access to published rows (`status = 'published'`).
3. **Write Policies:**
   * Deny direct `INSERT`, `UPDATE`, and `DELETE` access to the `anon` and `authenticated` roles.
   * Perform administrative mutations solely through the server-side Next.js Route Handlers using the verified `supabaseAdmin` client.

---

## 3. Reference Files
* Security Vulnerabilities & Remediation Blueprint: `SECURITY_AUDIT_AND_HARDENING.md`
