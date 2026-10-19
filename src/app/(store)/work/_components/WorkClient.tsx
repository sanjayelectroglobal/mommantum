"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import type { CaseStudy, Testimonial } from "@lib/data/case-studies"
import { epilogue, outfit, mansalva } from "@lib/fonts"

type TeamMember = {
  name: string
  role: string
  description: string
  image: string
}

type Props = {
  params: { countryCode: string }
  caseStudies: CaseStudy[]
  testimonials: Testimonial[]
  teamMember: TeamMember
}

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
  children: React.ReactNode
  delay?: number
  offset?: number
  amount?: number
  className?: string
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

function useUnderlineState() {
  const ref = useRef<HTMLSpanElement>(null)
  const [state, setState] = useState<ScrollState>("idle")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setState("visible")
        else setState((prev) => (prev === "idle" ? "idle" : "resting"))
      },
      { threshold: 0.8 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, state }
}

const ACCENTS = [
  { accent: "#e61e73", pillBg: "#fff0f6", pillHoverBg: "#ffe0ef", pillBorder: "#fbb6d4" },
  { accent: "#9333ea", pillBg: "#f5eeff", pillHoverBg: "#ede0ff", pillBorder: "#d8b4fe" },
  { accent: "#0ea5e9", pillBg: "#e8f6ff", pillHoverBg: "#d0edff", pillBorder: "#7dd3fc" },
  { accent: "#49d7a4", pillBg: "#e8fdf5", pillHoverBg: "#ccf7e8", pillBorder: "#6ee7b7" },
]

const MotionArticle = motion.create("article" as never) as typeof motion.div

export default function WorkClient({ params, caseStudies, testimonials, teamMember }: Props) {
  const { countryCode } = params
  const prefersReduced = useReducedMotion()
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [hoveredTestimonial, setHoveredTestimonial] = useState<number | null>(null)
  const { ref: underlineRef, state: underlineState } = useUnderlineState()
  const { ref: teamUnderlineRef, state: teamUnderlineState } = useUnderlineState()

  return (
    <main className="relative overflow-hidden bg-[#f7f8fa] pt-16 pb-20 lg:pt-20 lg:pb-24">

      <style>{`
        @keyframes strokeIn {
          from { width:0%; opacity:0; }
          to   { width:var(--ul-w, 58%); opacity:1; }
        }
        .page-underline {
          position:absolute; bottom:8px; left:0; z-index:-1;
          height:14px; border-radius:2px; background:var(--ul-color, #ef6a99);
          width:var(--ul-w, 58%); opacity:1;
        }
        .page-underline.idle    { width:0%; opacity:0; }
        .page-underline.visible { animation:strokeIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.25s forwards; }

        .cs-card {
          position:relative; background:#fff; border-radius:20px;
          overflow:hidden; display:flex; flex-direction:column;
          transition:border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .cs-card::before {
          content:""; position:absolute; top:0; left:0; right:0; height:4px;
          border-radius:20px 20px 0 0; background:var(--card-accent);
          opacity:0; transition:opacity 0.25s ease; z-index:10;
        }
        .cs-card.is-hovered::before { opacity:1; }
        .cs-img-zone {
          position:relative; overflow:hidden; aspect-ratio:16/10;
          background:#f0f0f0; flex-shrink:0; display:block;
        }
        .cs-img-zone img { transition:transform 0.6s ease !important; }
        .cs-card.is-hovered .cs-img-zone img { transform:scale(1.05) !important; }
        .cs-pill {
          display:inline-flex; align-items:center; padding:4px 12px;
          border-radius:999px; font-size:12px; font-weight:700;
          background:var(--pill-bg); color:var(--card-accent);
          border:1.5px solid var(--pill-border);
          transition:background 0.2s ease, border-color 0.2s ease;
        }
        .cs-card.is-hovered .cs-pill { background:var(--pill-hover-bg); border-color:var(--card-accent); }
        .cs-content { padding:20px 22px 26px; display:flex; flex-direction:column; flex:1; }
        .cs-divider { height:1px; background:#f0f0f0; margin:14px 0; }
        .cs-view-link {
          display:inline-flex; align-items:center; gap:6px; font-size:12px;
          font-weight:800; letter-spacing:0.04em; text-transform:uppercase;
          text-decoration:none; color:var(--card-accent);
          margin-top:auto; padding-top:16px;
          transition:opacity 0.2s ease;
        }
        .cs-view-link:hover { opacity:0.7; }
        .cs-view-link .link-arrow { display:inline-block; transition:transform 0.2s ease; }
        .cs-view-link:hover .link-arrow { transform:translateX(5px); }
        .cs-title-link { text-decoration:none; color:#0e2547; transition:color 0.2s ease; }
        .cs-card.is-hovered .cs-title-link { color:var(--card-accent); }
        .cs-doodle { position:absolute; top:-4px; right:14px; z-index:20; pointer-events:none; }

        .team-card {
          overflow:hidden; border-radius:24px; background:#fff;
          box-shadow:0 22px 55px rgba(0,0,0,0.07);
          transition:box-shadow 0.3s ease;
        }
        .team-card:hover { box-shadow:0 32px 72px rgba(0,0,0,0.11); }

        .testi-card {
          background:#fff; border-radius:20px; padding:26px;
          border:1.5px solid #ebebeb;
          display:flex; flex-direction:column; gap:18px;
          transition:border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .testi-card.is-hovered {
          border-color:var(--tcard-accent);
          box-shadow:0 16px 44px rgba(0,0,0,0.09);
        }
        .testi-card::before {
          content:open-quote; font-size:64px; line-height:1; color:var(--tcard-accent);
          opacity:0.18; font-family:Georgia,serif; display:block;
          margin-bottom:-26px; margin-top:-8px;
        }
        .testi-quote { font-size:15px; line-height:1.85; color:#475569; font-style:italic; }
        .testi-author { display:flex; align-items:center; gap:12px; margin-top:auto; }
        .testi-avatar {
          width:40px; height:40px; border-radius:50%; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          font-size:14px; font-weight:700; color:#fff;
          background:var(--tcard-accent);
        }
        .testi-name { font-size:13px; font-weight:700; color:#0e2547; }
        .testi-role { font-size:11px; color:#94a3b8; margin-top:2px; }
      `}</style>

      {/* BG blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[5%] top-[6%] h-[140px] w-[420px] rounded-full bg-white/50 blur-3xl" />
        <div className="absolute right-[6%] top-[10%] h-[150px] w-[360px] rounded-full bg-white/40 blur-3xl" />
        <div className="absolute left-[18%] bottom-[8%] h-[120px] w-[420px] rounded-full bg-white/35 blur-3xl" />
        <div className="absolute right-[14%] bottom-[5%] h-[110px] w-[340px] rounded-full bg-purple-100/20 blur-3xl" />
      </div>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px]">

          {/* ── Heading ── */}
          <div className="max-w-[760px]">
            <Reveal offset={20} amount={0.5}>
              <p className={`${mansalva.className} mb-4 text-[20px] font-bold leading-none text-[#e61e73]`}>
                Case Studies
              </p>
            </Reveal>

            <Reveal delay={0.08} offset={24} amount={0.5}>
              <h1 className={`${epilogue.className} text-[38px] font-extrabold leading-[0.97] tracking-[-0.065em] text-[#0e2547] sm:text-[52px] lg:text-[68px]`}>
                <span className="relative inline-block">
                  Real brands. Real growth.
                  <span
                    ref={underlineRef}
                    className={`page-underline ${underlineState === "resting" ? "" : underlineState}`}
                    style={{ "--ul-w": "58%", "--ul-color": "#ef6a99" } as React.CSSProperties}
                  />
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.14} offset={16} amount={0.4}>
              <p className={`${outfit.className} mt-5 max-w-[580px] text-[16px] leading-[1.9] text-slate-600`}>
                Work we have done for brands across D2C and ecommerce.
                Every project here had a real problem, a real strategy, and real results.
              </p>
            </Reveal>
          </div>

          {/* ── Case Study Cards ── */}
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {caseStudies.map((item, idx) => {
              const theme = item.accent
                ? { accent: item.accent, pillBg: "#fff0f6", pillHoverBg: "#ffe0ef", pillBorder: "#fbb6d4" }
                : ACCENTS[idx % ACCENTS.length]

              // Override pill colors based on accent
              const accentTheme = ACCENTS[idx % ACCENTS.length]
              const isHov = hoveredCard === idx

              return (
                <Reveal key={item.slug} delay={idx * 0.08} offset={44} amount={0.08}>
                  <MotionArticle
                    className={`cs-card h-full${isHov ? " is-hovered" : ""}`}
                    style={{
                      "--card-accent":   accentTheme.accent,
                      "--pill-bg":       accentTheme.pillBg,
                      "--pill-hover-bg": accentTheme.pillHoverBg,
                      "--pill-border":   accentTheme.pillBorder,
                      border: `1.5px solid ${isHov ? accentTheme.accent : "#ebebeb"}`,
                      boxShadow: isHov
                        ? "0 24px 60px rgba(0,0,0,0.12)"
                        : "0 4px 16px rgba(0,0,0,0.04)",
                    } as React.CSSProperties}
                    whileHover={prefersReduced ? {} : {
                      y: -8,
                      transition: { duration: 0.22, ease: "easeOut" },
                    }}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Image */}
                    <Link
                      href={`/work/${item.slug}`}
                      className="cs-img-zone"
                      tabIndex={-1}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={idx === 0}
                      />
                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%]"
                        style={{ background: "linear-gradient(to top,rgba(14,37,71,0.35) 0%,transparent 100%)" }}
                      />
                      <div className="cs-doodle">
                        <svg width="52" height="36" viewBox="0 0 82 54" fill="none">
                          <path
                            d="M8 44C14 20 14 8 14 2M24 46C30 24 30 11 30 4M40 48C46 26 46 13 46 6M56 48C62 28 62 16 62 10M72 46C76 30 76 20 76 14"
                            stroke={accentTheme.accent} strokeWidth="4" strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="cs-content">
                      <div className="mb-3">
                        <span className={`${outfit.className} cs-pill`}>
                          {item.category}
                        </span>
                      </div>

                      <h2 className={`${epilogue.className} text-[20px] font-extrabold leading-[1.1] tracking-[-0.04em] text-[#0e2547] lg:text-[24px]`}>
                        <Link
                          href={`/work/${item.slug}`}
                          className="cs-title-link"
                        >
                          {item.title}
                        </Link>
                      </h2>

                      {item.about && (
                        <p className={`${outfit.className} mt-2 text-[13px] leading-[1.75] text-slate-500`}>
                          {item.about}
                        </p>
                      )}

                      <div className="cs-divider" />

                      {item.results && item.results.length > 0 && (
                        <>
                          <p className={`${epilogue.className} mb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400`}>
                            Results
                          </p>
                          <ul className="space-y-1.5">
                            {item.results.slice(0, 3).map((r) => (
                              <li
                                key={r}
                                className={`${outfit.className} flex items-start gap-2 text-[13px] leading-[1.6] text-slate-600`}
                              >
                                <span
                                  className="mt-[5px] h-[5px] w-[5px] flex-shrink-0 rounded-full"
                                  style={{ background: accentTheme.accent, opacity: 0.7 }}
                                />
                                {r}
                              </li>
                            ))}
                          </ul>
                          <div className="cs-divider" />
                        </>
                      )}

                      <Link
                        href={`/work/${item.slug}`}
                        className={`${epilogue.className} cs-view-link`}
                      >
                        View Case Study
                        <span className="link-arrow">→</span>
                      </Link>
                    </div>
                  </MotionArticle>
                </Reveal>
              )
            })}
          </div>

          {/* ── Team Section ── */}
          <section className="mt-20">
            <Reveal offset={24} amount={0.4}>
              <div className="max-w-[680px]">
                <p className={`${mansalva.className} mb-3 text-[20px] font-bold leading-none text-[#e61e73]`}>
                  The Team
                </p>
                <h2 className={`${epilogue.className} text-[34px] font-extrabold leading-[1.0] tracking-[-0.05em] text-[#0e2547] lg:text-[48px]`}>
                  <span className="relative inline-block">
                    The team behind your growth
                    <span
                      ref={teamUnderlineRef}
                      className={`page-underline ${teamUnderlineState === "resting" ? "" : teamUnderlineState}`}
                      style={{ "--ul-w": "72%", "--ul-color": "#99dcf8" } as React.CSSProperties}
                    />
                  </span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.12} offset={32} amount={0.15}>
              <div className="team-card mt-10 grid lg:grid-cols-[320px_1fr]">

                {/* Photo */}
                <div className="relative min-h-[320px] bg-[#eef0f2] lg:min-h-[420px]">
                  <Image
                    src={teamMember.image}
                    alt={teamMember.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 320px"
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%]"
                    style={{ background: "linear-gradient(to top,rgba(14,37,71,0.45) 0%,transparent 100%)" }}
                  />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className={`${epilogue.className} text-[20px] font-extrabold text-white`}>
                      {teamMember.name}
                    </p>
                    <p className={`${outfit.className} mt-0.5 text-[13px] font-medium text-[#ef6a99]`}>
                      {teamMember.role}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <div className="mb-5 h-[4px] w-[44px] rounded-full bg-[#e61e73]" />
                  <p className={`${outfit.className} text-[16px] leading-[1.95] text-slate-600 lg:text-[17px]`}>
                    {teamMember.description}
                  </p>
                  <div className="mt-8">
                    <Link
                      href="/about"
                      className={`${epilogue.className} inline-flex h-[46px] items-center justify-center rounded-[12px] bg-[#0e2547] px-7 text-[12px] font-extrabold uppercase tracking-[0.04em] text-white transition-all hover:bg-[#e61e73]`}
                    >
                      More About Us →
                    </Link>
                  </div>
                </div>

              </div>
            </Reveal>
          </section>

          {/* ── Testimonials ── */}
          <section className="mt-20">
            <Reveal offset={24} amount={0.4}>
              <div className="mb-10">
                <p className={`${mansalva.className} mb-3 text-[20px] font-bold text-[#e61e73]`}>
                  Kind Words
                </p>
                <h2 className={`${epilogue.className} text-[30px] font-extrabold leading-[1.0] tracking-[-0.05em] text-[#0e2547] lg:text-[44px]`}>
                  What our clients say
                </h2>
              </div>
            </Reveal>

            <div className="grid gap-5 lg:grid-cols-3">
              {testimonials.map((item, idx) => {
                const accentColors = ["#e61e73", "#9333ea", "#0ea5e9"]
                const accent = accentColors[idx % accentColors.length]
                const isHov = hoveredTestimonial === idx
                const initials = item.author
                  .split(" ")
                  .map((w: string) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()

                return (
                  <Reveal key={item.author} delay={idx * 0.1} offset={32} amount={0.2}>
                    <motion.div
                      className={`testi-card h-full${isHov ? " is-hovered" : ""}`}
                      style={{ "--tcard-accent": accent } as React.CSSProperties}
                      whileHover={prefersReduced ? {} : {
                        y: -6,
                        transition: { duration: 0.22, ease: "easeOut" },
                      }}
                      onMouseEnter={() => setHoveredTestimonial(idx)}
                      onMouseLeave={() => setHoveredTestimonial(null)}
                    >
                      <p className={`${outfit.className} testi-quote`}>
                        &ldquo;{item.quote}&rdquo;
                      </p>
                      <div className="testi-author">
                        <div className="testi-avatar">{initials}</div>
                        <div>
                          <p className={`${epilogue.className} testi-name`}>{item.author}</p>
                          {item.role && (
                            <p className={`${outfit.className} testi-role`}>{item.role}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Reveal>
                )
              })}
            </div>
          </section>

          {/* ── Bottom CTA ── */}
          <Reveal delay={0.1} offset={20} amount={0.2}>
            <div
              className="mt-16 overflow-hidden rounded-[22px] p-8 text-center lg:p-12"
              style={{ background: "linear-gradient(135deg, #0e2547 0%, #1a3a6b 60%, #0e2547 100%)" }}
            >
              <p className={`${mansalva.className} text-[18px] text-[#ef6a99]`}>
                Ready to grow?
              </p>
              <h2 className={`${epilogue.className} mt-2 text-[24px] font-extrabold tracking-[-0.04em] text-white lg:text-[34px]`}>
                Let&apos;s build your growth system
              </h2>
              <p className={`${outfit.className} mt-3 text-[14px] text-white/70`}>
                Book a free strategy call — no commitment, just clarity.
              </p>
              <div className="mt-7">
                <Link
                  href="/contact"
                  className={`${epilogue.className} inline-flex h-[48px] items-center justify-center rounded-[12px] px-8 text-[13px] font-extrabold uppercase tracking-[0.04em] text-white transition-all hover:opacity-90`}
                  style={{ background: "linear-gradient(135deg, #e61e73, #9333ea)" }}
                >
                  Let&apos;s Make It Happen →
                </Link>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </main>
  )
}