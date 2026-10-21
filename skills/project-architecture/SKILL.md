---
name: project-architecture
description: Complete architectural blueprint and technical operations guide for the Mommantum Next.js App Router, Supabase, and simulated Medusa e-commerce platform.
---

# Mommantum Project Architecture & Developer Guide

Use this skill when auditing, modifying, designing, or extending any part of the Mommantum codebase.

---

## 1. Core Architectural Concepts

1. **Next.js 15 App Router & Server Components:**
   * Always prefer React Server Components (RSC) for data-fetching and SEO.
   * Client Components (`"use client"`) must only be used for interactive UI (accordions, carousels, forms, modals).

2. **Zero-Blocking Public Middleware:**
   * `src/middleware.ts` runs at the edge on every request.
   * **Never query Supabase or external APIs in the middleware for public routes.**
   * Public storefront routes (`/`, `/services`, `/blog`, `/work`, `/contact`, `/about`, etc.) must pass through immediately to minimize Time to First Byte (TTFB).

3. **Unified Schema & Resolver Architecture:**
   * All pages with structured data must use the resolver pattern located in `src/lib/schema/resolvers/`.
   * A single resolver (e.g. `resolveServiceData`) feeds both Next.js `generateMetadata()` and the `<JsonLd />` component.
   * Maintain single `<script type="application/ld+json">` output containing an integrated `@graph` array.
   * Never output conflicting or disconnected JSON-LD scripts.

4. **Simulated Medusa E-Commerce Engine:**
   * `src/app/api/store/[[...path]]/route.ts` translates standard Medusa SDK requests directly into Supabase PostgreSQL queries.
   * Do not install or require a separate Medusa Node.js backend daemon; the storefront is self-contained.

---

## 2. Standard Page Creation Checklist

When creating or refactoring a page:
1. Define typed data fetchers in `src/lib/data/` with `unstable_cache` and explicit revalidation tags.
2. Add or update the corresponding entity resolver in `src/lib/schema/resolvers/`.
3. Implement `generateMetadata()` using `buildMetadataFromResolved()`.
4. Include `<JsonLd type="..." data={...} seoSetting={...} />` at the top of the Server Component.
5. Ensure all responsive images use explicit `sizes` attributes and standard aspect ratios (e.g., 1200x630 for share images).

---

## 3. Reference Files
* Architecture Overview: `PROJECT_ARCHITECTURE_OVERVIEW.md`
* Software Design Specification: `SDS_SYSTEM_DESIGN.md`
* Security Audit: `SECURITY_AUDIT_AND_HARDENING.md`
