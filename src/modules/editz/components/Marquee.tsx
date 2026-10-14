'use client';

import { MARQUEE_ITEMS } from '@modules/editz/lib/data';

export default function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section className="py-6 bg-white border-y border-black/10 overflow-hidden">
      <style jsx>{`
        @keyframes textMarqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .text-marquee-track {
          display: flex;
          width: max-content;
          animation: textMarqueeScroll 30s linear infinite;
        }
        .text-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative flex overflow-x-hidden">
        <div className="text-marquee-track whitespace-nowrap items-center">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 mx-4 flex-shrink-0">
              <span className="text-base sm:text-lg font-semibold text-[#111111]">
                {item}
              </span>
              <span className="text-[#999999] text-xs">●</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
