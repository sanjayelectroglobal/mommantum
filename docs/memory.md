# 6 · memory.md — Decisions and Learnings

This file is the project memory: decisions and why they were made, known issues and gotchas, patterns to follow, and a change log. Anything learned the hard way is added the same day so the same mistake is never repeated.

*Add an entry the same day · Four sections*


## A. Decisions


| ID | Decision | Why |
|---|---|---|
| D-01 | No standalone Medusa server; in-process proxy at /api/store maps to Supabase | Lower cost and one deploy; Medusa SDK still works |
| D-02 | Backend = Next route handlers + Supabase (no separate API service) | Single Vercel deployment, small team |
| D-03 | Country prefix (/in) removed; region default "in" | Clean URLs, India-first SEO |
| D-04 | React Query not installed. OPEN: adopt for client lists or exception | SOP rule 8 vs. current Server Component approach |
| D-05 | Global-CSS token rule exempted; Tailwind + Medusa preset used | Standing client directive (.workrules rule 1) |
| D-06 | One resolver feeds metadata and JSON-LD | Prevents title/description/schema mismatch |
| D-07 | No aggregateRating/review schema | No verified reviews exist; avoids Google penalties |
| D-08 | Schema panel removed; no per-page hardcoded schema | Manager instruction; single templates per type |
| D-09 | DB changes go to db-proposals/ and are run by a human | Protect production Supabase |
| D-10 | Admin path can be masked via CUSTOM_ADMIN_PATH; unauthorised gets 404 | Obfuscation, reduce brute force |
| D-11 | Public routes bypass DB in middleware | Zero TTFB cost for visitors |


## B. Known issues and gotchas


| ID | Issue | Impact / fix |
|---|---|---|
| K-01 | V-01 role escalation via sb-role cookie (CVSS 9.8) | Critical. Fix in NTF-301 |
| K-02 | V-02 hardcoded service-role key in source (9.8) | Critical. Rotate key, move to env, NTF-301 |
| K-03 | V-03 admin auto-created on first login (9.1) | Critical. NTF-301 |
| K-04 | V-04 CRON_SECRET not enforced on AI endpoint (7.5) | Denial of wallet. NTF-301 |
| K-05 | V-05 no CSRF/Origin check on admin APIs (7.1) | NTF-301 |
| K-06 | V-06 cart IDOR (6.5); V-07 readable sb-role cookie (6.5); V-08 role-cache memory growth (5.3) | NTF-301 |
| K-07 | next.config.js ignores TypeScript and ESLint errors in builds | Run npx tsc --noEmit manually until NTF-302 |
| K-08 | No automated check before release | NTF-302 |
| K-09 | .env.local was in the delivered zip | Treat keys as exposed; rotate; never zip env files |
| K-10 | Dependencies using "latest" (@medusajs/*) | Unpredictable upgrades; pin versions in NTF-302 |
| K-11 | Package name medusa-next and Medusa starter README/assets remain | Dead code; cleanup in T-07 |
| K-12 | API routes not under /api/v1 and not a standard response | NTF-304 |
| K-13 | mommantum_supabase.json is an n8n workflow, not a DB schema | Do not use it to infer tables |
| K-14 | Live site still shows old DB FAQs until SQL scripts are executed | NTF-303 |
| K-15 | Seven SQL scripts must run in strict order | See HANDOFF.md order; NTF-303 |
| K-16 | seo_setting vs seo_settings both appear in code | Verify real table name; unify in T-08 |
| K-20 | Founder title differs: UI "Founder & Creative Director", schema "Founder" | Intentional; keep both |


## C. Patterns to follow

- Any new content type: add a fetcher, a resolver, a template, tests, and call revalidateContent() from every admin save API.
- Any public page: take metadata from its resolver, add the JsonLd component once, one H1.
- Any admin route: check role with auth-helpers, validate with Zod, call revalidateContent(), return the standard response.
- Any list page: paginate, cache with unstable_cache and a tag, and add a skeleton in src/modules/skeletons.
- Any DB change: SQL in db-proposals first, backup, human execution, record in Change log.
- Any slug change: add a 301 redirect and revalidate old and new paths.
- Reuse components from src/modules/common before creating new ones.

## D. Change log (newest first)


| Date | Entry |
|---|---|
| 2026-10-21 | Six core project documentation files established in docs/ (prd.md, architecture.md, rules.md, design.md, task.md, memory.md) with corrections applied (site.ts brand facts reference, completed out-of-scope boundaries and open questions in PRD, completed image/OG and form specifications in design.md). Added BRAND_GUIDELINES.md, .env.example, and CLAUDE.md. |
| 2026-10-21 | Six project files created for Mommantum from source code and project docs (PRD, architecture, rules, design, task, memory). |
| Oct 2026 | Security audit written: 8 findings (4 critical, 2 high, 2 medium). |
| Oct 2026 | Handoff: schema engine, /admin/schema removal, FAQ/keyword/org-profile SQL proposals, vitest added. |
| Earlier | SDS and SEO automation blueprint written; internal linking, AI SEO auto-fill, Google Indexing API, n8n blog ingestion, custom admin suite and RBAC delivered; production on Vercel. |


## E. Incident and lesson template


```
Date:
What happened:
Root cause:
Fix:
What to do instead next time:
Linked task / file:
```


## F. Lessons already learned in this project

- Metadata and schema must come from the same resolver or they drift apart.
- Never read role from a cookie; always verify from the database.
- Run SQL scripts in the exact documented order and back up first.
- Slug changes need a redirect and revalidation of the old and new paths.
- A cart id alone must never grant access to a cart.
- Disabled build checks hide real errors: turn them on early.
- Keep brand facts in one place (constants and organization_profile).

## Pattern: performance work

- Always record a baseline first, change one thing at a time, re-measure, and save both reports.
- Never lazy-load the hero/LCP image; always give images width and height.
- Never cache user-specific responses publicly.
- Index changes go through db-proposals and are validated on real data volumes.
