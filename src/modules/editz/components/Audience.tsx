'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function Audience() {
  const audiences = [
    {
      title: 'Content Creators',
      description: 'Short-form and long-form creators making regular video content.',
      image: '/aud1.jpg',
    },
    {
      title: 'YouTubers & Podcasters',
      description: 'Creators focused on clear structure, pacing, and viewer retention.',
      image: '/aud2.jpg',
    },
    {
      title: 'Short-Form Specialists',
      description: 'Creators producing high-volume videos for Reels, Shorts, and feeds.',
      image: '/aud3.jpg',
    },
    {
      title: 'Personal Brands',
      description: 'Individuals using video to build trust, authority, and online presence.',
      image: '/aud4.jpg',
    },
  ];

  return (
    <section className="py-12 sm:py-24 lg:py-32 bg-[#FFFDFA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <div className="section-badge mb-4">
            <Users className="w-4 h-4 text-[#E32759]" />
            <span>Who It's For</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#111111] tracking-tight">
            Built for those who want <br className="hidden sm:inline" />
            their content to perform
          </h2>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((aud, index) => (
            <motion.div
              key={aud.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-3xl overflow-hidden aspect-[3/4] bg-black shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between p-6"
            >
              <img
                src={aud.image}
                alt={aud.title}
                className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

              {/* TOP WHITE TAB BADGE */}
              <div className="relative z-10 self-center">
                <span className="px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#111111] shadow-xs">
                  {aud.title}
                </span>
              </div>

              {/* BOTTOM TEXT BOX OVERLAY */}
              <div className="relative z-10 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-center">
                <p className="text-xs text-white/90 leading-relaxed font-normal">
                  {aud.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
