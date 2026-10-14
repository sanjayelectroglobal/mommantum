'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Benefits', href: '#benefits' },
    { name: 'Projects', href: '#projects' },
    { name: 'Process', href: '#process' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FFFDFA]/90 backdrop-blur-md border-b border-black/5 py-4 shadow-xs'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* LOGO — CLICK REDIRECTS TO MOMMANTUM HOMEPAGE */}
        <LocalizedClientLink
          href="/"
          className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="relative flex items-center justify-center">
            <img
              src="/mommantum_logo.png"
              alt="MOMMANTUM"
              className="w-9 h-9 rounded-full object-cover shadow-sm ring-2 ring-pink-500/20"
            />
          </div>
          <span className="flex items-center font-extrabold text-[22px] tracking-[-0.03em] text-[#0e2547]">
            <span className="text-[#e61e73] font-black text-[23px] mr-[0.5px]">E</span>
            <span>DITZ</span>
            <span className="ml-[3px] inline-block h-1.5 w-1.5 rounded-full bg-[#e61e73]" />
          </span>
        </LocalizedClientLink>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[#444444] hover:text-black transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* DESKTOP RIGHT CTA */}
        <div className="hidden md:flex items-center">
          <a
            href="#contact"
            className="px-6 py-2.5 rounded-full bg-[#111111] text-white text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm"
          >
            Contact Us
          </a>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-full bg-white border border-black/10 text-black shadow-xs"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-b border-black/10 px-6 py-6 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-zinc-800 hover:text-[#E32759] py-2 border-b border-zinc-100"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 w-full flex items-center justify-center py-3 rounded-full bg-[#111111] text-white font-bold"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
