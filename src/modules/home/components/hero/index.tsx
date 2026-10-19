"use client"

import Image from "next/image"
import Link from "next/link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useEffect, useMemo, useState } from "react"
import { epilogue, mansalva, outfit } from "@lib/fonts"

const words = ["faster,", "predictable,", "profitable"]

const CrownIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 56" fill="none">
    <path d="M6 48 L18 16 L34 32 L40 8 L46 32 L62 16 L74 48 Z"
      fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinejoin="round" strokeLinecap="round" />
    <rect x="6" y="49" width="68" height="6" rx="3"
      fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="40" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="18" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="62" cy="16" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <path d="M32 4 C32 4 34 22 48 28 C34 34 32 52 32 52 C32 52 30 34 16 28 C30 22 32 4 32 4Z"
      fill="currentColor" />
    <path d="M56 12 C56 12 57.5 20 63 22.5 C57.5 25 56 33 56 33 C56 33 54.5 25 49 22.5 C54.5 20 56 12 56 12Z"
      fill="currentColor" opacity="0.6" />
  </svg>
)

const SquiggleArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 64" fill="none">
    <path d="M8 48 C16 48 16 20 28 20 C40 20 40 44 52 44 C60 44 64 36 68 28"
      stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M60 18 L68 28 L76 18"
      stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const BarsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <rect x="4"  y="44" width="12" height="16" rx="3" fill="currentColor" opacity="0.45" />
    <rect x="20" y="32" width="12" height="28" rx="3" fill="currentColor" opacity="0.65" />
    <rect x="36" y="20" width="12" height="40" rx="3" fill="currentColor" opacity="0.85" />
    <rect x="52" y="8"  width="12" height="52" rx="3" fill="currentColor" />
    <circle cx="58" cy="5" r="3" fill="currentColor" opacity="0.5" />
  </svg>
)

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState(words[0])
  const [isDeleting, setIsDeleting] = useState(false)
  const currentWord = useMemo(() => words[wordIndex], [wordIndex])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (!isDeleting && displayedText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), 1200)
    } else if (isDeleting && displayedText === "") {
      setIsDeleting(false)
      setWordIndex((prev) => (prev + 1) % words.length)
    } else {
      timeout = setTimeout(() => {
        const nextText = isDeleting
          ? currentWord.slice(0, displayedText.length - 1)
          : currentWord.slice(0, displayedText.length + 1)
        setDisplayedText(nextText)
      }, isDeleting ? 55 : 90)
    }
    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, currentWord])

  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-14 lg:pt-14 lg:pb-20">
      <style>{`
        .scribble {
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .scribble:hover {
          transform: scale(1.15) rotate(8deg);
          opacity: 0.75;
        }
        @keyframes bob {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50%       { transform: translateX(-50%) translateY(-7px); }
        }
        .crown-bob {
          animation: bob 2.8s ease-in-out infinite;
        }
        .btn-get-started {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 36px;
          border-radius: 14px;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #fff;
          text-decoration: none;
          background: linear-gradient(135deg, #9333ea 0%, #c026d3 55%, #e11d78 100%);
          box-shadow: 0 4px 20px rgba(147, 51, 234, 0.35);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          overflow: hidden;
        }
        .btn-get-started::before {
          content: "";
          position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }
        .btn-get-started:hover::before { transform: translateX(100%); }
        .btn-get-started:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 28px rgba(192, 38, 211, 0.45);
        }
        .btn-get-started .arrow {
          display: inline-block;
          transition: transform 0.22s ease;
        }
        .btn-get-started:hover .arrow { transform: translateX(5px); }
      `}</style>

      {/* RESPONSIVE LAYOUT */}
      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">

            {/* VISUAL COLUMN */}
            <div className="relative flex justify-start order-2 lg:order-1">
              <div className="relative w-full max-w-[720px]">
                {/* BG blobs */}
                <div className="absolute left-1/2 lg:left-[8%] top-[10%] lg:top-[14%] -translate-x-1/2 lg:translate-x-0 h-[220px] lg:h-[74%] w-[220px] lg:w-[78%] rounded-[28%] bg-slate-200/35" />
                <div
                  className="absolute left-1/2 lg:left-[13%] top-[14%] lg:top-[18%] -translate-x-1/2 lg:translate-x-0 h-[200px] lg:h-[68%] w-[200px] lg:w-[72%] rounded-[24%]"
                  style={{ background: "linear-gradient(135deg, #c026d3 0%, #9333ea 45%, #a855f7 100%)" }}
                />
                <div className="absolute left-1/2 lg:left-[12%] top-[13%] lg:top-[17%] -translate-x-1/2 lg:translate-x-0 h-[205px] lg:h-[70%] w-[205px] lg:w-[74%] rounded-[24%] border-[3px] border-[#d7d7e6]/70" />
                
                <div className="relative z-10 flex justify-center pt-2">
                  <Image
                    src="/hero-girl.png"
                    alt="Performance marketing agency"
                    width={700}
                    height={880}
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 280px, 620px"
                    className="h-auto w-[68%] lg:w-[95%] max-w-[280px] lg:max-w-[620px] object-contain"
                  />
                </div>

                <div
                  className="crown-bob absolute left-1/2 lg:left-[50%] top-[2%] lg:top-[3%] z-20 w-[44px] lg:w-[72px] drop-shadow-md text-[#9333ea] -translate-x-1/2"
                >
                  <CrownIcon />
                </div>
                <div className="scribble absolute right-[8%] top-[16%] lg:top-[12%] z-20 w-[28px] lg:w-[50px] text-rose-400 drop-shadow">
                  <SparkleIcon />
                </div>
                <div className="scribble absolute left-[6%] lg:left-[0%] top-[45%] lg:top-[48%] z-20 w-[40px] lg:w-[66px] text-violet-400 drop-shadow">
                  <SquiggleArrowIcon />
                </div>
                <div className="scribble absolute bottom-[10%] lg:bottom-[14%] right-[6%] lg:right-[3%] z-20 w-[28px] lg:w-[54px] text-sky-400 drop-shadow">
                  <BarsIcon />
                </div>
              </div>
            </div>

            {/* CONTENT COLUMN */}
            <div className="max-w-[760px] text-center lg:text-left px-5 lg:px-0 pb-8 lg:pb-0 order-1 lg:order-2">
              <p className={`${mansalva.className} mb-3 lg:mb-4 text-[18px] lg:text-[22px] font-bold text-[#ef3a6b]`}>
                Performance Marketing & D2C Branding
              </p>
              <h1 className={`${epilogue.className} text-[#0e2547] leading-[1.05]`}>
                <span className="block lg:inline text-[38px] sm:text-[60px] lg:text-[76px] xl:text-[84px] font-bold">
                  We make it{" "}
                </span>
                <span className="block lg:inline-block text-[38px] sm:text-[60px] lg:text-[76px] xl:text-[84px] font-bold min-h-[1.2em] lg:min-h-0 lg:w-[13ch]">
                  {displayedText}
                  <span className="ml-1 inline-block h-[0.85em] lg:h-[0.9em] w-[3px] animate-pulse bg-[#0e2547]" />
                </span>
                <span className="relative block text-[38px] sm:text-[60px] lg:text-[76px] xl:text-[84px] font-bold">
                  and scalable
                  <span className="absolute left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-0 bottom-[4px] lg:bottom-[6px] -z-10 h-[8px] lg:h-[10px] w-[45%] lg:w-[40%] bg-[#ef5b87]" />
                </span>
              </h1>
              <p className={`${outfit.className} mt-5 lg:mt-7 text-[15px] lg:text-[18px] leading-[1.85] lg:leading-[2] text-slate-600`}>
                Performance marketing service in India that combines data, design, and strategy
                to help D2C brands grow faster and build a strong market presence.
              </p>
              <div className="mt-7 lg:mt-9 flex justify-center lg:justify-start">
                <LocalizedClientLink href="/contact" className={`${epilogue.className} btn-get-started`}>
                  Book a Call
                  <span className="arrow">→</span>
                </LocalizedClientLink>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  )
}