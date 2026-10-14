'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Settings, FolderPlus, Scissors, Rocket } from 'lucide-react';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: any;
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Share Your Footage',
    description: 'Send your raw files, references, and goals. We align on style, platform, and expectations before editing.',
    icon: FolderPlus,
  },
  {
    number: '02',
    title: 'Edit, Review & Refine',
    description: 'We craft the first cut and refine it using your feedback until every single frame feels right.',
    icon: Scissors,
  },
  {
    number: '03',
    title: 'Deliver & Track Results',
    description: 'Final videos are delivered fully optimized for your target platform to maximize retention and growth.',
    icon: Rocket,
  },
];

function Card({
  step,
  index,
  total = 3,
  progress,
}: {
  step: Step;
  index: number;
  total?: number;
  progress: any;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Range of scroll progress for scaling down as user scrolls past
  const validTotal = total > 0 ? total : 3;
  const targetScale = 1 - (validTotal - index) * 0.04;
  const range = [index * (1 / validTotal), 1];

  const scale = useTransform(progress, range, [1, targetScale]);
  const opacity = useTransform(progress, range, [1, 0.75 + index * 0.08]);
  const yOffset = useTransform(progress, range, [0, -index * 12]);

  // Tilt angles matching reference image (Card 1 right +3.5deg, Card 2 left -3.5deg, Card 3 right +2.5deg)
  const cardTilt = index === 0 ? 3.5 : index === 1 ? -3.5 : 2.5;

  const IconComponent = step.icon;

  return (
    <div
      ref={containerRef}
      className="sticky top-28 sm:top-36 flex items-center justify-center py-4"
      style={{
        zIndex: index + 1,
      }}
    >
      <motion.div
        style={{
          scale,
          opacity,
          y: yOffset,
          rotate: cardTilt,
        }}
        className="relative w-full max-w-2xl rounded-3xl bg-white border border-black/[0.08] p-8 sm:p-12 shadow-xl filmstrip-holes flex flex-col items-center text-center overflow-hidden transition-shadow duration-300 origin-top"
      >
        {/* TOP PINK ICON BADGE */}
        <div className="w-14 h-14 rounded-2xl bg-[#FFF0F4] border border-[#FCE7ED] flex items-center justify-center text-[#E32759] mb-6 shadow-2xs">
          <IconComponent className="w-7 h-7 stroke-[2.2]" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-4 tracking-tight">
          {step.title}
        </h3>
        <p className="text-[#555555] text-base leading-relaxed max-w-md font-normal mb-8">
          {step.description}
        </p>

        {/* BOTTOM STEP NUMBER BADGE */}
        <div className="px-6 py-2 rounded-2xl bg-[#FFF0F4] border border-[#FCE7ED] text-[#E32759] text-2xl font-black tracking-tight font-mono shadow-2xs">
          {step.number}
        </div>
      </motion.div>
    </div>
  );
}

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const totalSteps = steps?.length || 3;

  return (
    <section
      id="process"
      ref={containerRef}
      className="py-12 sm:py-24 lg:py-32 bg-[#FFFDFA] relative overflow-visible border-t border-black/5"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <div className="section-badge mb-4">
            <Settings className="w-4 h-4 text-[#E32759]" />
            <span>Process</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#111111] tracking-tight">
            Our simple process
          </h2>
        </div>

        {/* STICKY FOLDING CARDS CONTAINER */}
        <div className="relative flex flex-col gap-6 pb-20">
          {(steps || []).map((step, index) => (
            <Card
              key={step.number}
              step={step}
              index={index}
              total={totalSteps}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
