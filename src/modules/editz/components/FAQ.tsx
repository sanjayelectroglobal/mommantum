'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Plus, Minus } from 'lucide-react';
import { FAQS } from '@modules/editz/lib/data';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-12 sm:py-24 lg:py-32 bg-[#FFFDFA] relative overflow-hidden border-t border-black/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="section-badge mb-4">
            <HelpCircle className="w-4 h-4 text-[#E32759]" />
            <span>FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#111111] tracking-tight">
            Got questions?
          </h2>
        </div>

        {/* ACCORDION */}
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-2xl bg-white border border-black/7 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-lg font-bold text-[#111111]">
                    {faq.question}
                  </span>
                  <div
                    className={`p-2 rounded-full transition-colors ${
                      isOpen ? 'bg-[#E32759] text-white' : 'bg-[#F6F6F8] text-[#111111]'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-7 text-sm text-[#555555] leading-relaxed border-t border-black/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
