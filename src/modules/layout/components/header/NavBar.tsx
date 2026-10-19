"use client"

import Image from "next/image"
import { epilogue as logoFont, outfit as navFont } from "@lib/fonts"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import ServicesDropdown from "./ServicesDropdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const MOBILE_BREAKPOINT = 1024

const leftServices = [
  { name: "Performance Marketing — Meta & Google Ads", link: "/services/performance-marketing" },
  { name: "Conversion Rate Optimization (CRO)", link: "/services/conversion-rate-optimization" },
  { name: "SEO — AEO & GEO", link: "/services/search-engine-optimization" },
  { name: "Script & Copywriting", link: "/services/script-copywriting" },
  { name: "D2C Branding & Scale Growth", link: "/services/d2c-branding-scale-growth" },
  { name: "Social Media Marketing (SMO & Content)", link: "/services/social-media-marketing" },
  { name: "Strategy & Consulting", link: "/services/strategy-consulting" },
]

const rightServices = [
  { name: "Web and App Development", link: "/services/web-app-development" },
  { name: "AI Automation", link: "/services/ai-automation" },
  { name: "AI Agentic Service", link: "/services/ai-agentic-service" },
  { name: "AI Video Generation", link: "/services/ai-video-generation" },
]

// WHAT: Dedicated creative production and video editing service routes for mobile navigation
// WHY: Ensures mobile visitors have direct access to all 6 video service landing pages
const videoEditzServices = [
  { name: "AI video generator", link: "/services/ai-video-generation" },
  { name: "Content and Video Scripting", link: "/services/content-video-scripting" },
  { name: "Video Editing", link: "/services/video-editing" },
  { name: "AI Video Editing", link: "/services/ai-video-editing" },
  { name: "Podcast Editing", link: "/services/podcast-editing" },
  { name: "motion graphics", link: "/services/motion-graphics" },
]

const navItems = [
  { label: "Editz", href: "/editz" },
  { label: "Blog AI", href: "/blog-ai" },
  { label: "About", href: "/about" },
  { label: "Work",  href: "/work" },
  { label: "Blog",  href: "/blog" },
]

const PerfIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 17 L8 11 L12 13.5 L18 7 L21 9"
      stroke="#e61e73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 6 L21 6 L21 10"
      stroke="#e61e73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const WebAiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="17" width="4" height="5" rx="1" fill="#e61e73" opacity="0.4"/>
    <rect x="9" y="12" width="4" height="10" rx="1" fill="#e61e73" opacity="0.65"/>
    <rect x="15" y="7" width="4" height="15" rx="1" fill="#e61e73"/>
    <circle cx="21" cy="4" r="2" fill="#e61e73" opacity="0.5"/>
  </svg>
)

const VideoEditzIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="#e61e73" strokeWidth="2"/>
    <polygon points="10,9 16,12 10,15" fill="#e61e73"/>
  </svg>
)

export default function NavBar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [blogAiOpen, setBlogAiOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    if (isMobile === false) setMenuOpen(false)
  }, [isMobile])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  function closeAll() { setMenuOpen(false) }

  if (pathname === "/editz" || pathname?.endsWith("/editz")) {
    return null
  }

  return (
    <>
      <style>{`
        .nav-link {
          position: relative; font-size: 15px; font-weight: 500;
          color: #1e293b; text-decoration: none; padding: 4px 2px;
          white-space: nowrap; transition: color 0.2s ease;
        }
        .nav-link::after {
          content: ""; position: absolute; left: 50%; bottom: -2px;
          height: 2px; width: 0; background: #e61e73; border-radius: 999px;
          transform: translateX(-50%);
          transition: width 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-link:hover { color: #e61e73; }
        .nav-link:hover::after { width: 100%; }
        .logo-link { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .logo-word { font-size: 24px; font-weight: 800; letter-spacing: -0.04em; color: #0e2547; line-height: 1; transition: color 0.2s ease; white-space: nowrap; }
        .logo-link:hover .logo-word { color: #e61e73; }
        .logo-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #e61e73; margin-left: 1px; position: relative; top: -8px; }
        .nav-cta {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 20px; border-radius: 999px; background: #0e2547;
          color: #fff; font-size: 14px; font-weight: 600; text-decoration: none;
          letter-spacing: 0.01em; white-space: nowrap; flex-shrink: 0;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .nav-cta:hover { background: #e61e73; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(230,30,115,0.28); }
        .nav-cta:active { transform: translateY(0); }
        .ham-btn {
          display: flex; flex-direction: column; justify-content: center;
          align-items: center; gap: 5px; width: 40px; height: 40px;
          border: none; background: transparent; cursor: pointer; padding: 0;
          border-radius: 8px; flex-shrink: 0; transition: background 0.15s ease;
        }
        .ham-btn:hover { background: #f3f4f6; }
        .ham-line {
          display: block; width: 22px; height: 2px; background: #0e2547;
          border-radius: 999px;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease, width 0.3s ease;
          transform-origin: center;
        }
        .ham-open .ham-line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .ham-open .ham-line:nth-child(2) { opacity: 0; width: 0; }
        .ham-open .ham-line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── Mobile sheet ── */
        .mob-sheet {
          position: fixed;
          top: 84px;
          left: 12px;
          right: 12px;
          max-height: calc(100dvh - 100px);
          overflow-y: auto;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(14,37,71,0.22), 0 4px 16px rgba(14,37,71,0.08);
          z-index: 55;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .mob-sheet::-webkit-scrollbar { display: none; }
        .mob-close-row {
          display: flex; align-items: center; justify-content: flex-end;
          padding: 12px 14px 2px;
        }
        .mob-close {
          width: 30px; height: 30px; border-radius: 50%;
          border: 1.5px solid #e2e8f0; background: #f8fafc; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #64748b; font-size: 20px; line-height: 1;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .mob-close:hover { background: #fee2e2; color: #e61e73; border-color: #fdd0e4; }
        .mob-cat-header {
          display: flex; align-items: center; gap: 10px; padding: 8px 16px 6px;
        }
        .mob-cat-icon {
          width: 36px; height: 36px; border-radius: 9px;
          background: #fff1f5; border: 1px solid #fdd0e4;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .mob-cat-title { font-size: 14px; font-weight: 700; color: #0e2547; letter-spacing: -0.02em; }
        .mob-svc-link {
          display: block; padding: 8px 16px;
          font-size: 13px; font-weight: 500; color: #475569; text-decoration: none;
          transition: background 0.12s, color 0.12s;
        }
        .mob-svc-link:hover { background: #fff1f5; color: #e61e73; }
        .mob-divider { height: 1px; background: #f1f5f9; margin: 6px 16px; }
        .mob-view-work {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          margin: 12px 16px 0; height: 44px; border-radius: 12px;
          background: #e61e73; color: #fff;
          font-size: 12px; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; text-decoration: none;
          transition: background 0.2s;
        }
        .mob-view-work:hover { background: #ca155f; }
        .mob-bottom-nav {
          display: flex; align-items: center; justify-content: center; gap: 2px;
          padding: 10px 16px 8px; border-top: 1px solid #f1f5f9; margin-top: 10px;
        }
        .mob-bottom-link {
          padding: 5px 12px; border-radius: 999px;
          font-size: 13px; font-weight: 500; color: #64748b; text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .mob-bottom-link:hover { background: #f8fafc; color: #0e2547; }
        .mob-social-row {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; padding: 6px 16px 14px;
        }
        .mob-social-btn {
          width: 32px; height: 32px; border-radius: 50%;
          border: 1.5px solid #e2e8f0; background: #fff;
          display: flex; align-items: center; justify-content: center;
          color: #64748b; text-decoration: none;
          transition: border-color 0.2s, color 0.2s, transform 0.2s;
        }
        .mob-social-btn:hover { border-color: #e61e73; color: #e61e73; transform: translateY(-2px); }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "sticky", top: 0, zIndex: 50, width: "100%",
          backgroundColor: "#fff",
          boxShadow: scrolled ? "0 2px 20px rgba(14,37,71,0.08)" : "none",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <div className="content-container" style={{ paddingLeft: "clamp(16px, 4vw, 40px)", paddingRight: "clamp(16px, 4vw, 40px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 76, gap: 24 }}>

            <LocalizedClientLink href="/" className="logo-link">
              <Image src="/logo.png" alt="Mommantum Logo" width={36} height={36}
                style={{ width: 36, height: 36, objectFit: "contain", flexShrink: 0 }} priority />
              <span className={`${logoFont.className} logo-word`}>
                mommantum<span className="logo-dot" aria-hidden />
              </span>
            </LocalizedClientLink>

            {/* Desktop — unchanged */}
            {isMobile === false && (
              <div className={navFont.className} style={{ display: "flex", alignItems: "center", gap: 32 }}>
                <LocalizedClientLink href="/editz" className="nav-link">Editz</LocalizedClientLink>
                <div className="group" style={{ position: "relative" }}>
                  <LocalizedClientLink href="/services" className="nav-link">Services</LocalizedClientLink>
                  <ServicesDropdown />
                </div>
                <button
                  onClick={() => setBlogAiOpen(true)}
                  className="nav-link"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}
                >Blog AI</button>
                <LocalizedClientLink href="/about" className="nav-link">About</LocalizedClientLink>
                <LocalizedClientLink href="/work"  className="nav-link">Case Studies</LocalizedClientLink>
                <LocalizedClientLink href="/blog"  className="nav-link">Blog</LocalizedClientLink>
                <LocalizedClientLink href="/contact" className="nav-cta">
                  Let&apos;s Talk <span aria-hidden>→</span>
                </LocalizedClientLink>
              </div>
            )}

            {/* Hamburger */}
            {isMobile === true && (
              <button
                className={`ham-btn${menuOpen ? " ham-open" : ""}`}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                <span className="ham-line" />
                <span className="ham-line" />
                <span className="ham-line" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── MOBILE SHEET ── */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(3px)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeAll}
            />

            {/* Floating card */}
            <motion.div
              className={`mob-sheet ${navFont.className}`}
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* × close */}
              <div className="mob-close-row">
                <button className="mob-close" onClick={closeAll} aria-label="Close menu">×</button>
              </div>

              {/* Performance Marketing */}
              <div className="mob-cat-header">
                <div className="mob-cat-icon"><PerfIcon /></div>
                <span className="mob-cat-title">Performance Marketing</span>
              </div>
              {leftServices.map((item, i) => (
                <motion.div key={item.link}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.022 + 0.04, duration: 0.2 }}>
                  <LocalizedClientLink href={item.link} prefetch={false} className="mob-svc-link" onClick={closeAll}>
                    {item.name}
                  </LocalizedClientLink>
                </motion.div>
              ))}

              <div className="mob-divider" />

              {/* Web & AI */}
              <div className="mob-cat-header">
                <div className="mob-cat-icon"><WebAiIcon /></div>
                <span className="mob-cat-title">Web & AI Development</span>
              </div>
              {rightServices.map((item, i) => (
                <motion.div key={item.link}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.022 + leftServices.length * 0.022 + 0.04, duration: 0.2 }}>
                  <LocalizedClientLink href={item.link} prefetch={false} className="mob-svc-link" onClick={closeAll}>
                    {item.name}
                  </LocalizedClientLink>
                </motion.div>
              ))}

              <div className="mob-divider" />

              {/* Video Editz */}
              <div className="mob-cat-header">
                <div className="mob-cat-icon"><VideoEditzIcon /></div>
                <span className="mob-cat-title">Video Editz</span>
              </div>
              {videoEditzServices.map((item, i) => (
                <motion.div key={item.name}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.022 + (leftServices.length + rightServices.length) * 0.022 + 0.04, duration: 0.2 }}>
                  <LocalizedClientLink href={item.link} prefetch={false} className="mob-svc-link" onClick={closeAll}>
                    {item.name}
                  </LocalizedClientLink>
                </motion.div>
              ))}

              {/* View Our Work */}
              <LocalizedClientLink href="/work" className="mob-view-work" onClick={closeAll}>
                VIEW OUR WORK ›
              </LocalizedClientLink>

              {/* Bottom nav links */}
              <div className="mob-bottom-nav">
                {navItems.map((item) =>
                  item.label === "Blog AI" ? (
                    <button
                      key={item.href}
                      className="mob-bottom-link"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit", textAlign: "left" }}
                      onClick={() => { closeAll(); setBlogAiOpen(true) }}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <LocalizedClientLink key={item.href} href={item.href} className="mob-bottom-link" onClick={closeAll}>
                      {item.label}
                    </LocalizedClientLink>
                  )
                )}
              </div>

              {/* Socials */}
              <div className="mob-social-row">
                <a href="https://www.instagram.com/mommantummedia" target="_blank" rel="noopener noreferrer" className="mob-social-btn" aria-label="Instagram">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/mommantum-media/" target="_blank" rel="noopener noreferrer" className="mob-social-btn" aria-label="LinkedIn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452H16.89v-5.569c0-1.327-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.983 1.983 0 1 1 0-3.966 1.983 1.983 0 0 1 0 3.966zm1.997 13.019H3.34V9h3.994v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://x.com/mommantum" target="_blank" rel="noopener noreferrer" className="mob-social-btn" aria-label="X">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── BLOG AI POPUP MODAL ── */}
      <AnimatePresence>
        {blogAiOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setBlogAiOpen(false)}
            />

            {/* Modal Card */}
            <motion.div
              style={{
                position: "fixed", top: "50%", left: "50%", zIndex: 201,
                transform: "translate(-50%, -50%)",
                background: "#fff",
                borderRadius: 20,
                padding: "44px 36px 36px",
                maxWidth: 420,
                width: "calc(100vw - 40px)",
                boxShadow: "0 24px 60px rgba(14,37,71,0.14)",
                textAlign: "center",
              }}
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 16 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Close button */}
              <button
                onClick={() => setBlogAiOpen(false)}
                aria-label="Close"
                style={{
                  position: "absolute", top: 14, right: 14,
                  width: 30, height: 30, borderRadius: "50%",
                  border: "1.5px solid #e2e8f0", background: "#f8fafc",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 17, color: "#94a3b8", lineHeight: 1,
                }}
              >×</button>

              {/* Top accent line */}
              <div style={{
                width: 48, height: 4, borderRadius: 4,
                background: "linear-gradient(90deg, #e61e73, #9333ea)",
                margin: "0 auto 28px",
              }} />

              {/* Heading */}
              <h2 style={{
                fontFamily: "'Epilogue', sans-serif",
                fontSize: 28, fontWeight: 800, color: "#0e2547",
                margin: "0 0 12px", lineHeight: 1.15,
              }}>
                Coming Soon
              </h2>

              {/* Description */}
              <p style={{
                fontSize: 15, color: "#64748b", lineHeight: 1.7,
                margin: "0 0 32px", fontFamily: "'Outfit', sans-serif",
              }}>
                We&apos;re working on something exciting for Blog AI.<br />
                It will be available very soon. Stay tuned!
              </p>

              {/* Close CTA */}
              <button
                onClick={() => setBlogAiOpen(false)}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: "12px 36px", borderRadius: 10,
                  background: "#0e2547",
                  color: "#fff", fontSize: 14, fontWeight: 600,
                  border: "none", cursor: "pointer",
                  letterSpacing: "0.01em",
                  fontFamily: "'Outfit', sans-serif",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#1a3a6b")}
                onMouseLeave={e => (e.currentTarget.style.background = "#0e2547")}
              >
                Got it
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}