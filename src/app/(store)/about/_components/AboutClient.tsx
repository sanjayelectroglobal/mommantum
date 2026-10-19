"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import StatsStrip from "@modules/home/components/stats-strip"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { epilogue, outfit, mansalva } from "@lib/fonts"

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
  children: React.ReactNode; delay?: number; offset?: number; amount?: number; className?: string
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

const CrownIcon = () => (
  <svg width="72" height="50" viewBox="0 0 80 56" fill="none">
    <path d="M6 48 L18 16 L34 32 L40 8 L46 32 L62 16 L74 48 Z"
      fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
    <rect x="6" y="49" width="68" height="6" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="40" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="18" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="62" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const SparkleIcon = () => (
  <svg width="52" height="52" viewBox="0 0 64 64" fill="none">
    <path d="M32 4 C32 4 34 22 48 28 C34 34 32 52 32 52 C32 52 30 34 16 28 C30 22 32 4 32 4Z" fill="currentColor" />
    <path d="M56 12 C56 12 57.5 20 63 22.5 C57.5 25 56 33 56 33 C56 33 54.5 25 49 22.5 C54.5 20 56 12 56 12Z" fill="currentColor" opacity="0.55" />
  </svg>
)

const WaveIcon = () => (
  <svg width="62" height="44" viewBox="0 0 64 48" fill="none">
    <path d="M4 12 C10 4 18 4 24 12 C30 20 38 20 44 12 C50 4 58 4 62 10"
      stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    <path d="M4 28 C10 20 18 20 24 28 C30 36 38 36 44 28 C50 20 58 20 62 26"
      stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.55" />
    <path d="M4 42 C10 34 18 34 24 42 C30 50 38 50 44 42 C50 34 58 34 62 40"
      stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.28" />
  </svg>
)

const BarsIcon = () => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
    <rect x="4"  y="44" width="12" height="16" rx="3" fill="currentColor" opacity="0.4" />
    <rect x="20" y="32" width="12" height="28" rx="3" fill="currentColor" opacity="0.6" />
    <rect x="36" y="20" width="12" height="40" rx="3" fill="currentColor" opacity="0.8" />
    <rect x="52" y="8"  width="12" height="52" rx="3" fill="currentColor" />
  </svg>
)

const values = [
  {
    num: "01",
    title: "Start with strategy, not just content",
    text: "We don't create content just to stay active. Every piece should have a clear purpose, support your positioning, and help move people toward action.",
    accent: "#61baf7",
  },
  {
    num: "02",
    title: "Creative should drive results",
    text: "Good design matters but results matter more. We create work that not only looks right but also helps improve engagement, clicks, and conversions.",
    accent: "#a855f7",
  },
  {
    num: "03",
    title: "Consistency builds real growth",
    text: "Growth doesn't come from one good campaign. It comes from doing the right things again and again with clear direction and steady improvement.",
    accent: "#49d7a4",
  },
]

export default function AboutClient({ countryCode, children }: { countryCode: string; children?: React.ReactNode }) {
  const prefersReduced = useReducedMotion()
  const doodleContainerRef = useRef<HTMLDivElement>(null)
  const [doodleState, setDoodleState] = useState<ScrollState>("idle")

  useEffect(() => {
    const el = doodleContainerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setDoodleState("visible")
        else setDoodleState((prev) => (prev === "idle" ? "idle" : "resting"))
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <main className="bg-[#f3f4f6]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-white pt-14 pb-18 lg:pt-18 lg:pb-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[6%] top-[10%] h-[140px] w-[420px] rounded-full bg-[#f4f4f6] blur-3xl" />
          <div className="absolute right-[8%] top-[18%] h-[160px] w-[360px] rounded-full bg-[#f6f6f8] blur-3xl" />
          <div className="absolute left-[20%] bottom-[6%] h-[120px] w-[420px] rounded-full bg-[#f5f5f7] blur-3xl" />
        </div>

        <div className="content-container relative px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1320px] lg:grid lg:grid-cols-[1fr_420px] lg:items-center lg:gap-10">

            {/* LEFT */}
            <div>
              <motion.p
                className={`${mansalva.className} mb-4 text-[20px] font-bold leading-none text-[#e61e73]`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              >
                About Us
              </motion.p>

              <motion.h1
                className={`${epilogue.className} max-w-[680px] text-[36px] font-extrabold leading-[1.0] tracking-[-0.05em] text-[#0e2547] sm:text-[46px] lg:text-[56px]`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              >
                We help D2C brands
                <br />
                <span className="relative inline-block">
                  grow with purpose.
                  <motion.span
                    className="absolute bottom-[6px] left-0 -z-10 h-[12px] bg-[#ef6a99]"
                    initial={{ width: "0%" }}
                    animate={{ width: "55%" }}
                    transition={{ duration: 0.65, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                  />
                </span>
              </motion.h1>

              <motion.p
                className={`${outfit.className} mt-6 max-w-[620px] text-[16px] leading-[1.95] text-slate-600 lg:text-[17px]`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
              >
                We help D2C brands grow with clear strategy, better content, and
                performance-driven execution that focuses on real business results.
                At Mommantum, we work with D2C brands to improve what directly
                impacts growth — how your brand is positioned, how your marketing
                performs, and how your website converts.
              </motion.p>

              <motion.p
                className={`${outfit.className} mt-4 max-w-[620px] text-[16px] leading-[1.95] text-slate-600 lg:text-[17px]`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.28, ease: [0.16, 1, 0.3, 1] as const }}
              >
                Our approach is simple — remove confusion, improve user experience,
                and focus on actions that lead to better results.
              </motion.p>

              <motion.div
                className="mt-9 flex flex-wrap items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
              >
                <style>{`
                  .btn-primary {
                    display:inline-flex; height:52px; align-items:center; justify-content:center;
                    border-radius:14px; background:#0e2547; padding:0 28px;
                    font-size:14px; font-weight:800; letter-spacing:0.02em;
                    text-transform:uppercase; color:#fff; text-decoration:none;
                    transition:transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
                  }
                  .btn-primary:hover { background:#1a3a6b; transform:translateY(-2px); box-shadow:0 8px 24px rgba(14,37,71,0.25); }
                  .btn-primary:active { transform:translateY(0); }
                  .btn-oval {
                    position:relative; display:inline-flex; height:52px; align-items:center;
                    justify-content:center; padding:0 8px; font-size:14px; font-weight:800;
                    letter-spacing:0.02em; text-transform:uppercase; color:#0e2547; text-decoration:none;
                  }
                  .btn-oval .oval-ring {
                    position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
                    width:112px; height:44px; border-radius:999px; border:3.5px solid #4ad79f;
                    transition:width 0.25s ease, height 0.25s ease, opacity 0.25s ease;
                  }
                  .btn-oval:hover .oval-ring { width:126px; height:52px; opacity:0.7; }
                  .btn-oval span.label { position:relative; z-index:1; }
                `}</style>

                <LocalizedClientLink href="/work" className="btn-primary">
                  See Our Work
                  <span className="ml-2 text-[20px] leading-none">›</span>
                </LocalizedClientLink>

                <LocalizedClientLink href="/contact" className="btn-oval">
                  <span className="label">Let&apos;s Talk</span>
                  <span className="oval-ring" />
                </LocalizedClientLink>
              </motion.div>
            </div>

            {/* RIGHT — hidden on mobile, visible on desktop */}
            <div
              ref={doodleContainerRef}
              className="relative mx-auto hidden w-full max-w-[420px] lg:block"
              style={{ padding: "32px 24px 24px" }}
            >
              <div
                className="relative w-full overflow-hidden"
                style={{
                  borderRadius: "28%",
                  aspectRatio: "1 / 1.08",
                  background: "linear-gradient(135deg, #c026d3 0%, #9333ea 50%, #a855f7 100%)",
                  boxShadow: "0 24px 80px rgba(147,51,234,0.30)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ background: "radial-gradient(ellipse at 50% 120%, #fff 0%, transparent 70%)" }}
                />
                <Image
                  src="/about/about-hero.png"
                  alt="About Mommantum"
                  fill
                  className="object-cover object-top"
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 100vw, 420px"
                />
              </div>

              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  margin: "32px 24px 24px",
                  borderRadius: "28%",
                  border: "3px solid rgba(215,215,230,0.65)",
                }}
              />

              {/* Crown */}
              <motion.div
                className="absolute left-1/2 top-0 z-10 text-[#9333ea]"
                style={{ translateX: "-50%" }}
                animate={
                  doodleState === "visible"
                    ? { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const } }
                    : doodleState === "resting"
                    ? { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } }
                    : { opacity: 0, y: -16, scale: 0.7, transition: { duration: 0 } }
                }
              >
                <motion.div
                  animate={doodleState !== "idle" && !prefersReduced ? { y: [0, -6, 0] } : {}}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CrownIcon />
                </motion.div>
              </motion.div>

              {/* Sparkle */}
              <motion.div
                className="absolute right-0 top-[18%] z-10 text-green-400"
                animate={
                  doodleState === "visible"
                    ? { opacity: 1, x: 0, scale: 1, transition: { duration: 0.45, delay: 0.32, ease: [0.16, 1, 0.3, 1] as const } }
                    : doodleState === "resting"
                    ? { opacity: 1, x: 0, scale: 1, transition: { duration: 0 } }
                    : { opacity: 0, x: 14, scale: 0.7, transition: { duration: 0 } }
                }
                whileHover={prefersReduced ? {} : { scale: 1.2, rotate: 15, transition: { duration: 0.2 } }}
              >
                <SparkleIcon />
              </motion.div>

              {/* Wave */}
              <motion.div
                className="absolute left-0 top-[44%] z-10 text-violet-400"
                animate={
                  doodleState === "visible"
                    ? { opacity: 1, x: 0, scale: 1, transition: { duration: 0.45, delay: 0.44, ease: [0.16, 1, 0.3, 1] as const } }
                    : doodleState === "resting"
                    ? { opacity: 1, x: 0, scale: 1, transition: { duration: 0 } }
                    : { opacity: 0, x: -14, scale: 0.8, transition: { duration: 0 } }
                }
                whileHover={prefersReduced ? {} : { scale: 1.12, rotate: 8, transition: { duration: 0.2 } }}
              >
                <WaveIcon />
              </motion.div>

              {/* Bars */}
              <motion.div
                className="absolute right-0 bottom-[18%] z-10 text-sky-400"
                animate={
                  doodleState === "visible"
                    ? { opacity: 1, x: 0, scale: 1, transition: { duration: 0.45, delay: 0.56, ease: [0.16, 1, 0.3, 1] as const } }
                    : doodleState === "resting"
                    ? { opacity: 1, x: 0, scale: 1, transition: { duration: 0 } }
                    : { opacity: 0, x: 14, scale: 0.7, transition: { duration: 0 } }
                }
                whileHover={prefersReduced ? {} : { scale: 1.12, rotate: -8, transition: { duration: 0.2 } }}
              >
                <BarsIcon />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOUNDER / STORY ── */}
      <section className="relative overflow-hidden bg-[#f3f4f6] py-16 lg:py-20">
        <div className="content-container px-4 sm:px-6 lg:px-10">
          <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[380px_1fr] lg:items-start">

            <Reveal offset={40} amount={0.2}>
              <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_22px_55px_rgba(0,0,0,0.08)]">
                <div className="relative aspect-[4/5] w-full bg-[#eef0f2]">
                  <Image
                    src="/team/kuldeep.webp"
                    alt="Kuldeep Ahir"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 380px"
                  />
                </div>
                <div className="px-6 py-5">
                  <p className={`${epilogue.className} text-[18px] font-extrabold tracking-[-0.03em] text-[#0e2547]`}>
                    Kuldeep Ahir
                  </p>
                  <p className={`${outfit.className} mt-1 text-[14px] font-medium text-[#e61e73]`}>
                    Founder & Creative Director
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12} offset={40} amount={0.15}>
              <div className="rounded-[24px] bg-white p-8 shadow-[0_22px_55px_rgba(0,0,0,0.08)] lg:p-12">
                <p className={`${mansalva.className} text-[22px] font-bold leading-none text-[#ef3a6b]`}>
                  Founder story
                </p>
                <h2 className={`${epilogue.className} mt-4 text-[30px] font-extrabold leading-[1.0] tracking-[-0.05em] text-[#0e2547] lg:text-[42px]`}>
                  The team behind your growth
                </h2>
                <div className="mt-5 h-[4px] w-[52px] rounded-full bg-[#e61e73]" />

                {/* ── Updated founder story ── */}
                <p className={`${outfit.className} mt-6 max-w-[820px] text-[16px] leading-[1.95] text-slate-600 lg:text-[17px]`}>
                  Hi, I&apos;m Kuldeep Ahir, founder of Mommantum. For me, business has always
                  been about solving problems. Over the last 5 years, I&apos;ve worked closely
                  with startups and D2C brands, helping them grow through better marketing,
                  stronger systems, and smarter execution. From scaling my own ventures to
                  contributing to the growth of other brands, I&apos;ve spent years understanding
                  what actually drives business growth in competitive markets.
                </p>
                <p className={`${outfit.className} mt-4 max-w-[820px] text-[16px] leading-[1.95] text-slate-600 lg:text-[17px]`}>
                  I&apos;m deeply passionate about marketing because I believe it&apos;s one of the
                  biggest growth levers for any startup or business. The reality is, many
                  founders have great products but struggle to stand out, acquire customers
                  consistently, or scale profitably. That&apos;s where I come in.
                </p>
                <p className={`${outfit.className} mt-4 max-w-[820px] text-[16px] leading-[1.95] text-slate-600 lg:text-[17px]`}>
                  At Mommantum, we focus on building growth systems through performance
                  marketing, SEO, AI automations, and conversion-focused strategies that
                  help brands grow with clarity and direction. I&apos;m constantly learning,
                  experimenting, and working hands-on every day because growth never stops
                  evolving.
                </p>

                <div className="mt-8 rounded-[14px] border-l-[4px] border-[#9333ea] bg-[#f5eeff] px-6 py-4">
                  <p className={`${outfit.className} text-[15px] leading-[1.85] text-[#4c1d95]`}>
                    &ldquo;For me, it&apos;s not just about running campaigns or building strategies.
                    It&apos;s about helping founders win.&rdquo;
                  </p>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[10%] top-[15%] h-[120px] w-[300px] rounded-full bg-[#f5f5f7] blur-3xl" />
          <div className="absolute right-[10%] bottom-[12%] h-[140px] w-[340px] rounded-full bg-[#f6f6f8] blur-3xl" />
        </div>

        <div className="content-container relative px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1320px]">
            <Reveal offset={28} amount={0.3}>
              <div className="max-w-[680px]">
                <p className={`${mansalva.className} mb-3 text-[20px] font-bold text-[#ef3a6b]`}>
                  What we believe
                </p>
                <h2 className={`${epilogue.className} text-[30px] font-extrabold leading-[1.05] tracking-[-0.05em] text-[#0e2547] lg:text-[44px]`}>
                  Growth comes from clarity, consistent effort and systems that actually support your business.
                </h2>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {values.map((v, i) => (
                <Reveal key={v.num} delay={i * 0.1} offset={32} amount={0.2}>
                  <motion.div
                    className="h-full rounded-[20px] bg-[#f3f4f6] p-7"
                    style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.04)" }}
                    whileHover={prefersReduced ? {} : {
                      y: -6,
                      boxShadow: "0 20px 44px rgba(0,0,0,0.08)",
                      transition: { duration: 0.22 },
                    }}
                  >
                    <div
                      className={`${epilogue.className} text-[30px] font-extrabold`}
                      style={{ color: v.accent }}
                    >
                      {v.num}
                    </div>
                    <h3 className={`${epilogue.className} mt-4 text-[20px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#0e2547]`}>
                      {v.title}
                    </h3>
                    <p className={`${outfit.className} mt-3 text-[14px] leading-[1.85] text-slate-600`}>
                      {v.text}
                    </p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS + CASE STUDIES ── */}
      <StatsStrip />
      {children}

      {/* ── FINAL CTA ── */}
      <section className="relative overflow-hidden bg-[#0e2547] py-16 lg:py-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[18%] h-[140px] w-[420px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="content-container relative px-4 sm:px-6 lg:px-10">
          <Reveal offset={32} amount={0.4}>
            <div className="mx-auto max-w-[820px] text-center">
              <p className={`${mansalva.className} mb-4 text-[20px] font-bold text-[#ef6a99]`}>
                Let&apos;s build together
              </p>
              <h2 className={`${epilogue.className} text-[32px] font-extrabold leading-[1.05] tracking-[-0.05em] text-white lg:text-[52px]`}>
                Let&apos;s build your growth system
              </h2>
              <p className={`${outfit.className} mx-auto mt-5 max-w-[620px] text-[16px] leading-[1.9] text-white/70`}>
                Strategy, creative, and performance should work together. That is where real growth starts.
              </p>
              <div className="mt-8">
                <style>{`
                  .btn-cta {
                    display:inline-flex; height:52px; align-items:center; justify-content:center;
                    border-radius:14px; background:#ef3a6b; padding:0 32px;
                    font-size:14px; font-weight:800; letter-spacing:0.02em;
                    text-transform:uppercase; color:#fff; text-decoration:none;
                    transition:background 0.2s ease, transform 0.22s ease, box-shadow 0.22s ease;
                  }
                  .btn-cta:hover { background:#d92d5d; transform:translateY(-2px); box-shadow:0 8px 28px rgba(239,58,107,0.4); }
                  .btn-cta:active { transform:translateY(0); }
                `}</style>
                <LocalizedClientLink href="/contact" className="btn-cta">
                  Let&apos;s Talk
                  <span className="ml-2 text-[20px] leading-none">›</span>
                </LocalizedClientLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  )
}