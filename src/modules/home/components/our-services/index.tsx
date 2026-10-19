"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { epilogue, outfit } from "@lib/fonts"

function ScrollReveal({
  children, delay = 0, offset = 36, amount = 0.2, className = "",
}: {
  children: React.ReactNode
  delay?: number
  offset?: number
  amount?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<"idle" | "visible" | "resting">("idle")

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

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={
        state === "visible"
          ? { opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] } }
          : state === "resting"
          ? { opacity: 1, y: 0, transition: { duration: 0 } }
          : { opacity: 0, y: offset, transition: { duration: 0 } }
      }
      style={state === "idle" ? { opacity: 0 } : undefined}
    >
      {children}
    </motion.div>
  )
}

const services = [
  {
    label: "Marketing",
    title: "Performance Marketing",
    description:
      "We run ad campaigns that bring the right audience, improve how they interact with the brand, and turn them into customers — so your ad spend leads to better conversions, lower cost, and consistent growth.",
    points: [
      "Meta Ads",
      "Google Ads",
      "Funnel setup",
      "Retargeting",
      "Creative testing",
    ],
    href: "/services/performance-marketing",
    accent: "#e61e73",
    accentLight: "#fff0f6",
    accentHover: "#fce7f3",
    accentBorder: "#fbb6d4",
  },
  {
    label: "Web",
    title: "Web & App Development",
    description:
      "We build fast, easy-to-use websites and apps that help users understand your product, build trust, and take action — so your visitors can move smoothly from landing to purchase without confusion and distraction.",
    points: [
      "Website development",
      "App development",
      "Ecommerce website",
      "Performance optimization",
      
    ],
    href: "/services/web-app-development",
    accent: "#9333ea",
    accentLight: "#f5eeff",
    accentHover: "#e9d5ff",
    accentBorder: "#d8b4fe",
  },
  {
    label: "Automation",
    title: "AI Automation",
    description:
      "We set up systems that handle repetitive tasks, improve response time, and keep your operations running smoothly — so your team can focus on important work while everything else runs faster and more efficiently.",
    points: [
      "Workflow automation",
      "Task automation",
      "Chat automation",
      "System integration",
      
    ],
    href: "/services/ai-automation",
    accent: "#0ea5e9",
    accentLight: "#e8f6ff",
    accentHover: "#c8e8f8",
    accentBorder: "#7dd3fc",
  },
]

export default function OurServices() {
  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-20">
      <style>{`
        .service-card::before {
          content: ""; position: absolute; left: 0; top: 16px; bottom: 16px;
          width: 4px; border-radius: 0 3px 3px 0;
          background: var(--card-accent);
          opacity: 1;
          transform: scaleY(0.18);
          transform-origin: center;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .service-card:hover::before { transform: scaleY(1); }
        .service-card-inner {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        .service-card:hover .service-card-inner {
          transform: scale(1.025) translateY(-2px);
        }
        .btn-learn {
          position: relative; display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 800;
          letter-spacing: 0.03em; text-transform: uppercase; text-decoration: none;
          color: var(--btn-accent); border: 2px solid var(--btn-border);
          background: transparent; overflow: hidden; cursor: pointer; font-family: inherit;
          transition: color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
        }
        .btn-learn::before {
          content: ""; position: absolute; inset: 0;
          background: var(--btn-accent); transform: translateX(-101%);
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); z-index: 0;
        }
        .btn-learn:hover::before { transform: translateX(0); }
        .btn-learn:hover { color: #fff; box-shadow: 0 6px 20px rgba(15,23,42,0.14); transform: translateY(-2px); }
        .btn-learn:active { transform: translateY(0); }
        .btn-learn .lbl, .btn-learn .arrow-txt { position: relative; z-index: 1; }
        .btn-learn .arrow-txt { display: inline-block; transition: transform 0.22s ease; }
        .btn-learn:hover .arrow-txt { transform: translateX(4px); }
        .skill-chip {
          display: inline-flex; align-items: center; border-radius: 10px;
          padding: 6px 12px; font-size: 13px; font-weight: 500; line-height: 1.5;
          cursor: default; transition: background 0.2s ease, border-color 0.2s ease,
          color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .skill-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(15,23,42,0.1);
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[8%] h-[110px] w-[560px] -translate-x-1/2 rounded-[999px] bg-[#f3f4f6] opacity-90 blur-2xl" />
        <div className="absolute left-1/2 top-[11%] h-[90px] w-[430px] -translate-x-1/2 rounded-[999px] bg-[#f5f5f5] opacity-90 blur-2xl" />
        <div className="absolute right-[8%] top-[43%] h-[250px] w-[250px] rounded-full bg-[#f4f4f4] opacity-70 blur-2xl" />
        <div className="absolute bottom-[12%] left-[22%] h-[110px] w-[420px] rounded-[999px] bg-[#f7f7f7] opacity-60 blur-2xl" />
      </div>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[980px] text-center">

          <motion.div
            className="mb-3 flex items-center justify-center gap-1.5 text-[22px] text-[#f5c400] lg:text-[28px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {["★","★","★","★","★"].map((s, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
              >
                {s}
              </motion.span>
            ))}
          </motion.div>

          <h2 className={`${epilogue.className} text-[34px] font-extrabold tracking-[-0.06em] text-[#0e2547] sm:text-[42px] lg:text-[64px]`}>
            <span className="relative inline-block leading-none">
              Our Services
              <UnderlineReveal />
            </span>
          </h2>

          <ScrollReveal delay={0.2} offset={16} amount={0.5}>
            <p className={`${outfit.className} mx-auto mt-5 max-w-[680px] text-[16px] leading-[1.85] text-slate-600 lg:text-[17px]`}>
              Everything your D2C brand needs to grow predictably and profitably.
            </p>
          </ScrollReveal>
        </div>

        <div className="mx-auto mt-16 grid max-w-[1320px] gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.1} offset={40} amount={0.2}>
              <motion.div
                className="service-card relative overflow-hidden rounded-[20px] p-8 h-full"
                style={{
                  border: `1.5px solid ${service.accentBorder}`,
                  background: "#fff",
                  "--card-accent": service.accent,
                  "--btn-accent": service.accent,
                  "--btn-border": service.accentBorder,
                } as React.CSSProperties}
                whileHover={{
                  y: -6,
                  boxShadow: `0 20px 48px rgba(15,23,42,0.11), 0 0 0 1.5px ${service.accent}`,
                  borderColor: service.accent,
                  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                }}
              >
                <div className="service-card-inner">
                  <p
                    className={`${outfit.className} mb-4 text-[22px] font-bold leading-none`}
                    style={{ color: service.accent }}
                  >
                    {service.label}
                  </p>
                  <h3 className={`${epilogue.className} max-w-[390px] text-[26px] font-extrabold leading-[1.08] tracking-[-0.05em] text-[#0e2547] lg:text-[30px]`}>
                    {service.title}
                  </h3>
                  <p className={`${outfit.className} mt-4 max-w-[400px] text-[14px] leading-[1.85] text-slate-600 lg:text-[15px]`}>
                    {service.description}
                  </p>

                  <div className="mt-5 flex max-w-[420px] flex-wrap gap-2.5">
                    {service.points.map((point, pi) => (
                      <LocalizedClientLink
                        key={point}
                        href={service.href}
                        className="inline-flex"
                      >
                        <motion.span
                          className={`${outfit.className} skill-chip cursor-pointer`}
                          style={{
                            border: `1.5px solid ${service.accentBorder}`,
                            background: service.accentLight,
                            color: service.accent,
                          }}
                          initial={{ opacity: 0, scale: 0.88 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: false, amount: 0.5 }}
                          transition={{ delay: pi * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                          whileHover={{
                            y: -3, scale: 1.06,
                            backgroundColor: service.accentHover,
                            borderColor: service.accent,
                            boxShadow: "0 4px 14px rgba(15,23,42,0.1)",
                            transition: { duration: 0.15 },
                          }}
                        >
                          {point}
                        </motion.span>
                      </LocalizedClientLink>
                    ))}
                  </div>

                  <LocalizedClientLink href={service.href} className="btn-learn mt-8">
                    <span className="lbl">Learn More</span>
                    <span className="arrow-txt">→</span>
                  </LocalizedClientLink>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function UnderlineReveal() {
  const ref = useRef<HTMLSpanElement>(null)
  const [state, setState] = useState<"idle" | "visible" | "resting">("idle")

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

  return (
    <motion.span
      ref={ref}
      className="absolute bottom-[6px] left-1/2 -z-10 h-[14px] -translate-x-1/2"
      style={{ background: "#99dcf8", borderRadius: 2 }}
      animate={
        state === "visible"
          ? { width: "62%", transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
          : state === "resting"
          ? { width: "62%", transition: { duration: 0 } }
          : { width: "0%", transition: { duration: 0 } }
      }
    />
  )
}