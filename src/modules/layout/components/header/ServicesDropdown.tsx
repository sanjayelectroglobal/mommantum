/**
 * @file ServicesDropdown.tsx
 * @description Desktop navigation megamenu dropdown for Mommantum's services.
 * 
 * WHAT: Displays a 3-column organized menu categorized by service discipline:
 *   1. Performance Marketing (Ads, SEO, CRO, Consulting)
 *   2. Web & AI Development (Websites, Apps, Automation, Agentic systems)
 *   3. Video Editz (AI Video Generation, Scripting, Video Editing, Podcasts, Motion Graphics)
 * 
 * WHY: Provides visitors with immediate, 1-click access to all core and specialized service offerings.
 */

"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Core Performance Marketing services list
const performanceServices = [
  { name: "Performance marketing - meta ads, google ads", link: "/services/performance-marketing" },
  { name: "Social media marketing - SMO and Content Creation", link: "/services/social-media-marketing" },
  { name: "SEO - AEO & GEO", link: "/services/search-engine-optimization" },
  { name: "D2C Branding & Scale Growth", link: "/services/d2c-branding-scale-growth" },
  { name: "CRO - Conversion Rate Optimization", link: "/services/conversion-rate-optimization" },
  { name: "Script & Copywriting", link: "/services/script-copywriting" },
  { name: "Strategy & Consulting", link: "/services/strategy-consulting" },
]

// Web and AI Automation & Engineering services
const webAiServices = [
  { name: "Web and app development", link: "/services/web-app-development" },
  { name: "Ai automation", link: "/services/ai-automation" },
  { name: "Ai agentic service", link: "/services/ai-agentic-service" },
  { name: "Ai Video generation", link: "/services/ai-video-generation" },
]

// Video Editz & Creative Production services
const videoEditzServices = [
  { name: "AI video generator", link: "/services/ai-video-generation" },
  { name: "Content and Video Scripting", link: "/services/content-video-scripting" },
  { name: "Video Editing", link: "/services/video-editing" },
  { name: "AI Video Editing", link: "/services/ai-video-editing" },
  { name: "Podcast Editing", link: "/services/podcast-editing" },
  { name: "motion graphics", link: "/services/motion-graphics" },
]

// Performance icon
const PerfIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="8" fill="#fff0f6" />
    <path d="M8 26 L14 18 L20 22 L28 10" stroke="#e61e73" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 9 L29 9 L29 14" stroke="#e61e73" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="14" cy="18" r="2" fill="#e61e73" opacity="0.4" />
    <circle cx="20" cy="22" r="2" fill="#e61e73" opacity="0.4" />
  </svg>
)

// Web & AI icon
const WebAiIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="8" fill="#f5eeff" />
    <rect x="8" y="24" width="5" height="8" rx="1.5" fill="#9333ea" opacity="0.4" />
    <rect x="15" y="18" width="5" height="14" rx="1.5" fill="#9333ea" opacity="0.65" />
    <rect x="22" y="12" width="5" height="20" rx="1.5" fill="#9333ea" />
    <circle cx="29" cy="9" r="2.5" fill="#9333ea" opacity="0.5" />
  </svg>
)

// Video Editz icon
const VideoEditzIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="8" fill="#fff7ed" />
    <rect x="9" y="10" width="18" height="16" rx="3" stroke="#ea580c" strokeWidth="2" />
    <polygon points="16,14.5 22,18 16,21.5" fill="#ea580c" />
    <circle cx="23" cy="13" r="1" fill="#ea580c" opacity="0.6" />
    <circle cx="13" cy="23" r="1" fill="#ea580c" opacity="0.6" />
  </svg>
)

export default function ServicesDropdown() {
  return (
    <div
      className="invisible absolute left-1/2 top-full z-50 mt-4 w-[860px] -translate-x-[42%] rounded-[20px] border border-neutral-100 bg-white opacity-0 shadow-[0_20px_60px_rgba(0,0,0,0.10)] transition-all duration-200 group-hover:visible group-hover:opacity-100"
      style={{ minWidth: 820 }}
    >
      {/* Top header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
          What we do
        </p>
        <LocalizedClientLink
          href="/services"
          className="text-[12px] font-extrabold text-[#e61e73] hover:underline"
        >
          View all →
        </LocalizedClientLink>
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-3 divide-x divide-neutral-100">

        {/* Col 1 — Performance Marketing */}
        <div className="flex flex-col justify-between px-5 py-5">
          <div>
            {/* Category header */}
            <div className="mb-4 flex items-center gap-3">
              <PerfIcon />
              <div>
                <p className="text-[14px] font-extrabold tracking-[-0.02em] text-[#0e2547]">
                  Performance Marketing
                </p>
                <p className="mt-0.5 text-[12px] leading-[1.5] text-neutral-400">
                  Ads, SEO, content & brand growth
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-0.5">
              {performanceServices.map((item) => (
                <LocalizedClientLink
                  key={item.name}
                  href={item.link}
                  prefetch={false}
                  className="block rounded-[8px] px-2 py-2 text-[13px] font-medium text-neutral-600 transition-all hover:bg-rose-50 hover:pl-4 hover:text-[#e61e73]"
                >
                  {item.name}
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        </div>

        {/* Col 2 — Web & AI */}
        <div className="flex flex-col justify-between px-5 py-5">
          <div>
            {/* Category header */}
            <div className="mb-4 flex items-center gap-3">
              <WebAiIcon />
              <div>
                <p className="text-[14px] font-extrabold tracking-[-0.02em] text-[#0e2547]">
                  Web & AI Development
                </p>
                <p className="mt-0.5 text-[12px] leading-[1.5] text-neutral-400">
                  Websites, apps & AI systems
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-0.5">
              {webAiServices.map((item) => (
                <LocalizedClientLink
                  key={item.name}
                  href={item.link}
                  prefetch={false}
                  className="block rounded-[8px] px-2 py-2 text-[13px] font-medium text-neutral-600 transition-all hover:bg-purple-50 hover:pl-4 hover:text-[#9333ea]"
                >
                  {item.name}
                </LocalizedClientLink>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div className="mt-5 rounded-[12px] p-4" style={{ background: "linear-gradient(135deg, #f5eeff, #fff0f6)" }}>
            <p className="text-[12px] font-extrabold text-[#0e2547]">
              Need something custom?
            </p>
            <p className="mt-1 text-[11px] leading-[1.6] text-neutral-400">
              Tailored solutions for D2C brands at every stage.
            </p>
            <LocalizedClientLink
              href="/contact"
              className="mt-2 inline-flex items-center gap-1 text-[12px] font-extrabold text-[#e61e73] hover:underline"
            >
              Let&apos;s Talk →
            </LocalizedClientLink>
          </div>
        </div>

        {/* Col 3 — Video Editz */}
        <div className="flex flex-col justify-between px-5 py-5">
          <div>
            {/* Category header */}
            <div className="mb-4 flex items-center gap-3">
              <VideoEditzIcon />
              <div>
                <p className="text-[14px] font-extrabold tracking-[-0.02em] text-[#0e2547]">
                  Video Editz
                </p>
                <p className="mt-0.5 text-[12px] leading-[1.5] text-neutral-400">
                  Reels, AI videos & motion content
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-0.5">
              {videoEditzServices.map((item) => (
                <LocalizedClientLink
                  key={item.name}
                  href={item.link}
                  prefetch={false}
                  className="block rounded-[8px] px-2 py-2 text-[13px] font-medium text-neutral-600 transition-all hover:bg-orange-50 hover:pl-4 hover:text-[#ea580c]"
                >
                  {item.name}
                </LocalizedClientLink>
              ))}
            </div>
          </div>

          {/* Editz card */}
          <div className="mt-5 rounded-[12px] p-4" style={{ background: "linear-gradient(135deg, #fff7ed, #fff1f2)" }}>
            <p className="text-[12px] font-extrabold text-[#0e2547]">
              Mommantum Editz
            </p>
            <p className="mt-1 text-[11px] leading-[1.6] text-neutral-400">
              High-retention editing & AI video for brands & creators.
            </p>
            <LocalizedClientLink
              href="/editz"
              className="mt-2 inline-flex items-center gap-1 text-[12px] font-extrabold text-[#ea580c] hover:underline"
            >
              Explore Studio →
            </LocalizedClientLink>
          </div>
        </div>

      </div>
    </div>
  )
}