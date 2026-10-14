'use client';

import { motion } from 'framer-motion';
import { Instagram, Youtube, Disc } from 'lucide-react';

export default function CTA() {
  return (
    <section id="contact" className="py-12 sm:py-24 lg:py-32 bg-[#FFFDFA] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-white border border-black/8 p-6 sm:p-16 text-center shadow-xl filmstrip-holes bg-grid-pattern overflow-hidden"
        >
          <h2 className="text-4xl sm:text-6xl font-bold text-[#111111] tracking-tight leading-none mb-6">
            <span className="text-[#E32759]">Content</span> Starts Here
          </h2>

          <p className="text-base sm:text-xl text-[#555555] max-w-xl mx-auto mb-10 font-normal leading-relaxed">
            Bring your footage or ideas, we'll craft videos that look better, engage viewers, and support your growth.
          </p>

          <div className="flex justify-center mb-12">
            <a
              href="mailto:kuldeep@mommantum.com"
              className="px-8 py-4 rounded-full bg-[#111111] text-white font-semibold text-base hover:bg-zinc-800 transition-all duration-200 shadow-md"
            >
              Let's Grow Your Content
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-[#666666]">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-[#FFFDFA] hover:text-[#E32759] transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-[#FFFDFA] hover:text-[#E32759] transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-[#FFFDFA] hover:text-[#E32759] transition-colors">
              <Disc className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
