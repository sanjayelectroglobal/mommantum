"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion, type Variants } from "motion/react"
import type { CaseStudy } from "@lib/data/case-studies"
import { epilogue, outfit, mansalva } from "@lib/fonts"

const headingVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const fadeUpVariants: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 44, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}
const dotsContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}
const dotVariants: Variants = {
  hidden:  { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } },
}

const MotionArticle = motion.create("article" as never) as typeof motion.div

const ACCENTS = [
  { accent: "#e61e73", pillBg: "#fff0f6", pillHoverBg: "#ffe0ef", pillBorder: "#fbb6d4" },
  { accent: "#9333ea", pillBg: "#f5eeff", pillHoverBg: "#ede0ff", pillBorder: "#d8b4fe" },
  { accent: "#0ea5e9", pillBg: "#e8f6ff", pillHoverBg: "#d0edff", pillBorder: "#7dd3fc" },
]

type Props = {
  countryCode: string
  caseStudies: CaseStudy[]
}

export default function CaseStudiesClient({ countryCode, caseStudies }: Props) {
  const prefersReduced = useReducedMotion()
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <section className="relative overflow-hidden bg-[#f3f4f6] py-16 lg:py-24">
      <style>{`
        .cs-card {
          position: relative; background: #fff; border-radius: 20px;
          overflow: hidden; display: flex; flex-direction: column;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .cs-card::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0;
          height: 4px; border-radius: 20px 20px 0 0;
          background: var(--card-accent); opacity: 0;
          transition: opacity 0.25s ease; z-index: 10;
        }
        .cs-card.is-hovered::before { opacity: 1; }
        .cs-img-zone {
          position: relative; overflow: hidden; aspect-ratio: 16 / 10;
          background: #f0f0f0; flex-shrink: 0; display: block;
        }
        .cs-img-zone img { transition: transform 0.6s ease !important; }
        .cs-card.is-hovered .cs-img-zone img { transform: scale(1.05) !important; }
        .cs-pill {
          display: inline-flex; align-items: center; padding: 4px 12px;
          border-radius: 999px; font-size: 12px; font-weight: 700;
          background: var(--pill-bg); color: var(--card-accent);
          border: 1.5px solid var(--pill-border);
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .cs-card.is-hovered .cs-pill { background: var(--pill-hover-bg); border-color: var(--card-accent); }
        .cs-content { padding: 20px 22px 26px; display: flex; flex-direction: column; flex: 1; }
        .cs-divider { height: 1px; background: #f0f0f0; margin: 14px 0; }
        .cs-results-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: #94a3b8; margin-bottom: 10px;
        }
        .cs-view-link {
          display: inline-flex; align-items: center; gap: 6px; font-size: 12px;
          font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase;
          text-decoration: none; color: var(--card-accent);
          margin-top: auto; padding-top: 16px; transition: opacity 0.2s ease;
        }
        .cs-view-link:hover { opacity: 0.7; }
        .cs-view-link .link-arrow { display: inline-block; transition: transform 0.2s ease; }
        .cs-view-link:hover .link-arrow { transform: translateX(5px); }
        .cs-title-link { text-decoration: none; color: #0e2547; transition: color 0.2s ease; }
        .cs-card.is-hovered .cs-title-link { color: var(--card-accent); }
        .cs-doodle { position: absolute; top: -4px; right: 14px; z-index: 20; pointer-events: none; }
      `}</style>

      {/* BG blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[4%] top-[8%] h-[140px] w-[420px] rounded-full bg-white/50 blur-3xl" />
        <div className="absolute right-[6%] top-[12%] h-[160px] w-[360px] rounded-full bg-white/40 blur-3xl" />
        <div className="absolute left-[16%] bottom-[10%] h-[120px] w-[460px] rounded-full bg-white/40 blur-3xl" />
        <div className="absolute right-[12%] bottom-[20%] h-[130px] w-[380px] rounded-full bg-white/35 blur-3xl" />
      </div>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px]">

          {/* Heading */}
          <motion.div
            className="max-w-[560px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={headingVariants}
          >
            <motion.p
              className={`${mansalva.className} mb-5 text-[22px] font-bold leading-none text-[#e61e73]`}
              variants={fadeUpVariants}
            >
              Case Studies
            </motion.p>

            <motion.h2
              className={`${epilogue.className} text-[38px] font-extrabold leading-[0.95] tracking-[-0.065em] text-[#0e2547] sm:text-[52px] lg:text-[68px]`}
              variants={fadeUpVariants}
            >
              <span className="relative inline-block">
                Real brands. Real growth.
                <motion.span
                  className="absolute bottom-[8px] left-0 -z-10 h-[14px] bg-[#ef6a99]"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "68%" }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                />
              </span>
            </motion.h2>
          </motion.div>

          {/* Cards */}
          <motion.div
            className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            variants={gridVariants}
          >
            {caseStudies.map((item, idx) => {
              const theme = ACCENTS[idx % ACCENTS.length]
              const isHovered = hoveredIdx === idx

              return (
                <MotionArticle
                  key={item.slug}
                  className={`cs-card${isHovered ? " is-hovered" : ""}`}
                  style={{
                    "--card-accent":   theme.accent,
                    "--pill-bg":       theme.pillBg,
                    "--pill-hover-bg": theme.pillHoverBg,
                    "--pill-border":   theme.pillBorder,
                    border: `1.5px solid ${isHovered ? theme.accent : "#ebebeb"}`,
                    boxShadow: isHovered
                      ? "0 24px 60px rgba(0,0,0,0.12)"
                      : "0 4px 16px rgba(0,0,0,0.04)",
                  } as React.CSSProperties}
                  variants={cardVariants}
                  whileHover={prefersReduced ? {} : {
                    y: -8,
                    transition: { duration: 0.22, ease: "easeOut" },
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
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
                    />
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%]"
                      style={{ background: "linear-gradient(to top, rgba(14,37,71,0.4) 0%, transparent 100%)" }}
                    />
                    <motion.div
                      className="cs-doodle"
                      initial={{ opacity: 0, y: -12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.45, delay: 0.1 + idx * 0.07, ease: [0.16, 1, 0.3, 1] as const }}
                    >
                      <svg width="52" height="36" viewBox="0 0 82 54" fill="none">
                        <path
                          d="M8 44C14 20 14 8 14 2M24 46C30 24 30 11 30 4M40 48C46 26 46 13 46 6M56 48C62 28 62 16 62 10M72 46C76 30 76 20 76 14"
                          stroke={theme.accent} strokeWidth="4" strokeLinecap="round"
                        />
                      </svg>
                    </motion.div>
                  </Link>

                  {/* Content */}
                  <div className="cs-content">
                    <div className="mb-3">
                      <span className={`${outfit.className} cs-pill`}>{item.category}</span>
                    </div>

                    <h3 className={`${epilogue.className} text-[22px] font-extrabold leading-[1.1] tracking-[-0.04em] lg:text-[26px]`}>
                      <Link
                        href={`/work/${item.slug}`}
                        className="cs-title-link"
                      >
                        {item.title}
                      </Link>
                    </h3>

                    {item.about && (
                      <p className={`${outfit.className} mt-2 text-[13px] leading-[1.75] text-slate-500`}>
                        {item.about}
                      </p>
                    )}

                    <div className="cs-divider" />

                    <p className={`${epilogue.className} cs-results-label`}>Results</p>

                    <motion.ul
                      className="space-y-2"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.4 }}
                      variants={dotsContainerVariants}
                    >
                      {item.results.slice(0, 3).map((result) => (
                        <motion.li
                          key={result}
                          className={`${outfit.className} flex items-start gap-2.5 text-[13px] leading-[1.65] text-slate-600`}
                          variants={dotVariants}
                        >
                          <span
                            className="mt-[6px] h-[6px] w-[6px] flex-shrink-0 rounded-full"
                            style={{ background: theme.accent, opacity: 0.7 }}
                          />
                          <span>{result}</span>
                        </motion.li>
                      ))}
                    </motion.ul>

                    <Link
                      href={`/work/${item.slug}`}
                      className={`${epilogue.className} cs-view-link`}
                    >
                      View Case Study
                      <span className="link-arrow">→</span>
                    </Link>
                  </div>
                </MotionArticle>
              )
            })}
          </motion.div>

          {/* View all CTA */}
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/work"
              className={`${epilogue.className} inline-flex h-[48px] items-center justify-center rounded-[14px] border-2 border-[#0e2547] px-8 text-[13px] font-extrabold uppercase tracking-[0.04em] text-[#0e2547] transition-all hover:bg-[#0e2547] hover:text-white`}
            >
              View All Case Studies →
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  )
}