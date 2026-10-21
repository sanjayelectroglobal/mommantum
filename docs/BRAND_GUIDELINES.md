# Mommantum Brand Guidelines

> **Status:** Active / Production Baseline  
> **Source:** `docs/design.md`, `src/lib/fonts.ts`, `tailwind.config.js`, and `src/lib/schema/site.ts`  
> **Rule Reference:** `.workrules/RULES.md` (Rule 2) & `docs/rules.md` (Part B)

---

## 1. Brand Identity & Overview

- **Legal Entity:** Mommantum
- **Headquarters:** B-147, Anand Vihar, Jagatpura, Jaipur, Rajasthan 302017, India
- **Core Market:** High-growth Direct-to-Consumer (D2C) brands and e-commerce enterprises across India and globally.
- **Brand Purpose:** Unified growth studio providing end-to-end performance marketing, SEO/GEO/AEO, AI automation, custom web/app development, copywriting, and studio video production (Editz).
- **Tone of Voice:** Confident, data-driven, direct, and authoritative. Avoid generic agency buzzwords; emphasize tangible commercial ROI, conversion rates, and proven metrics.

---

## 2. Logo & Media Usage

- **Primary Logo:**
  - Production URL: `https://www.mommantum.com/logo.png` (500×500 px master).
  - Background Contexts: White or soft neutral backgrounds (`#ffffff`, `#f9fafb`, `#fff0f6`).
  - Dark Mode / Navy Surface: Inverse white or transparent variant.
- **Clear Space:** Maintain a minimum clear zone equal to 25% of the logo's width around all borders.
- **Favicon & App Icons:** Pre-rendered in `src/app/opengraph-image.jpg` and `src/app/twitter-image.jpg`.
- **Don'ts:**
  - Do not stretch, distort, or alter the aspect ratio of the logo.
  - Do not apply unapproved drop shadows or harsh neon glow effects.
  - Do not overlay the logo on busy photographic backgrounds without adequate contrast scrims.

---

## 3. Color Palette & Design Tokens

Mommantum uses an approved Tailwind token scale (`tailwind.config.js`). Hex values below represent the official brand palette.

### 3.1. Primary & Brand Accents

| Token | Hex Value | Usage & Application |
|---|---|---|
| **Brand Pink** | `#e61e73` | Primary brand accent, primary CTA buttons, badges, key metric highlights |
| **Brand Pink Hover** | `#ef3a6b` | Interactive hover and active focus states for pink CTAs |
| **Pink Tint** | `#fff0f6` | Soft section background fills, badge surface tints |
| **Brand Navy** | `#0e2547` | Primary dark background, high-contrast headings, main body text |
| **Purple Accent** | `#9333ea` | Secondary accent, AI/automation feature highlights, gradient accents |
| **Purple Tint** | `#f5eeff` | AI badge surface fills, card hover glows |
| **Mint Green** | `#49d7a4` | Positive statistics, growth metric counters, success validation |
| **Orange Alert** | `#ea580c` | Warning banners, urgency badges, attention callouts |

### 3.2. Neutral & Surface Palette (Tailwind Grey Scale)

| Token Name | Hex Value | Tailwind Class | Application |
|---|---|---|---|
| `grey-0` | `#FFFFFF` | `bg-white`, `text-white` | Pure card backgrounds, white text on dark surfaces |
| `grey-5` | `#F9FAFB` | `bg-grey-5` | Primary page background, subtle table alternating rows |
| `grey-10` | `#F3F4F6` | `bg-grey-10`, `border-grey-10` | Card borders, secondary button background |
| `grey-20` | `#E5E7EB` | `border-grey-20` | Input borders, divider rules |
| `grey-30` | `#D1D5DB` | `border-grey-30` | Focused divider lines, inactive checkbox borders |
| `grey-40` | `#9CA3AF` | `text-grey-40` | Placeholder input text, inactive tab labels |
| `grey-50` | `#6B7280` | `text-grey-50` | Secondary metadata, footer navigation links |
| `grey-60` | `#4B5563` | `text-grey-60` | Tertiary body copy, icon strokes |
| `grey-70` | `#374151` | `text-grey-70` | Secondary headings, active tab text |
| `grey-80` | `#1F2937` | `text-grey-80` | High-contrast subheadings |
| `grey-90` | `#111827` | `text-grey-90` | Primary dark body text |

---

## 4. Typography Scale & Font Families

Typography is loaded centrally in `src/lib/fonts.ts` via `next/font/google` with `display: swap`.

| Font Family | Weights | Role & Usage |
|---|---|---|
| **Epilogue** | 400, 500, 600, 700, 800 | Primary Display & Headings (`h1`, `h2`, `h3`, hero banners) |
| **Outfit** | 400, 500, 600, 700 | Primary UI, CTA buttons, badges, feature subtitles |
| **DM Sans** | 400, 500, 700 | Long-form reading copy, blog paragraphs, case study body |
| **Cormorant Garamond** | 400, 600, 700 | Editorial quotes, statistics emphasis, luxury accents |
| **Mansalva** | 400 | Handwritten playful callouts, editorial notes |
| **Inter / System Stack** | System defaults | Fallback stack and administrative dashboard data tables |

---

## 5. Spacing, Radii & Layout Standards

- **Maximum Container Width:** `8xl` = `100rem` (1600px). Standard containers use `max-w-7xl` or `max-w-8xl` with horizontal padding (`px-4 sm:px-6 lg:px-8`).
- **Corner Radii:**
  - `soft`: `2px` (micro badges, code tags)
  - `base`: `4px` (form inputs, utility buttons)
  - `rounded`: `8px` (cards, dialog modals, interactive containers)
  - `large`: `16px` (feature highlight panels, testimonial cards)
  - `circle`: `9999px` (pill badges, avatar containers, circular icon buttons)
- **Breakpoints:**
  - `2xsmall`: `320px` (mobile minimum)
  - `xsmall`: `512px` (large phones)
  - `small`: `1024px` (tablets / small laptops)
  - `medium`: `1280px` (desktop)
  - `large`: `1440px` (widescreen)
  - `xlarge`: `1680px` (ultra-wide monitors)
  - `2xlarge`: `1920px` (full 1080p+ widescreen)

---

## 6. Do's and Don'ts

### Do:
- Use `#e61e73` for primary conversion actions and key metrics.
- Keep headings bold and punchy using Epilogue.
- Ensure all body copy meets WCAG 2.1 AA contrast standards (minimum 4.5:1 ratio against background).
- Pair case study metrics with specific client outcomes (e.g. "0.7% to 3.1% conversion rate").
- Follow mobile-first design starting at 320px.

### Don't:
- Don't use random unapproved colors (e.g., pure red `#ff0000` or raw electric cyan).
- Don't hardcode hex codes directly when Tailwind theme tokens (`brand-pink`, `brand-navy`, `grey-*`) are available.
- Don't create layout elements with horizontal scrollbars on mobile viewports.
- Don't publish AI-generated content without human editorial review and factual verification.
