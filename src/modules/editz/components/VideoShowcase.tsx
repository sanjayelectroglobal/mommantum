'use client';

import { motion } from 'framer-motion';
import { Film } from 'lucide-react';
import { useState } from 'react';

export default function VideoShowcase() {
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const showcaseVideos = [
    {
      id: '1',
      videoUrl: '/video1.mp4',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      transform: 'rotate(-5deg) skewY(8deg)',
    },
    {
      id: '2',
      videoUrl: '/video2.mp4',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      transform: 'none',
    },
    {
      id: '3',
      videoUrl: '/video3.mp4',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      transform: 'rotate(5deg) skewY(-8deg)',
    },
  ];

  return (
    <section className="py-20 bg-[#FFFDFA] relative overflow-hidden">
      {/* SCOPED RESPONSIVE CARD TRANSFORMS */}
      <style>{`
        @media (max-width: 639px) {
          .showcase-v-card-0 { transform: rotate(-3deg) !important; }
          .showcase-v-card-1 { transform: rotate(3deg) !important; }
          .showcase-v-card-2 { transform: rotate(-2deg) !important; }
        }
        @media (min-width: 640px) {
          .showcase-v-card-0 { transform: rotate(-5deg) skewY(8deg) !important; }
          .showcase-v-card-1 { transform: none !important; }
          .showcase-v-card-2 { transform: rotate(5deg) skewY(-8deg) !important; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="section-badge mb-4">
            <Film className="w-4 h-4 text-[#E32759]" />
            <span>Watch Our Story</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#111111] tracking-tight">
            See what EDITZ can do
          </h2>
        </div>

        {/* 3 VIDEO CARDS WITH VIDEO PLAYBACK */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center gap-8 sm:gap-6 px-4">
          {showcaseVideos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setActiveVideoModal(video.videoUrl)}
              className={`showcase-v-card-${idx} relative w-full max-w-[300px] aspect-[9/16] sm:aspect-auto sm:w-auto sm:flex-1 sm:h-[460px] md:h-[510px] sm:max-w-[260px] rounded-[32px] sm:rounded-b-none sm:rounded-t-[24px] bg-white p-2.5 sm:p-1 shadow-[0_20px_50px_rgba(0,0,0,0.18)] cursor-pointer transition-all duration-300 ${
                idx === 1 ? 'z-10' : 'z-20'
              }`}
            >
              <div className="w-full h-full rounded-t-[20px] overflow-hidden relative shadow-inner">
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
            </motion.div>
          ))}
        </div>
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
