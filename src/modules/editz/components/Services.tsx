'use client';

import { motion } from 'framer-motion';
import { SERVICES } from '@modules/editz/lib/data';
import { Film, Video, Megaphone, Lightbulb } from 'lucide-react';

const serviceIcons = [Film, Video, Megaphone, Lightbulb];

export default function Services() {
  return (
    <section id="services" className="py-12 sm:py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Dotted Grid Background exclusively for Services */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, #c0c0c0 1.2px, transparent 1.2px)`,
            backgroundSize: '24px 24px',
            opacity: 0.45,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER BADGE & TITLE */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <div className="section-badge mb-4">
            <Film className="w-4 h-4 text-[#E32759]" />
            <span>Services</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#111111] tracking-tight">
            How we help you grow
          </h2>
        </div>

        {/* 2X2 CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SERVICES.map((service, index) => {
            const IconComponent = serviceIcons[index % serviceIcons.length];

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl bg-white border border-black/7 p-6 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative z-10 text-center flex flex-col items-center">
                  <div className="w-11 h-11 rounded-xl bg-[#FFF0F4] border border-[#FCE7ED] flex items-center justify-center text-[#E32759] mb-4 group-hover:scale-110 transition-transform duration-300 shadow-2xs">
                    <IconComponent className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <h3 className="text-lg font-bold text-[#111111] mb-2 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-[#555555] text-sm leading-relaxed max-w-sm font-normal">
                    {service.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-black/5 flex justify-center gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-3 h-2.5 rounded-xs bg-black/30" />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
