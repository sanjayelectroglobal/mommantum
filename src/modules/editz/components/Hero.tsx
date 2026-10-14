'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import FilmstripBackground from './FilmstripBackground';
import { MARQUEE_ITEMS } from '@modules/editz/lib/data';

export default function Hero() {
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const heroVideos = [
    {
      id: '1',
      videoUrl: '/video1.mp4',
      views: '2.8M views',
      likes: '50K+ likes',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '2',
      videoUrl: '/video2.mp4',
      views: '1.9M views',
      likes: '42K+ likes',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '3',
      videoUrl: '/video3.mp4',
      views: '2.8M views',
      likes: '68K+ likes',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section className="relative pt-20 pb-8 sm:pt-28 md:pt-36 sm:pb-16 bg-white overflow-hidden">
      {/* SCOPED RESPONSIVE CARD TRANSFORMS */}
      <style>{`
        @media (max-width: 639px) {
          .hero-v-card-0 { transform: rotate(-3deg) !important; }
          .hero-v-card-1 { transform: rotate(3deg) !important; }
          .hero-v-card-2 { transform: rotate(-2deg) !important; }
        }
        @media (min-width: 640px) {
          .hero-v-card-0 { transform: rotate(-5deg) skewY(8deg) !important; }
          .hero-v-card-1 { transform: none !important; }
          .hero-v-card-2 { transform: rotate(5deg) skewY(-8deg) !important; }
        }
      `}</style>

      {/* EXACT ANGLED FILMSTRIP & DOT GRID BACKGROUND */}
      <FilmstripBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* STATUS BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 text-sm font-medium text-[#444444]">
            <span className="w-2 h-2 rounded-full bg-[#59D444] animate-pulse" />
            <span>Accepting New Projects</span>
          </div>
        </motion.div>

        {/* HEADLINE */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#111111] leading-[1.1]">
            <span className="text-[#E32759]">Video Editing</span> Built for{' '}
            <br className="hidden sm:block" />
            Growth & Performance
          </h1>
        </motion.div>

        {/* SUBTITLE */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 text-base text-[#555555] max-w-xl mx-auto text-center font-semibold leading-relaxed"
        >
          Helping creators and brands grow through strategic video editing, strong retention storytelling, and high-impact content.
        </motion.p>

        {/* CTA BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex justify-center"
        >
          <a
            href="#contact"
            className="px-7 py-3 rounded-full bg-[#111111] text-white font-semibold text-sm hover:bg-zinc-800 transition-all duration-200"
          >
            Let's Grow Your Content
          </a>
        </motion.div>

        {/* HERO VIDEO CARDS (STACKED ONE-BY-ONE ON MOBILE, TILTED ROW ON DESKTOP) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 sm:mt-16 relative max-w-4xl mx-auto"
        >
          {/* VIDEO CARDS CONTAINER */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end justify-center gap-8 sm:gap-6 px-4">
            {heroVideos.map((video, idx) => (
              <div
                key={video.id}
                onClick={() => setActiveVideoModal(video.videoUrl)}
                className={`hero-v-card-${idx} relative w-full max-w-[300px] aspect-[9/16] sm:aspect-auto sm:w-auto sm:flex-1 sm:h-[460px] md:h-[510px] sm:max-w-[260px] rounded-[32px] sm:rounded-b-none sm:rounded-t-[24px] bg-white p-2.5 sm:p-1 shadow-[0_20px_50px_rgba(0,0,0,0.18)] cursor-pointer transition-all duration-300 ${
                  idx === 1 ? 'z-10' : 'z-20'
                }`}
              >
                <div className="w-full h-full rounded-[24px] sm:rounded-b-none sm:rounded-t-[20px] overflow-hidden relative shadow-inner">
                  <video
                    src={video.videoUrl}
                    poster={video.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          {/* MARQUEE TICKER — ROUNDED PILL OVERLAPPING ON TOP OF CARDS */}
          <div className="relative z-30 mt-8 sm:-mt-8 border border-black/[0.08] py-3.5 bg-white overflow-hidden rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <div className="flex overflow-x-hidden group">
              <div className="flex animate-marquee whitespace-nowrap items-center group-hover:[animation-play-state:paused]">
                {(() => {
                  const safeItems = MARQUEE_ITEMS || [];
                  const marqueeList = [...safeItems, ...safeItems, ...safeItems];
                  return marqueeList.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-5 mx-3">
                      <span className="text-xs font-semibold text-[#111111]">{item}</span>
                      <span className="text-[#E32759] text-[10px]">•</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* LOCAL VIDEO MODAL IF CLICKED */}
      {activeVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="relative w-full max-w-xl aspect-[9/16] max-h-[85vh] bg-black rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              className="w-full h-full object-cover"
              src={activeVideoModal}
              controls
              autoPlay
              playsInline
            />
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/80 text-white hover:bg-[#E32759] transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

