"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, AnimatePresence } from "motion/react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Epilogue, Outfit, Mansalva } from "next/font/google"
import type { Service } from "@lib/data/services"

const epilogue = Epilogue({ subsets: ["latin"], weight: ["700", "800"] })
const outfit   = Outfit({ subsets: ["latin"], weight: ["400", "500", "700"] })
const mansalva = Mansalva({ subsets: ["latin"], weight: ["400"] })

const PERFORMANCE_SLUGS = [
  "performance-marketing",
  "social-media-marketing",
  "search-engine-optimization",
  "d2c-branding-scale-growth",
  "conversion-rate-optimization",
  "script-copywriting",
  "strategy-consulting",
]

const WEB_AI_SLUGS = [
  "web-app-development",
  "ai-automation",
  "ai-agentic-service",
  "ai-video-generation",
]

const FAQS = [
  {
    q: "What services does Mommantum provide for D2C brands?",
    a: "Mommantum provides performance marketing, SEO, AEO, GEO, social media marketing, CRO, AI automation, AI video generation, web development, and D2C branding services to help brands grow faster online.",
  },
  {
    q: "How does your performance marketing service help increase sales?",
    a: "Our performance marketing service uses Meta Ads and Google Ads with audience targeting, creative testing, campaign optimization, and scaling strategies to generate real revenue and lower customer acquisition costs.",
  },
  {
    q: "What is included in your SEO, AEO and GEO services?",
    a: "Our SEO services include keyword strategy, ecommerce SEO, product page optimization, blog content creation, FAQ setup, structured content, and optimization for AI search platforms and answer engines.",
  },
  {
    q: "Do you offer social media marketing and content creation?",
    a: "Yes. We create social media strategies, content calendars, reels, captions, graphics, and profile optimization to help brands stay active and build trust on platforms like Instagram, LinkedIn, and YouTube.",
  },
  {
    q: "What is CRO and why is it important for ecommerce brands?",
    a: "CRO or Conversion Rate Optimization helps improve your website and landing pages so more visitors become customers. This includes funnel analysis, CTA improvements, and product page optimization.",
  },
  {
    q: "Can Mommantum build ecommerce websites and web apps?",
    a: "Yes. We develop fast and scalable ecommerce websites, custom web applications, and business platforms designed for better performance, conversions, and growth.",
  },
  {
    q: "What types of AI automation services do you offer?",
    a: "We offer AI workflow automation, task automation, customer support automation, AI chat systems, and automated business processes to save time and improve efficiency.",
  },
  {
    q: "What are AI Agentic Services?",
    a: "AI Agentic Services are custom AI agents that can handle multi-step business tasks, customer interactions, workflow automation, and smart decision-making processes for businesses.",
  },
  {
    q: "Do you create AI generated videos for brands?",
    a: "Yes. We create AI generated videos for ads, reels, social media content, explainers, and brand storytelling using text-to-video and image-to-video AI tools.",
  },
  {
    q: "How can Mommantum help scale a D2C brand?",
    a: "Mommantum helps D2C brands scale with branding strategy, SEO, paid ads, retention marketing, CRO, AI automation, and content systems that improve revenue, reduce CAC, and increase conversions.",
  },
]

type ScrollState = "idle" | "visible" | "resting"

function useScrollState(amount = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<ScrollState>("idle")
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setState("visible")
        else setState((prev) => (prev === "idle" ? "idle" : "resting"))
      },
      { threshold: amount, rootMargin: "0px 0px -40px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [amount])
  return { ref, state }
}

function Reveal({
  children, delay = 0, offset = 36, amount = 0.2, className = "",
}: {
  children: React.ReactNode; delay?: number; offset?: number
  amount?: number; className?: string
}) {
  const { ref, state } = useScrollState(amount)
  return (
    <motion.div
      ref={ref}
      className={className}
      style={state === "idle" ? { opacity: 0 } : undefined}
      animate={
        state === "visible"
          ? { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const } }
          : state === "resting"
          ? { opacity: 1, y: 0, transition: { duration: 0 } }
          : { opacity: 0, y: offset, transition: { duration: 0 } }
      }
    >
      {children}
    </motion.div>
  )
}

const PERFORMANCE_ACCENTS = [
  { accent: "#e61e73", light: "#fff0f6", border: "#fbb6d4", num: "#f9a8d4" },
  { accent: "#9333ea", light: "#f5eeff", border: "#d8b4fe", num: "#c4b5fd" },
  { accent: "#0ea5e9", light: "#e8f6ff", border: "#7dd3fc", num: "#93c5fd" },
  { accent: "#49d7a4", light: "#e8fdf5", border: "#6ee7b7", num: "#6ee7b7" },
  { accent: "#f59e0b", light: "#fffbeb", border: "#fde68a", num: "#fcd34d" },
  { accent: "#ef4444", light: "#fff5f5", border: "#fca5a5", num: "#fca5a5" },
  { accent: "#e61e73", light: "#fff0f6", border: "#fbb6d4", num: "#f9a8d4" },
]

const WEB_AI_ACCENTS = [
  { accent: "#6366f1", light: "#eef2ff", border: "#c7d2fe", num: "#a5b4fc" },
  { accent: "#0ea5e9", light: "#e8f6ff", border: "#7dd3fc", num: "#93c5fd" },
  { accent: "#49d7a4", light: "#e8fdf5", border: "#6ee7b7", num: "#6ee7b7" },
  { accent: "#9333ea", light: "#f5eeff", border: "#d8b4fe", num: "#c4b5fd" },
]

const MotionArticle = motion.create("article" as never) as typeof motion.div

const PerfIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="12" fill="#fff0f6" />
    <path d="M10 32 L18 22 L24 26 L34 14"
      stroke="#e61e73" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M29 12 L35 12 L35 18"
      stroke="#e61e73" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const WebAiIconSvg = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="12" fill="#f5eeff" />
    <rect x="10" y="30" width="6" height="8" rx="2" fill="#9333ea" opacity="0.35" />
    <rect x="18" y="22" width="6" height="16" rx="2" fill="#9333ea" opacity="0.6" />
    <rect x="26" y="14" width="6" height="24" rx="2" fill="#9333ea" />
    <circle cx="36" cy="11" r="3" fill="#9333ea" opacity="0.45" />
  </svg>
)

// ─── FAQ Icon ─────────────────────────────────────────────────────────────────
const FaqIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <rect width="44" height="44" rx="12" fill="#e8f6ff" />
    <circle cx="22" cy="19" r="6" stroke="#0ea5e9" strokeWidth="2.2" />
    <path d="M20 17.5 C20 16.4 21 15.5 22 15.5 C23.1 15.5 24 16.4 24 17.5 C24 18.5 23.2 19.3 22 20 L22 21"
      stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
    <circle cx="22" cy="22.5" r="0.8" fill="#0ea5e9" />
    <path d="M14 29 C14 26.2 17.6 24 22 24 C26.4 24 30 26.2 30 29"
      stroke="#0ea5e9" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
)

// ─── CENTERED Section Heading ────────────────────────────────────────────────
function SectionHeading({
  label, icon, title, description,
}: {
  label: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Reveal offset={20} amount={0.3}>
      <div className="mb-10 border-b border-slate-200 pb-8 text-center">
        <div className="flex justify-center mb-3">{icon}</div>
        <p className={`${mansalva.className} text-[15px] text-[#e61e73]`}>
          {label}
        </p>
        <h2 className={`${epilogue.className} mt-1 text-[28px] font-extrabold tracking-[-0.05em] text-[#0e2547] lg:text-[36px]`}>
          {title}
        </h2>
        <p className={`${outfit.className} mt-3 mx-auto max-w-[520px] text-[14px] leading-[1.8] text-slate-600`}>
          {description}
        </p>
      </div>
    </Reveal>
  )
}

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({
  item, index, theme,
}: {
  item: Service
  index: number
  theme: typeof PERFORMANCE_ACCENTS[0]
}) {
  const prefersReduced = useReducedMotion()
  const [isHov, setIsHov] = useState(false)
  const padNum = String(index + 1).padStart(2, "0")

  return (
    <Reveal delay={index * 0.06} offset={32} amount={0.1}>
      <MotionArticle
        className={`svc-card h-full${isHov ? " is-hovered" : ""}`}
        style={{
          "--card-accent": theme.accent,
          "--card-light":  theme.light,
          "--card-border": theme.border,
          "--card-num":    theme.num,
          border: `1.5px solid ${isHov ? theme.accent : "#ebebef"}`,
          boxShadow: isHov
            ? `0 16px 48px rgba(0,0,0,0.09), 0 0 0 1px ${theme.border}`
            : "0 2px 14px rgba(0,0,0,0.04)",
        } as React.CSSProperties}
        whileHover={prefersReduced ? {} : { y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
        onMouseEnter={() => setIsHov(true)}
        onMouseLeave={() => setIsHov(false)}
      >
        <div className="flex items-center justify-between gap-3">
          <span className={`${mansalva.className} svc-pill`}>{item.shortLabel}</span>
          <span className={`${epilogue.className} svc-num`}>{padNum}</span>
        </div>

        <h3 className={`${epilogue.className} mt-4 text-center text-[22px] font-extrabold leading-[1.08] tracking-[-0.04em] text-[#0e2547] lg:text-[26px]`}>
          {item.title}
        </h3>

        <p className={`${outfit.className} mt-3 text-center text-[13px] leading-[1.8] text-slate-600`}>
          {item.description}
        </p>

        <div className="svc-divider" />

        <p className={`${epilogue.className} mb-3 text-[10px] font-bold uppercase tracking-[0.09em] text-slate-400`}>
          Includes
        </p>

        <ul className="flex-1 space-y-2">
          {item.points.slice(0, 4).map((point) => (
            <li
              key={point}
              className={`${outfit.className} flex items-start gap-3 text-[13px] leading-[1.7] text-slate-600`}
            >
              <span className="svc-dot" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6" />

        <div className="flex justify-center mt-auto">
          <LocalizedClientLink
            href={`/services/${item.slug}`}
            className={`${epilogue.className} svc-cta`}
          >
            <span className="cta-label">Learn More</span>
            <span className="cta-arrow">→</span>
          </LocalizedClientLink>
        </div>
      </MotionArticle>
    </Reveal>
  )
}

// ─── Service Grid ─────────────────────────────────────────────────────────────
function ServiceGrid({
  items,
  accentMap,
}: {
  items: Service[]
  accentMap: typeof PERFORMANCE_ACCENTS
}) {
  const cols = 3
  const remainder = items.length % cols

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const isOrphan  = remainder === 1 && index === items.length - 1
        const isOrphan2 = remainder === 2 && index === items.length - 2

        return (
          <div
            key={item.slug}
            className={
              isOrphan
                ? "sm:col-span-2 lg:col-span-1 lg:col-start-2"
                : isOrphan2
                ? "lg:col-start-1"
                : ""
            }
          >
            <ServiceCard
              item={item}
              index={index}
              theme={accentMap[index % accentMap.length]}
            />
          </div>
        )
      })}
    </div>
  )
}

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
function FaqItem({
  q, a, index, isOpen, onToggle,
}: {
  q: string
  a: string
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  const padNum = String(index + 1).padStart(2, "0")

  return (
    <Reveal delay={index * 0.05} offset={20} amount={0.1}>
      <div
        className={`faq-item${isOpen ? " faq-open" : ""}`}
        style={{
          border: `1.5px solid ${isOpen ? "#e61e73" : "#ebebef"}`,
          boxShadow: isOpen
            ? "0 8px 32px rgba(230,30,115,0.08), 0 0 0 1px #fbb6d4"
            : "0 2px 10px rgba(0,0,0,0.03)",
        }}
      >
        <button
          className="faq-trigger w-full"
          onClick={onToggle}
          aria-expanded={isOpen}
        >
          {/* Number badge */}
          <span
            className={`${epilogue.className} faq-num`}
            style={{
              background: isOpen ? "#fff0f6" : "#f7f8fa",
              color: isOpen ? "#e61e73" : "#94a3b8",
              border: `1.5px solid ${isOpen ? "#fbb6d4" : "#e2e8f0"}`,
            }}
          >
            {padNum}
          </span>

          {/* Question text */}
          <span
            className={`${epilogue.className} faq-question`}
            style={{ color: isOpen ? "#0e2547" : "#1e3a5f" }}
          >
            {q}
          </span>

          {/* Toggle icon */}
          <span
            className="faq-icon"
            style={{
              background: isOpen ? "#e61e73" : "#f1f5f9",
              color: isOpen ? "#fff" : "#64748b",
              transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            }}
          >
            +
          </span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ height: 0, opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }}
              style={{ overflow: "hidden" }}
            >
              <div className="faq-answer">
                {/* Accent line */}
                <div className="faq-answer-bar" />
                <p className={`${outfit.className} faq-answer-text`}>{a}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  )
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────
function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i))

  // Split into two columns for desktop
  const leftFaqs  = FAQS.filter((_, i) => i % 2 === 0)
  const rightFaqs = FAQS.filter((_, i) => i % 2 !== 0)

  return (
    <div className="mt-16">
      <SectionHeading
        label="FAQ"
        icon={<FaqIcon />}
        title="Frequently Asked Questions"
        description="Everything you need to know about Mommantum's services and how we help D2C brands grow faster."
      />

      {/* Two-column FAQ grid on desktop, single-column on mobile */}
      <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
        {/* Left column */}
        <div className="flex flex-col gap-3">
          {leftFaqs.map((faq, colIdx) => {
            const globalIdx = colIdx * 2
            return (
              <FaqItem
                key={globalIdx}
                q={faq.q}
                a={faq.a}
                index={globalIdx}
                isOpen={openIndex === globalIdx}
                onToggle={() => toggle(globalIdx)}
              />
            )
          })}
        </div>
        {/* Right column */}
        <div className="flex flex-col gap-3">
          {rightFaqs.map((faq, colIdx) => {
            const globalIdx = colIdx * 2 + 1
            return (
              <FaqItem
                key={globalIdx}
                q={faq.q}
                a={faq.a}
                index={globalIdx}
                isOpen={openIndex === globalIdx}
                onToggle={() => toggle(globalIdx)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ServicesClient({ services }: { services: Service[] }) {
  const performanceServices = PERFORMANCE_SLUGS.map(slug => services.find(s => s.slug === slug)).filter(Boolean) as Service[]
  const webAiServices       = WEB_AI_SLUGS.map(slug => services.find(s => s.slug === slug)).filter(Boolean) as Service[]
  const uncategorized       = services.filter(s =>
    !PERFORMANCE_SLUGS.includes(s.slug) && !WEB_AI_SLUGS.includes(s.slug)
  )
  const allPerformance = [...performanceServices, ...uncategorized]

  return (
    <main
      className="relative overflow-hidden pt-16 pb-20 lg:pt-20 lg:pb-24"
      style={{ background: "#f7f8fa" }}
    >
      <style>{`
        /* ── Service Cards ── */
        .svc-card {
          position: relative;
          background: #ffffff;
          border-radius: 18px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .svc-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 18px 18px 0 0;
          background: var(--card-accent);
          opacity: 0;
          transition: opacity 0.25s ease;
          z-index: 2;
        }
        .svc-card.is-hovered::before { opacity: 1; }
        .svc-pill {
          display: inline-flex; align-items: center;
          padding: 3px 10px; border-radius: 999px;
          font-size: 11px; font-weight: 700;
          background: var(--card-light);
          color: var(--card-accent);
          border: 1.5px solid var(--card-border);
          transition: background 0.2s ease;
          white-space: nowrap;
        }
        .svc-card.is-hovered .svc-pill {
          background: var(--card-accent);
          color: #fff;
          border-color: var(--card-accent);
        }
        .svc-num {
          font-size: 15px; font-weight: 800;
          color: var(--card-num);
          transition: color 0.25s ease, transform 0.25s ease;
          flex-shrink: 0;
        }
        .svc-card.is-hovered .svc-num {
          color: var(--card-accent);
          transform: scale(1.1);
        }
        .svc-dot {
          margin-top: 8px; width: 6px; height: 6px; flex-shrink: 0;
          border-radius: 50%; background: #cbd5e1;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .svc-card.is-hovered .svc-dot {
          background: var(--card-accent);
          transform: scale(1.3);
        }
        .svc-cta {
          position: relative; display: inline-flex; align-items: center;
          gap: 7px; padding: 10px 18px; border-radius: 10px;
          font-size: 12px; font-weight: 800; letter-spacing: 0.04em;
          text-transform: uppercase; text-decoration: none;
          color: var(--card-accent); border: 2px solid var(--card-border);
          background: transparent; overflow: hidden;
          transition: color 0.25s ease, box-shadow 0.25s ease;
        }
        .svc-cta::before {
          content: ""; position: absolute; inset: 0;
          background: var(--card-accent);
          transform: translateX(-101%);
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
          z-index: 0;
        }
        .svc-cta:hover::before { transform: translateX(0); }
        .svc-cta:hover { color: #fff; box-shadow: 0 6px 20px rgba(15,23,42,0.10); }
        .svc-cta .cta-label, .svc-cta .cta-arrow { position: relative; z-index: 1; }
        .svc-cta .cta-arrow {
          display: inline-block; font-size: 15px;
          transition: transform 0.22s ease;
        }
        .svc-cta:hover .cta-arrow { transform: translateX(4px); }
        .svc-divider { height: 1px; background: #f1f5f9; margin: 14px 0 12px; }

        /* ── FAQ Accordion ── */
        .faq-item {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .faq-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 20px;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          width: 100%;
          -webkit-tap-highlight-color: transparent;
        }
        .faq-trigger:focus-visible {
          outline: 2px solid #e61e73;
          outline-offset: -2px;
          border-radius: 14px;
        }
        .faq-num {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px; height: 34px;
          border-radius: 9px;
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.03em;
          transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }
        .faq-question {
          flex: 1;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.45;
          letter-spacing: -0.02em;
          transition: color 0.2s ease;
        }
        @media (min-width: 1024px) {
          .faq-question { font-size: 15px; }
        }
        .faq-icon {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px; height: 28px;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 300;
          line-height: 1;
          transition: background 0.25s ease, color 0.25s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .faq-answer {
          display: flex;
          gap: 14px;
          padding: 0 20px 20px 20px;
        }
        .faq-answer-bar {
          flex-shrink: 0;
          width: 3px;
          border-radius: 99px;
          background: linear-gradient(180deg, #e61e73, #9333ea);
          align-self: stretch;
          min-height: 100%;
        }
        .faq-answer-text {
          font-size: 13px;
          line-height: 1.85;
          color: #475569;
          margin: 0;
        }
      `}</style>

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[5%] top-[5%] h-[200px] w-[500px] rounded-full bg-white/60 blur-3xl" />
        <div className="absolute right-[8%] top-[12%] h-[160px] w-[400px] rounded-full bg-white/50 blur-3xl" />
        <div className="absolute left-[20%] bottom-[10%] h-[140px] w-[460px] rounded-full bg-white/40 blur-3xl" />
        <div className="absolute right-[12%] bottom-[5%] h-[120px] w-[360px] rounded-full bg-purple-100/25 blur-3xl" />
      </div>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px]">

          {/* ── Page Header ──────────────────────────────────────────────── */}
          <div className="mb-16 lg:mb-20">
            <Reveal offset={20} amount={0.5}>
              <p className={`${mansalva.className} mb-4 text-[20px] text-[#e61e73]`}>
                Our Services
              </p>
            </Reveal>

            <Reveal delay={0.08} offset={28} amount={0.4}>
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
                <h1 className={`${epilogue.className} flex-shrink-0 text-[40px] font-extrabold leading-[1.0] tracking-[-0.06em] text-[#0e2547] sm:text-[52px] lg:text-[64px] xl:text-[80px]`}>
                  Built to grow
                  <br />
                  <span className="relative inline-block">
                    <span className="relative z-10">your brand.</span>
                    <motion.span
                      className="absolute bottom-[2px] left-[-4px] right-[-4px] -z-10 h-[12px] rounded-[3px] bg-[#ef6a99]"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ duration: 0.55, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                      style={{ transformOrigin: "left center" }}
                    />
                  </span>
                </h1>

                <div className="lg:max-w-[420px] lg:pb-2">
                  <Reveal delay={0.14} offset={16} amount={0.4}>
                    <p className={`${outfit.className} text-[15px] leading-[1.9] text-slate-600 lg:text-[16px]`}>
                      From performance marketing and SEO to web development and AI —
                      every service delivers real business outcomes.
                    </p>
                  </Reveal>

                  <Reveal delay={0.2} offset={16} amount={0.3}>
                    <div className="mt-7 flex flex-wrap items-center gap-6 border-t border-slate-200 pt-6 sm:gap-8">
                      <div>
                        <p className={`${epilogue.className} text-[36px] font-extrabold leading-none tracking-[-0.05em] text-[#0e2547] lg:text-[44px]`}>
                          {services.length}+
                        </p>
                        <p className={`${outfit.className} mt-1 text-[12px] font-medium text-slate-400`}>
                          Service areas
                        </p>
                      </div>
                      <div className="hidden h-10 w-[1px] bg-slate-200 sm:block" />
                      <div>
                        <p className={`${epilogue.className} text-[36px] font-extrabold leading-none tracking-[-0.05em] text-[#0e2547] lg:text-[44px]`}>
                          2
                        </p>
                        <p className={`${outfit.className} mt-1 text-[12px] font-medium text-slate-400`}>
                          Specializations
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── Section 1 — Performance Marketing ───────────────────────── */}
          <div className="mb-16">
            <SectionHeading
              label="01"
              icon={<PerfIcon />}
              title="Performance Marketing"
              description="Ads, SEO, content, and brand growth systems that drive real revenue and reduce acquisition costs."
            />
            <ServiceGrid
              items={allPerformance}
              accentMap={PERFORMANCE_ACCENTS}
            />
          </div>

          {/* ── Section 2 — Web & AI Development ────────────────────────── */}
          {webAiServices.length > 0 && (
            <div className="mb-10">
              <SectionHeading
                label="02"
                icon={<WebAiIconSvg />}
                title="Web & AI Development"
                description="Custom websites, apps, and AI systems that help you run faster, convert better, and scale efficiently."
              />
              <ServiceGrid
                items={webAiServices}
                accentMap={WEB_AI_ACCENTS}
              />
            </div>
          )}

          {/* ── Bottom CTA ───────────────────────────────────────────────── */}
          <Reveal delay={0.1} offset={20} amount={0.2}>
            <div
              className="mt-14 overflow-hidden rounded-[22px] p-8 text-center lg:p-12"
              style={{ background: "linear-gradient(135deg, #0e2547 0%, #1a3a6b 60%, #0e2547 100%)" }}
            >
              <p className={`${mansalva.className} text-[18px] text-[#ef6a99]`}>
                Not sure where to start?
              </p>
              <h2 className={`${epilogue.className} mt-2 text-[26px] font-extrabold tracking-[-0.04em] text-white lg:text-[34px]`}>
                Let&apos;s build your growth system
              </h2>
              <p className={`${outfit.className} mt-3 text-[14px] text-white/75`}>
                Book a free strategy call — no commitment, just clarity.
              </p>
              <div className="mt-7">
                <LocalizedClientLink
                  href="/contact"
                  className={`${epilogue.className} inline-flex h-[50px] items-center justify-center rounded-[12px] px-8 text-[13px] font-extrabold uppercase tracking-[0.04em] text-white transition-all hover:opacity-90`}
                  style={{ background: "linear-gradient(135deg, #e61e73, #9333ea)" }}
                >
                  Book a Free Call →
                </LocalizedClientLink>
              </div>
            </div>
          </Reveal>

          {/* ── FAQ Section ──────────────────────────────────────────────── */}
          <FaqSection />

        </div>
      </div>
    </main>
  )
}