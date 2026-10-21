# 4 · design.md — Design System

This file defines HOW Mommantum looks: colour and typography tokens taken from the code, utility classes, where each component lives, responsive breakpoints, and image/OG/alt-text standards. Use only what is listed here; reuse before creating anything new.

*Changes when the design system changes · Keep in sync with docs/BRAND_GUIDELINES.md*


## 1. Tokens (as found in code)

The project uses the Tailwind theme as its token source (approved exception to tokens.css). Values below are taken from tailwind.config.js and the most-used colours in modules.


| Token | Value | Use |
|---|---|---|
| Brand pink | #e61e73 (hover/alt #ef3a6b) | Primary accent, CTAs, highlights (most used colour, 62 occurrences in home/layout/about) |
| Brand navy | #0e2547 | Headings, dark sections, text (59 occurrences) |
| Purple | #9333ea; tint #f5eeff | Secondary accent, gradients, badges |
| Pink tint | #fff0f6 | Soft section backgrounds |
| Mint | #49d7a4 | Success / positive stats |
| Orange | #ea580c | Warning / highlight |
| Slate and grey | #64748b, #e2e8f0, #f7f8fa, #f3f4f6 | Secondary text, borders, surfaces |
| Grey scale (theme) | grey-0 #FFFFFF · 5 #F9FAFB · 10 #F3F4F6 · 20 #E5E7EB · 30 #D1D5DB · 40 #9CA3AF · 50 #6B7280 · 60 #4B5563 · 70 #374151 · 80 #1F2937 · 90 #111827 | Neutral palette (class names like text-grey-50) |
| Radius | none 0 · soft 2px · base 4px · rounded 8px · large 16px · circle 9999px | rounded-* classes |
| Max width | 8xl = 100rem | Page containers |
| Font sizes | Tailwind defaults plus 3xl = 2rem; Medusa preset text styles (e.g. text-xsmall-regular) | Typography scale |
| Dark mode | darkMode: "class" | Supported by config; storefront is light-first |


## 2. Typography


| Font | Source | Role |
|---|---|---|
| Epilogue 400–800 | next/font/google | Headings / display |
| Outfit 400–700 | next/font/google | Body / UI accents |
| DM Sans | next/font/google | Body text |
| Cormorant Garamond 400/600/700 | next/font/google | Editorial serif accents |
| Mansalva 400 | next/font/google | Handwritten accent |
| Inter + system stack | tailwind fontFamily.sans | Fallback and admin UI |

All fonts load with display:"swap" through src/lib/fonts.ts (one central file). Always give a fallback stack.


## 3. Utility classes and helpers

- **.no-scrollbar**: hides scrollbars on carousels and filmstrips (globals.css).
- **Floating label inputs:** input:focus ~ label and :not(:placeholder-shown) ~ label shift up with text-xsmall-regular.
- **Autofill fix:** neutral border/text colour and white inset shadow so browser autofill does not tint inputs.
- **Search input reset:** removes native search decorations.
- **Animations (keyframes):** ring, fade-in-right, fade-in-top, fade-out-top, accordion-slide-up/down (Radix accordion height variable).
- **Plugins:** @tailwindcss/typography (blog prose), tailwindcss-radix, Medusa UI preset.


## 4. Component library (where things live)


| Area | Location | Components |
|---|---|---|
| Common / primitives | src/modules/common/components | Input, Checkbox, Radio, NativeSelect, Modal, Divider, DeleteButton, InteractiveLink, FilterRadioGroup, LocalizedClientLink, LineItemPrice/UnitPrice/Options, CartTotals, JsonLd, PageFaqSection |
| Icons | src/modules/common/icons | spinner, eye, eye-off, user, trash, x, back, chevron-down, map-pin, package, refresh, fast-delivery, payment logos |
| Layout | src/modules/layout | Header, NavBar, ServicesDropdown, SideMenu, Footer, FooterFaqSection, CartDropdown, CartButton, LanguageSelect, CountrySelect, CartMismatchBanner |
| Home | src/modules/home/components | Hero, StatsStrip, WhoWeAre, OurServices, ServicesDetails, OurWork, FeaturedProducts/ProductRail, HomeFaq, SectionHeading |
| Editz | src/modules/editz/components | Navbar, Hero, Marquee, BrandMarquee, Services, Process, Projects, VideoShowcase, Benefits, Audience, Testimonials, FAQ, CTA, Footer, FilmstripBackground |
| Commerce | src/modules/cart, checkout, order, account, products, store, collections, categories, shipping | Cart items, Checkout forms (addresses, shipping, payment, Stripe wrapper, discount code, review), Order details, Account nav, forms, modals |
| Loading states | src/modules/skeletons | Skeletons for cart, order, product grid, related products |

**Reuse rule:** before creating a component, search these folders. A label or emoji change stays a one-line edit.


## 5. Responsive breakpoints and mobile rules


| Name | Min width |
|---|---|
| 2xsmall | 320px |
| xsmall | 512px |
| small | 1024px |
| medium | 1280px |
| large | 1440px |
| xlarge | 1680px |
| 2xlarge | 1920px |

- Mobile first; test at 375 px and tablet width before every push; no horizontal scrolling of the page body.
- Tap targets at least 44 px; mobile drawer navigation (SideMenu).
- Note: custom screen names replace default sm/md/lg; use the names above.


## 6. Images, OG and alt text

- **OpenGraph Assets:** Standard dimensions are 1200×630 px.
  - 11 pre-rendered page share images live in `public/og/pages/*.jpg`.
  - 16 pre-rendered service share images live in `public/og/services/*.jpg`.
  - Global fallbacks live at `src/app/opengraph-image.jpg` and `src/app/twitter-image.jpg`.
- **next/image Usage:** Always render images using Next.js `Image` with explicit `width` and `height` (or `fill` with appropriate `sizes`) to prevent Cumulative Layout Shift (CLS).
- **Hero / LCP Images:** The primary hero/LCP image above the fold must be marked with `priority={true}` and must never be lazy loaded.
- **Below-the-fold Assets:** All below-the-fold imagery and video thumbnails must load lazily (`loading="lazy"`).
- **Alt Text Standard:** Every meaningful content image must provide descriptive, context-specific `alt` text incorporating primary keyword intent naturally (no keyword stuffing). Purely decorative visuals must carry `alt=""` and `aria-hidden="true"`.
- **Formats:** Modern AVIF and WebP delivery configured in `next.config.js`.


## 7. Forms, Inputs and Interactive Feedback

- **Floating Labels:** Form fields (Contact, Onboarding, Checkout, Admin) implement floating labels (`input:focus ~ label` and `:not(:placeholder-shown) ~ label`) transitioning smoothly to `text-xsmall-regular`.
- **Autofill Normalization:** Configured in `src/styles/globals.css` with neutral borders and inset box-shadow to prevent harsh browser autofill yellow/blue highlights.
- **Validation Feedback:** Error messages appear immediately beneath the invalid input in `text-red-600 text-xs mt-1`, never communicating errors via color alone.
- **Interactive Buttons & CTAs:** Smooth transitions with active feedback (`hover:brightness-110 active:scale-[0.98] transition-all duration-150`). Disabled states reduce opacity (`opacity-50 cursor-not-allowed`).
- **Modals & Overlays:** Accessible Radix-powered modals with `backdrop-blur-sm bg-black/40`, focus trapping, and `Escape` key dismissal.


## 8. Accessibility and interaction standards

- Contrast: text on pink/navy backgrounds must meet WCAG AA (4.5:1 for body text).
- Visible focus states on all links, buttons and inputs; never remove outlines without a replacement.
- All form inputs have labels (the floating label pattern counts); errors shown as text, not colour only.
- Motion: respect prefers-reduced-motion for animated sections and marquees.
- Buttons use real button/anchor elements; modals trap focus and close with Escape.


## 9. UI states every screen needs


| State | Requirement |
|---|---|
| Loading | Use skeletons from src/modules/skeletons or a spinner icon |
| Empty | Clear message and a next action |
| Error | Plain user message, retry option, no technical details |
| Success | Short confirmation (form sent, saved) |
| Disabled | Reduced opacity, not clickable, explained if needed |


## 10. Admin UI

Admin screens (src/app/admin) are functional and utilitarian: tables with pagination, forms with validation messages, SEO tab with title/description character counters (60 and 120–160) and a Google result preview, and role-based hiding of menu items.
