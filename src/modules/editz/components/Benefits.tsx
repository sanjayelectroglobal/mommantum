'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, RefreshCw } from 'lucide-react';

export default function Benefits() {
  const bars = [25, 38, 48, 62, 52, 92, 72];

  // Real-time System Clock
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time ? time.getSeconds() : 0;
  const minutes = time ? time.getMinutes() + seconds / 60 : 0;
  const hours = time ? (time.getHours() % 12) + minutes / 60 : 0;

  const secondAngle = seconds * 6; // 360deg / 60s
  const minuteAngle = minutes * 6; // 360deg / 60m
  const hourAngle = hours * 30;    // 360deg / 12h

  return (
    <section id="benefits" className="py-12 sm:py-24 lg:py-32 bg-[#FFFDFA] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-black/10 bg-white text-xs font-medium text-zinc-700 shadow-2xs mb-5">
            <span className="text-xs">⚙️</span> Benefits
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#111111] tracking-tight leading-[1.12]">
            Why we're the smart<br />choice for growth
          </h2>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">

          {/* ── LEFT COLUMN (1/3) ── */}
          <div className="flex flex-col gap-4">

            {/* Card 1 — Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-white border border-black/[0.08] p-7 shadow-2xs flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <h3 className="text-xl font-bold text-[#111111] text-center mb-6 leading-snug">
                  Content Built to Drive<br />Results That Matter
                </h3>

                <div className="flex flex-col items-start gap-2.5 mb-8">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4F4F4] text-xs font-semibold text-zinc-800">
                    <ArrowUpRight className="w-3.5 h-3.5 text-black stroke-[2.5]" /> Avg Watch Time 32%
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4F4F4] text-xs font-semibold text-zinc-800">
                    <ArrowUpRight className="w-3.5 h-3.5 text-black stroke-[2.5]" /> Engagement Rate 45%
                  </span>
                </div>
              </div>

              {/* Bar chart */}
              <div className="relative pt-6">
                <div className="flex items-end justify-between gap-2.5 h-36 relative z-10">
                  {bars.map((h, i) => (
                    <div key={i} className="flex-1 relative flex flex-col items-center justify-end h-full">
                      {i === 5 && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#E32759] text-white text-[10px] font-bold shadow-xs whitespace-nowrap z-20">
                          $350K
                        </div>
                      )}
                      <div
                        className="w-full rounded-full transition-all duration-500"
                        style={{
                          height: `${h}%`,
                          backgroundColor: i === 5 ? '#E32759' : '#ECECEC',
                        }}
                      />
                    </div>
                  ))}
                </div>
                {/* Bottom soft fade overlay for chart */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
              </div>
            </motion.div>

            {/* Card 2 — Quick Turnaround on LEFT side */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl bg-white border border-black/[0.08] p-6 shadow-2xs flex flex-col items-center text-center justify-between min-h-[220px] flex-1"
            >
              <div>
                <h4 className="text-base font-bold text-[#111111] mb-1">Quick Turnaround</h4>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px] mx-auto">
                  Fast and reliable delivery, usually within just 24–48 hours.
                </p>
              </div>

              {/* Real-Time Working Analog Clock SVG */}
              <div className="pt-4 flex justify-center">
                <svg viewBox="0 0 100 100" className="w-24 h-24">
                  {/* Outer circle frame */}
                  <circle cx="50" cy="50" r="45" fill="#FAFAFA" stroke="#E6E6E6" strokeWidth="1.5" />
                  {/* Hour tick marks */}
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30 - 90) * (Math.PI / 180);
                    const r1 = 39, r2 = 43;
                    return (
                      <line
                        key={i}
                        x1={50 + r1 * Math.cos(angle)}
                        y1={50 + r1 * Math.sin(angle)}
                        x2={50 + r2 * Math.cos(angle)}
                        y2={50 + r2 * Math.sin(angle)}
                        stroke="#D8D8D8" strokeWidth="1.5" strokeLinecap="round"
                      />
                    );
                  })}

                  {/* Hour hand (black) */}
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="28"
                    stroke="#111111"
                    strokeWidth="3"
                    strokeLinecap="round"
                    transform={`rotate(${hourAngle} 50 50)`}
                    className="transition-transform duration-300"
                  />

                  {/* Minute hand (deep pink #E32759) */}
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="19"
                    stroke="#E32759"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    transform={`rotate(${minuteAngle} 50 50)`}
                    className="transition-transform duration-300"
                  />

                  {/* Second hand (thin grey ticker) */}
                  <line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="15"
                    stroke="#888888"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    transform={`rotate(${secondAngle} 50 50)`}
                    className="transition-transform duration-150"
                  />

                  {/* Center pivot dot */}
                  <circle cx="50" cy="50" r="3.5" fill="#111111" />
                  <circle cx="50" cy="50" r="1.5" fill="#E32759" />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT 2 COLUMNS CONTAINER (2/3) ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* TOP WIDE VIDEO CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl overflow-hidden relative shadow-2xs group min-h-[260px] sm:min-h-[280px] flex items-end justify-center p-8 bg-black"
            >
              <video
                src="/video4.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <h3 className="text-white text-xl sm:text-2xl font-bold tracking-tight relative z-10 text-center drop-shadow-sm">
                Professional, High-Quality Edits
              </h3>
            </motion.div>

            {/* BOTTOM 2-COLUMN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">

              {/* Middle Column — Platform Icons Card with Infinite Vertical Motion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl bg-white border border-black/[0.08] p-6 shadow-2xs flex flex-col justify-between relative overflow-hidden min-h-[380px]"
              >
                {/* Vertical Stadium Capsule Pills Container with Continuous Vertical Motion */}
                <div className="relative h-56 w-full flex justify-center items-center overflow-hidden">
                  
                  {/* Subtle fade gradient at top and bottom */}
                  <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white to-transparent z-20 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />

                  {/* 3 Column Animated Grid */}
                  <div className="relative z-10 w-full max-w-[220px] grid grid-cols-3 gap-x-3 items-center justify-items-center">
                    
                    {/* Column 1 — Moving UP */}
                    <motion.div
                      animate={{ y: [0, -222] }}
                      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                      className="flex flex-col gap-3.5 items-center shrink-0"
                    >
                      {/* LinkedIn */}
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs hover:bg-[#EAEAEA] transition-colors shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                      </div>
                      {/* Instagram */}
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs hover:bg-[#EAEAEA] transition-colors shrink-0">
                        <svg className="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                      </div>
                      {/* TikTok */}
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs hover:bg-[#EAEAEA] transition-colors shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.85 2.895 2.895 0 0 1-2.894-2.893 2.895 2.895 0 0 1 2.894-2.894c.328 0 .64.053.931.15V9.407a6.282 6.282 0 0 0-.931-.07 6.338 6.338 0 0 0-6.333 6.336 6.338 6.338 0 0 0 6.333 6.336 6.337 6.337 0 0 0 6.334-6.336V9.083a8.163 8.163 0 0 0 4.787 1.503V7.143a4.793 4.793 0 0 1-1.002-.457z"/></svg>
                      </div>
                      {/* Duplicate for seamless loop */}
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                      </div>
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs shrink-0">
                        <svg className="w-5 h-5 fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                      </div>
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.85 2.895 2.895 0 0 1-2.894-2.893 2.895 2.895 0 0 1 2.894-2.894c.328 0 .64.053.931.15V9.407a6.282 6.282 0 0 0-.931-.07 6.338 6.338 0 0 0-6.333 6.336 6.338 6.338 0 0 0 6.333 6.336 6.337 6.337 0 0 0 6.334-6.336V9.083a8.163 8.163 0 0 0 4.787 1.503V7.143a4.793 4.793 0 0 1-1.002-.457z"/></svg>
                      </div>
                    </motion.div>

                    {/* Column 2 — Moving DOWN */}
                    <motion.div
                      animate={{ y: [-222, 0] }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                      className="flex flex-col gap-3.5 items-center shrink-0"
                    >
                      {/* Facebook */}
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs hover:bg-[#EAEAEA] transition-colors shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </div>
                      {/* Snapchat */}
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs hover:bg-[#EAEAEA] transition-colors shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.164c-3.712 0-5.748 2.656-5.748 5.253 0 .972.316 2.052.793 2.76.108.161.146.286.082.467-.091.258-.519 1.564-.672 1.935-.069.167-.19.231-.383.146-.665-.292-1.423-.46-2.128-.46-.628 0-1.127.135-1.411.385-.291.256-.251.651.106 1.05 1.034 1.156 2.502 1.637 3.864 1.637.288 0 .584-.022.883-.069.238-.037.404.09.479.324.238.742.664 1.932 1.144 2.825.263.489.658.857 1.189.967.653.135 1.272-.119 1.902-.387.671-.285 1.365-.58 2.081-.58s1.41.295 2.081.58c.63.268 1.249.522 1.902.387.531-.11.926-.478 1.189-.967.48-.893.906-2.083 1.144-2.825.075-.234.241-.361.479-.324.299.047.595.069.883.069 1.362 0 2.83-.481 3.864-1.637.357-.399.397-.794.106-1.05-.284-.25-.783-.385-1.411-.385-.705 0-1.463.168-2.128.46-.193.085-.314.021-.383-.146-.153-.371-.581-1.677-.672-1.935-.064-.181-.026-.306.082-.467.477-.708.793-1.788.793-2.760 0-2.597-2.036-5.253-5.748-5.253z"/></svg>
                      </div>
                      {/* YouTube */}
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs hover:bg-[#EAEAEA] transition-colors shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      </div>
                      {/* Duplicate for seamless loop */}
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </div>
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.164c-3.712 0-5.748 2.656-5.748 5.253 0 .972.316 2.052.793 2.76.108.161.146.286.082.467-.091.258-.519 1.564-.672 1.935-.069.167-.19.231-.383.146-.665-.292-1.423-.46-2.128-.46-.628 0-1.127.135-1.411.385-.291.256-.251.651.106 1.05 1.034 1.156 2.502 1.637 3.864 1.637.288 0 .584-.022.883-.069.238-.037.404.09.479.324.238.742.664 1.932 1.144 2.825.263.489.658.857 1.189.967.653.135 1.272-.119 1.902-.387.671-.285 1.365-.58 2.081-.58s1.41.295 2.081.58c.63.268 1.249.522 1.902.387.531-.11.926-.478 1.189-.967.48-.893.906-2.083 1.144-2.825.075-.234.241-.361.479-.324.299.047.595.069.883.069 1.362 0 2.83-.481 3.864-1.637.357-.399.397-.794.106-1.05-.284-.25-.783-.385-1.411-.385-.705 0-1.463.168-2.128.46-.193.085-.314.021-.383-.146-.153-.371-.581-1.677-.672-1.935-.064-.181-.026-.306.082-.467.477-.708.793-1.788.793-2.760 0-2.597-2.036-5.253-5.748-5.253z"/></svg>
                      </div>
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      </div>
                    </motion.div>

                    {/* Column 3 — Moving UP */}
                    <motion.div
                      animate={{ y: [0, -222] }}
                      transition={{ duration: 13, repeat: Infinity, ease: 'linear' }}
                      className="flex flex-col gap-3.5 items-center shrink-0"
                    >
                      {/* Vimeo */}
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs hover:bg-[#EAEAEA] transition-colors shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22.4 7.16c-.09 2.05-1.55 4.86-4.37 8.43-2.92 3.73-5.39 5.6-7.41 5.6-1.25 0-2.31-.77-3.18-2.31L4.85 9.77C4.19 7.42 3.46 6.25 2.65 6.25c-.17 0-.78.36-1.83 1.09L0 6.13c1.17-1.03 2.33-2.07 3.48-3.11 1.57-1.36 2.74-2.08 3.51-2.16 1.83-.17 2.96.99 3.39 3.48.47 2.67.79 4.33.96 4.97.51 2.32 1.07 3.48 1.68 3.48.48 0 1.2-.77 2.16-2.31.96-1.54 1.48-2.67 1.56-3.39.17-1.21-.34-1.81-1.52-1.81-.56 0-1.15.12-1.77.37 1.15-3.77 3.35-5.54 6.6-5.31 2.42.17 3.53 1.45 3.35 3.82z"/></svg>
                      </div>
                      {/* TikTok */}
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs hover:bg-[#EAEAEA] transition-colors shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.85 2.895 2.895 0 0 1-2.894-2.893 2.895 2.895 0 0 1 2.894-2.894c.328 0 .64.053.931.15V9.407a6.282 6.282 0 0 0-.931-.07 6.338 6.338 0 0 0-6.333 6.336 6.338 6.338 0 0 0 6.333 6.336 6.337 6.337 0 0 0 6.334-6.336V9.083a8.163 8.163 0 0 0 4.787 1.503V7.143a4.793 4.793 0 0 1-1.002-.457z"/></svg>
                      </div>
                      {/* Substack S */}
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs hover:bg-[#EAEAEA] transition-colors shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22.539 8.242H1.461V5.406h21.078v2.836zM1.461 10.812V24L12 18.11 22.539 24V10.812H1.461zM22.539 0H1.461v2.836h21.078V0z"/></svg>
                      </div>
                      {/* Duplicate for seamless loop */}
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22.4 7.16c-.09 2.05-1.55 4.86-4.37 8.43-2.92 3.73-5.39 5.6-7.41 5.6-1.25 0-2.31-.77-3.18-2.31L4.85 9.77C4.19 7.42 3.46 6.25 2.65 6.25c-.17 0-.78.36-1.83 1.09L0 6.13c1.17-1.03 2.33-2.07 3.48-3.11 1.57-1.36 2.74-2.08 3.51-2.16 1.83-.17 2.96.99 3.39 3.48.47 2.67.79 4.33.96 4.97.51 2.32 1.07 3.48 1.68 3.48.48 0 1.2-.77 2.16-2.31.96-1.54 1.48-2.67 1.56-3.39.17-1.21-.34-1.81-1.52-1.81-.56 0-1.15.12-1.77.37 1.15-3.77 3.35-5.54 6.6-5.31 2.42.17 3.53 1.45 3.35 3.82z"/></svg>
                      </div>
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.85 2.895 2.895 0 0 1-2.894-2.893 2.895 2.895 0 0 1 2.894-2.894c.328 0 .64.053.931.15V9.407a6.282 6.282 0 0 0-.931-.07 6.338 6.338 0 0 0-6.333 6.336 6.338 6.338 0 0 0 6.333 6.336 6.337 6.337 0 0 0 6.334-6.336V9.083a8.163 8.163 0 0 0 4.787 1.503V7.143a4.793 4.793 0 0 1-1.002-.457z"/></svg>
                      </div>
                      <div className="w-[52px] h-[60px] rounded-[20px] bg-[#F2F2F2] flex items-center justify-center text-black shadow-2xs shrink-0">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22.539 8.242H1.461V5.406h21.078v2.836zM1.461 10.812V24L12 18.11 22.539 24V10.812H1.461zM22.539 0H1.461v2.836h21.078V0z"/></svg>
                      </div>
                    </motion.div>

                  </div>

                </div>

                <div className="text-center pt-2 relative z-20">
                  <h4 className="text-xl font-bold text-[#111111] mb-2 leading-tight">
                    Optimized for Every<br />Platform, Every Format
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-[240px] mx-auto">
                    Every video is adapted to fit platform, format, and audience it's made.
                  </p>
                </div>
              </motion.div>

              {/* Right Column — Trusted by + Quick Turnaround */}
              <div className="flex flex-col gap-4">

                {/* Trusted by card — Compact 3D Cylindrical Avatar Motion */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="rounded-3xl bg-white border border-black/[0.08] p-6 shadow-2xs flex-1 flex flex-col items-center justify-between text-center overflow-hidden min-h-[220px]"
                >
                  {/* Compact Avatars Container (Strict Height & Overflow Contained) */}
                  <div className="relative w-full h-24 sm:h-28 flex items-center justify-center my-1 overflow-hidden [perspective:800px]">
                    
                    {/* Avatar 1 — Woman Profile (Small Left Capsule) */}
                    <motion.div
                      animate={{
                        x: [-50, 0, 50, 0, -50],
                        scale: [0.85, 1.05, 0.85, 0.7, 0.85],
                        rotateY: [18, 0, -18, 0, 18],
                        opacity: [0.85, 1, 0.85, 0.5, 0.85],
                        zIndex: [20, 30, 20, 10, 20],
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute w-10 h-14 sm:w-11 sm:h-15 rounded-full overflow-hidden shadow-md border-2 border-white bg-zinc-200 shrink-0"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                        alt="Creator"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    {/* Avatar 2 — Man Green/Yellow Bg (Small Center Capsule) */}
                    <motion.div
                      animate={{
                        x: [0, 50, 0, -50, 0],
                        scale: [1.05, 0.85, 0.7, 0.85, 1.05],
                        rotateY: [0, -18, 0, 18, 0],
                        opacity: [1, 0.85, 0.5, 0.85, 1],
                        zIndex: [30, 20, 10, 20, 30],
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute w-10 h-14 sm:w-11 sm:h-15 rounded-full overflow-hidden shadow-lg border-2 border-white bg-emerald-500 shrink-0"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                        alt="Creator"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    {/* Avatar 3 — Man Mustache (Small Right Capsule) */}
                    <motion.div
                      animate={{
                        x: [50, 0, -50, 0, 50],
                        scale: [0.85, 0.7, 0.85, 1.05, 0.85],
                        rotateY: [-18, 0, 18, 0, -18],
                        opacity: [0.85, 0.5, 0.85, 1, 0.85],
                        zIndex: [20, 10, 20, 30, 20],
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute w-10 h-14 sm:w-11 sm:h-15 rounded-full overflow-hidden shadow-md border-2 border-white bg-zinc-200 shrink-0"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                        alt="Creator"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    {/* Avatar 4 — Man Green Shirt (Small Back Capsule) */}
                    <motion.div
                      animate={{
                        x: [0, -50, 0, 50, 0],
                        scale: [0.7, 0.85, 1.05, 0.85, 0.7],
                        rotateY: [0, 18, 0, -18, 0],
                        opacity: [0.5, 0.85, 1, 0.85, 0.5],
                        zIndex: [10, 20, 30, 20, 10],
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute w-9 h-13 sm:w-10 sm:h-14 rounded-full overflow-hidden shadow-sm border-2 border-white bg-lime-400 shrink-0"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80"
                        alt="Creator"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </div>

                  {/* Clean Heading Below — Completely Separated */}
                  <h4 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight leading-tight pt-1">
                    Trusted by 100+<br />Creators & Brands
                  </h4>
                </motion.div>

                {/* Unlimited Revisions card — Clean Aligned */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="rounded-3xl bg-[#0B0B0B] p-6 shadow-2xs flex flex-col justify-center overflow-hidden"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="w-4 h-4 text-white shrink-0" />
                    <span className="text-white font-bold text-base">Unlimited Revisions</span>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Every detail is carefully refined to ensure your video meets expectations.
                  </p>
                </motion.div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
