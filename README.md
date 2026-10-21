# Mommantum

Mommantum is a high-performance digital marketing agency web platform built with Next.js 15, Tailwind CSS, and Supabase.

> **Architecture Update**: E-commerce store removed on 2026-10-21; Supabase store tables intentionally left untouched.

---

## Overview

Mommantum delivers performance marketing, SEO (AEO/GEO), creative video production, AI automation, and web development services. The platform features an automated AI SEO engine, semantic internal linking, unified Schema.org JSON-LD generation, and a secure administration dashboard.

### Core Features

- **Marketing Pages**: Homepage, Services, Work (Case Studies), Blog, Editz (Video Editing), Blog AI, About, Contact, FAQs, Legal.
- **Unified Schema Engine**: Zero-runtime-leak JSON-LD builder adhering strictly to Schema.org standards with breadcrumbs and nested FAQs.
- **AI Internal Linking**: Vector embeddings with OpenAI (`text-embedding-3-small`) to automatically recommend relevant blog and service links.
- **Admin Dashboard**: Content management for Blog Posts, Services, Case Studies, SEO settings, and Sitemap monitoring.
- **Security & Caching**: Role-based access control, Edge middleware protection, and production asset caching.

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth, Row Level Security)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with `@medusajs/ui` design system preset
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: Lucide React & Medusa Icons
- **Testing**: [Vitest](https://vitest.dev/)

---

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn

### 1. Environment Setup

Copy `.env.example` to `.env.local` and configure your keys:

```bash
cp .env.example .env.local
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:8000](http://localhost:8000) to view the application.

---

## Testing & Verification

Run the test suite:

```bash
npm test
```

Run TypeScript compilation check:

```bash
npx tsc --noEmit
```

Build production bundle:

```bash
npm run build
```
