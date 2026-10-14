'use client';

export default function BrandMarquee() {
  const brandLogos = [
    { id: '1', name: 'Jalvayu', src: '/logo1.jpeg' },
    { id: '2', name: 'MLA', src: '/logo2.jpeg' },
    { id: '3', name: 'Altie Reality', src: '/logo3.jpeg' },
    { id: '4', name: 'Electro Global', src: '/logo4.png' },
    { id: '5', name: 'Poodles', src: '/logo5.png' },
    { id: '6', name: 'Brand 6', src: '/logo6.jpeg' },
    { id: '7', name: 'Brand 7', src: '/logo7.jpeg' },
    { id: '8', name: 'Brand 8', src: '/logo8.png' },
  ];

  const brands = [...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos];

  return (
    <section className="py-6 sm:py-14 bg-[#FFFDFA] overflow-hidden">
      <style jsx>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 20s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-8 text-center">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-black/40">
          BRANDS WE HELP GROW
        </p>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="marquee-track items-center gap-12 sm:gap-20">
          {brands.map((brand, idx) => (
            <div key={idx} className="flex items-center justify-center h-12 px-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer flex-shrink-0">
              <img
                src={brand.src}
                alt={brand.name}
                className="h-9 sm:h-11 w-auto max-w-[140px] object-contain mix-blend-multiply"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
