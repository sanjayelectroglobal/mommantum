'use client';

import { Instagram, Facebook } from 'lucide-react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

export default function Footer() {
  return (
    <footer className="bg-[#FFFDFA] border-t border-black/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-black/8">
          <div>
            <LocalizedClientLink href="/" className="group inline-flex items-center gap-2.5 mb-3 transition-transform duration-200 hover:scale-[1.02]">
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
            <p className="text-sm text-[#666666] max-w-sm">
              Creating performance-driven video content for creators and growing brands.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <a
              href="#contact"
              className="px-6 py-2.5 rounded-full bg-[#e61e73] text-white text-sm font-extrabold uppercase hover:bg-[#ca155f] transition-colors shadow-md"
            >
              Contact Us
            </a>

            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/mommantumeditz/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#111111] hover:text-[#e61e73] hover:border-[#e61e73] transition-colors shadow-xs"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61594685770172"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#111111] hover:text-[#1877f2] hover:border-[#1877f2] transition-colors shadow-xs"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777777]">
          <div>© 2026 MOMMANTUM EDITZ. All Rights Reserved.</div>
          <div>Email: <a href="mailto:kuldeep@mommantum.com" className="font-semibold text-[#111111] hover:underline">kuldeep@mommantum.com</a></div>
        </div>
      </div>
    </footer>
  );
}
