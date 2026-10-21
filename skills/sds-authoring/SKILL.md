---
name: sds-authoring
description: Standards, templates, and diagramming guidelines for generating and maintaining enterprise Software Design Specifications (SDS) for Mommantum.
---

# Software Design Specification (SDS) Authoring Guide

Use this skill when authoring, reviewing, or updating architectural documentation, system designs, ER diagrams, and sequence flows for the Mommantum platform.

---

## 1. SDS Core Structure

Every production-grade SDS must include:
1. **Executive Scope & Functional Objectives:** Quantifiable latency, SEO, and business targets.
2. **C4 Container & Component Diagrams:** Clear visual distinction between client, edge (Vercel), application (Next.js), database (Supabase), and external third parties.
3. **Data Layer ER Schema:** Complete PostgreSQL entity models, primary/foreign keys, and data relationships.
4. **End-to-End Sequence Flows:** Step-by-step lifecycles of user requests, authentication handshakes, and background asynchronous jobs.
5. **Caching & Performance Hierarchy:** Exact TTLs, revalidation tags, and cache invalidation mechanics across L1 (Edge), L2 (In-memory), L3 (Vercel Data Cache), and L4 (ISR).

---

## 2. Diagramming Standards (Mermaid)

* Always enclose special characters in quotes inside node definitions (e.g. `id["Node (Label)"]`).
* Use subgraphs to denote execution boundaries (e.g. `subgraph CDN`, `subgraph DataTier`).
* Provide clear numbering on sequence diagrams using `autonumber`.

---

## 3. Reference Files
* Software Design Specification Document: `SDS_SYSTEM_DESIGN.md`
