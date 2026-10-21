# 5 · task.md — Technical Plans

This file holds the technical plan for each task, written BEFORE coding using a fixed 10-section template (problem, acceptance criteria, where logic lives, routes, files, edge cases, impact, security/load/SEO, test plan, better way). It also lists the backlog and archive of finished work. Newest plan on top; finished plans move to the Archive, never deleted.

*One plan per task, newest on top · Finished plans move to Archive*


## NTF-301 (T-01) · Security hardening: close audit findings V-01 to V-08


### 1. Problem and objective

Attackers can currently escalate to admin by editing a cookie, a service-role key sits in source, first-login admin auto-creation exists, the AI cron may run without its secret, and carts are open to IDOR. Done means all eight findings are fixed and verified, and keys are rotated.


### 2. Acceptance criteria

- ☐ sb-role cookie is never read; role comes from profiles via auth-helpers.ts and middleware (V-01, V-07)
- ☐ No secret in source; SUPABASE_SERVICE_ROLE_KEY only from env; old key rotated in Supabase (V-02)
- ☐ First login never creates an admin; unknown user gets 403 (V-03)
- ☐ /api/cron/seo-auto-fill returns 401 without the correct CRON_SECRET (V-04)
- ☐ Mutating /api/admin/* rejects a wrong Origin with 403 (V-05)
- ☐ A cart or order cannot be read with another user's id (V-06)
- ☐ Role cache has a size cap and TTL (V-08)
- ☐ /api/auth/dev-login disabled when NODE_ENV is production
- ☐ .env.local removed from any shared archive

### 3. Where the logic lives

Backend only: auth-helpers.ts, middleware.ts, route handlers. Frontend changes: none except the admin login error message.


### 4. Routes and objects

No new routes. Touches /api/auth/*, /api/admin/*, /api/cron/seo-auto-fill, /api/store carts. Uses profiles and cart tables; no schema change (RLS policy review may need a migration in db-proposals).


### 5. Files to create / change

src/lib/auth-helpers.ts, src/middleware.ts, src/lib/supabase-admin.ts, src/app/api/cron/seo-auto-fill/route.ts, src/app/api/auth/dev-login/route.ts, src/app/api/store/[[...path]]/route.ts, new src/lib/util/origin-check.ts. Reuse existing roles.ts and isPathAllowed.


### 6. Edge cases and failure cases

Expired token · missing profile row · role changed while logged in · cron called by Vercel with Authorization header · admin behind CUSTOM_ADMIN_PATH · preview deployments with a different host.


### 7. Impact check

Every admin page and API depends on auth-helpers; a bug locks out admins. Test each role in roles.ts. memory.md checked: V-01..V-08 recorded as Known issues.


### 8. Security, load and SEO

Inputs validated with Zod; auth required on all admin routes; key rotation in Supabase and Vercel; no logs of tokens. No SEO impact (admin and API are noindex).


### 9. Test plan

Unit tests for role resolution and origin check; manual test matrix of 5 roles × 6 admin routes; curl tests for cron 401/200 and cart IDOR; view cookies in devtools to confirm no sb-role.


### 10. Better way?

Move role checking into one withRole(["admin","manager"]) wrapper used by every handler instead of repeating checks.


## NTF-302 (T-02) · Build gates (typecheck, lint, tests)


### 1. Problem and objective

Nothing stops a type error or lint failure from shipping because next.config.js ignores both and there is no CI. Done means typecheck, lint, vitest and build run before every release.


### 2. Acceptance criteria

- ☐ One script (npm run check) runs typecheck, lint, vitest run and next build
- ☐ ignoreBuildErrors and ignoreDuringBuilds set to false after fixing the existing errors (or fixed in a follow-up plan with a tracked count)
- ☐ A pre-push check blocks pushes while it fails

### 3. Where the logic lives

Not applicable (tooling). No business logic.


### 4. Routes and objects

No routes. No models.


### 5. Files to create / change

package.json (check script), next.config.js (flags), package.json (pin "latest" packages).


### 6. Edge cases and failure cases

Existing type errors fail the build the first time · flaky tests · Node version mismatch (use Node 20 LTS) · private env needed at build (use dummy values).


### 7. Impact check

Turning flags off may expose many errors: run tsc --noEmit first and list the count in memory.md. Pinning Medusa packages may change types; pin to the currently installed versions.


### 8. Security, load and SEO

No secrets in scripts. Lighthouse checks can be added once thresholds are decided.


### 9. Test plan

Add an intentional type error and confirm the check fails; fix it and confirm it passes.


### 10. Better way?

Make the schema tests part of the check so SEO regressions are blocked.


## NTF-303 (T-03) · Run DB proposals and verify the schema engine on production


### 1. Problem and objective

Live FAQs, keywords, meta titles and the organization profile still reflect old data until the SQL in db-proposals runs. Done means the 7 scripts ran in order and every route type passes validation.


### 2. Acceptance criteria

- ☐ Scripts executed in the order in HANDOFF.md (add_organization_profile → seed_organization_profile → clean_meta_titles → cleanup_schema_json → seed_keywords → seed_service_faqs → seed_home_faqs)
- ☐ A backup is saved in db-proposals/backups before running
- ☐ View-source on 10 route types shows exactly one ld+json tag
- ☐ Title, description, canonical and og:image equal the WebPage node
- ☐ validator.schema.org shows 0 errors; Google Rich Results test passes
- ☐ Search Console sitemap resubmitted

### 3. Where the logic lives

Backend/data: SQL by a human operator; schema engine already reads from data.


### 4. Routes and objects

No routes changed. New table organization_profile (migration exists in db-proposals/add_organization_profile.sql).


### 5. Files to create / change

db-proposals/*.sql (execute only), no code change expected. Pages to check: /, /about, /contact, /services, /services/performance-marketing, /work, /work/the-kids-store, /blog, /blog/advantage-automation-business-growth, /store.


### 6. Edge cases and failure cases

Script fails midway (wrap in a transaction) · FAQ word counts out of 40–60 · slug mismatch · cache not revalidated (call revalidateContent or redeploy).


### 7. Impact check

Changes live copy on 11 services and the home page. Compare before/after FAQ lists. memory.md: organization facts must match the client-confirmed profile.


### 8. Security, load and SEO

Production write: only run by the operator, after backup. RLS read policy on organization_profile checked. SEO checklist runs on each route.


### 9. Test plan

Run on a staging copy of the database first; compare outputs with check_service_lengths.py.


### 10. Better way?

Add a nightly job that fetches ten URLs and validates metadata/JSON-LD parity automatically.


## NTF-304 (T-04) · Standard API response and /api/v1 migration plan


### 1. Problem and objective

Routes return different shapes and live outside /api/v1, so the frontend guesses formats. Done means a documented helper and the admin routes migrated in small PRs.


### 2. Acceptance criteria

- ☐ Helper ok()/fail() in src/lib/util/api-response.ts returns { success, data, error, meta }
- ☐ All list endpoints accept page and limit and return meta.total
- ☐ Admin routes available under /api/v1/admin/* with the old paths redirecting for one release
- ☐ Store proxy keeps Medusa-compatible shapes (documented exception)
- ☐ architecture.md route map updated in the same PR

### 3. Where the logic lives

Backend: response helper and handlers. Frontend: admin fetch calls use one client wrapper.


### 4. Routes and objects

GET /api/v1/admin/services?page=1 → { success, data: Service[], meta:{page,limit,total} }. No schema change.


### 5. Files to create / change

src/lib/util/api-response.ts, src/app/api/v1/admin/**, src/app/admin/** fetch wrapper (new src/lib/api-client.ts). Do one resource at a time (services first).


### 6. Edge cases and failure cases

Empty list · invalid page → 400 · unauthenticated → 401 · server error → 500 with code · old clients calling old paths.


### 7. Impact check

Admin UI pages call these routes; migrate one resource, test its page, repeat. Store proxy is not changed.


### 8. Security, load and SEO

Zod validation on every body/query; role check via withRole; pagination caps (limit ≤ 100).


### 9. Test plan

Unit tests for helper; manual run of each admin screen; Postman collection.


### 10. Better way?

Skip /api/v1 prefix and version only when a breaking change is needed.


## NTF-305 (T-05) · Docs, template alignment and Known-issues backlog (SOP-2)


### 1. Problem and objective

The repo lacks docs/ and the CLAUDE.md pattern. Done means the six files, CLAUDE.md, .env.example and BRAND_GUIDELINES.md are committed and every Known issue has a planned fix.


### 2. Acceptance criteria

- [x] docs/ contains the six files (prd.md, architecture.md, rules.md, design.md, task.md, memory.md)
- [x] CLAUDE.md at repo root with the stack and the read-before-change instruction
- [x] .env.example lists all 20 variables without values
- [x] docs/BRAND_GUIDELINES.md created from design.md section 1–2
- [x] .claude/ config blocks reading .env* and dangerous commands
- [x] memory.md Known issues each linked to a task

### 3. Where the logic lives

Docs only.


### 4. Routes and objects

None.


### 5. Files to create / change

CLAUDE.md, .env.example, docs/*, .claude/settings.json, .claude/skills (plan-task, code-review, security-check, seo-check).


### 6. Edge cases and failure cases

Docs drift from code · secrets pasted by mistake · .workrules accidentally committed (verify .git/info/exclude).


### 7. Impact check

None on runtime.


### 8. Security, load and SEO

.env.example contains names only. .env.local must not appear in the repo or zip.


### 9. Test plan

Review that a new developer can clone, run and read the four core files in under a day.


### 10. Better way?

Add a check that fails when routes change but architecture.md does not.


## NTF-306 (T-06) · Website performance audit and optimization


### 1. Problem and objective

Page speed is a ranking and conversion factor, and no baseline exists. Done means measured baseline, prioritised fixes, and a before-and-after report with no broken features.


### 2. Acceptance criteria

- ☐ Baseline saved for home, a service page, a blog page and the store (Lighthouse mobile and desktop, LCP, INP, CLS)
- ☐ Top issues ranked by impact with evidence from code or reports
- ☐ Fixes applied incrementally; each re-measured
- ☐ Before/after table, files changed, trade-offs and remaining issues reported
- ☐ npm test, typecheck and lint pass; no new console errors or failed requests

### 3. Where the logic lives

Backend: queries, caching, indexes, timeouts. Frontend: image, font and bundle handling only.


### 4. Routes and objects

No new routes. Checks existing public pages and slow endpoints under /api/admin, /api/store and src/lib/data. Database index changes go to db-proposals/ first.


### 5. Files to create / change

next.config.js (headers, images), src/modules/** and src/app/** (next/image, dynamic imports), src/lib/data/* (select only needed fields, cache tags), db-proposals/*.sql (indexes), package.json (remove unused deps only with approval).


### 6. Edge cases and failure cases

Stale cache after content edits · user-specific data cached publicly · hero image lazy-loaded by mistake · layout shift from late images · slow network · cold cache vs repeat visit.


### 7. Impact check

Caching changes affect every public page and the admin save flow (revalidateContent). Re-test content edits end to end.


### 8. Security, load and SEO

No cache on auth, cart, account or admin responses. Do not hurt SEO (keep SSR, canonical, schema). Follow rules.md Part J.


### 9. Test plan

Lighthouse before/after on mobile and desktop, slow-network and cold-cache runs, functional regression of forms, cart and admin, console and network error check.


### 10. Better way?

Add Lighthouse and a performance budget to the pre-release check so regressions are caught automatically.


## Backlog (candidate tasks, not yet planned)


| ID | Task | Reason |
|---|---|---|
| T-06 | Decide and implement React Query or record exception | SOP rule 8; memory D-04 |
| T-09 | Add error.tsx boundaries to every route group | Error-handling rule |
| T-10 | Rate limiting for contact form, login, AI endpoints | Security rule 11 |
| T-11 | Staging environment with noindex and separate Supabase | SOP environments |
| T-12 | Lighthouse checks + Core Web Vitals budget | Decide numeric thresholds |


## Archive (completed, from HANDOFF.md)

- Unified JSON-LD schema graph engine in src/lib/schema (templates, resolvers, fetchers, validation, tests).
- /admin/schema panel and API removed; middleware returns 404.
- Metadata and schema parity on /store; canonical standardised on https://www.mommantum.com.
- inLanguage standardised to en-IN across all templates.
- 71 service FAQs, 5 home FAQs, keyword seeds and organization profile prepared as SQL proposals.
- Vitest added with build-graph and revalidate test suites.
- Admin SEO tab, blog editor, case-study editor, RBAC, sitemaps and internal-linking features delivered earlier.

## Task rules

- A task is 1–2 days of work; if bigger, split it.
- Plan first: no code until the 10 sections are written and approved.
- If the plan proves wrong while coding, stop and update the plan before continuing.
- At the end of each day, record what was done: Done, Partial (what is left and why) or Not done (blocker).
- Update architecture.md and memory.md in the same work when routes, models or decisions change.

## Empty plan template (copy for every new task)


```
## NTF-xxx · Title
### 1. Problem and objective
### 2. Acceptance criteria   - [ ] ...
### 3. Where the logic lives  Backend: ...  Frontend: display only
### 4. Routes and objects
### 5. Files to create / change  (and what existing code I reuse)
### 6. Edge cases and failure cases
   empty data · large data · API fails · slow network · no permission · invalid input
### 7. Impact check  (what else uses this code; memory.md checked)
### 8. Security, load and SEO
### 9. Test plan
### 10. Better way?
```


## Execution order (recommended)


| Order | Task | Why first |
|---|---|---|
| 1 | NTF-301 Security hardening | Critical vulnerabilities and exposed keys |
| 2 | NTF-302 Build gates | Stops new errors shipping |
| 3 | NTF-303 Database scripts | Fixes live FAQ, keyword and profile data |
| 4 | NTF-305 Docs alignment | Gives every developer the same rules |
| 5 | NTF-304 Standard API | Larger refactor, done in small steps |
| 6 | NTF-306 Website performance audit | Page speed and Core Web Vitals optimization |


## AI instruction: Website Performance Audit and Optimization (paste into the AI tool)


```
Analyze the complete existing codebase before making changes. Do not redesign
the website or break existing functionality.

Review and optimize:
1. Images and media: modern formats, compression, responsive sizing, lazy
   loading, layout stability.
2. Caching and delivery: browser cache headers, CDN suitability, Brotli/Gzip,
   static asset caching.
3. Frontend: code splitting, lazy-loaded routes, unused code, render-blocking
   resources, JS bundle size, fonts, unnecessary React re-renders.
4. Backend and APIs: slow endpoints, duplicate requests, pagination, response
   times, timeouts, safe caching.
5. Database: slow queries, indexing, connection pooling, pagination,
   unnecessary data retrieval.
6. Metrics: Lighthouse, LCP, INP, CLS, mobile and desktop performance.
7. Testing: functional regression tests, console errors, failed network
   requests, production monitoring.

Required workflow:
- Record baseline measurements before changes.
- Identify problems using evidence from the code and performance reports.
- Prioritize high-impact issues; implement improvements incrementally.
- Re-run relevant tests and performance audits.
- Report before-and-after results, files changed, trade-offs, remaining issues
   and recommended next steps.
- Do not fabricate performance scores or claim improvement without measurements.
- Do not introduce unnecessary dependencies, insecure caching or breaking changes.

Keep the existing design and business logic intact. Explain any change that
needs infrastructure, hosting or database configuration instead of pretending
frontend code alone can fix it.
```
