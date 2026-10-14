'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS, Project } from '@modules/editz/lib/data';
import { Eye, Play, X } from 'lucide-react';

export default function Projects() {
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-12 sm:py-24 lg:py-32 bg-[#FFFDFA] relative overflow-hidden border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <div className="section-badge mb-4">
            <Eye className="w-4 h-4 text-[#E32759]" />
            <span>Projects</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#111111] tracking-tight">
            Results our clients love
          </h2>
        </div>

        {/* PROJECTS PORTRAIT GRID — 6 CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.slice(0, 6).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setActiveProjectModal(project)}
              className="group relative rounded-3xl overflow-hidden aspect-[3/4] bg-black cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
            >
              {project.videoUrl ? (
                <video
                  src={project.videoUrl}
                  poster={project.thumbnail}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                />
              ) : (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* CENTER PLAY BUTTON */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-6 h-6 fill-white translate-x-0.5" />
                </div>
              </div>

              {/* BOTTOM CARD OVERLAY INFO */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-2 pointer-events-none">
                <div className="flex items-center justify-between text-white font-bold text-sm">
                  <span>{project.handle}</span>
                  <span className="flex items-center gap-1 text-xs font-normal text-white/80">
                    <Eye className="w-3.5 h-3.5 text-white/80" />
                    {project.views}
                  </span>
                </div>

                <div className="px-3.5 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white font-medium text-center">
                  {project.metric}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* VIDEO PREVIEW MODAL */}
      <AnimatePresence>
        {activeProjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveProjectModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-3xl bg-black overflow-hidden shadow-2xl"
            >
              <div className="relative aspect-[9/16] max-h-[80vh] mx-auto bg-black flex items-center justify-center">
                <video
                  className="w-full h-full object-cover"
                  src={activeProjectModal.videoUrl || '/video1.mp4'}
                  controls
                  autoPlay
                  playsInline
                />
                <button
                  onClick={() => setActiveProjectModal(null)}
                  className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/80 text-white hover:bg-[#E32759] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 bg-white flex items-center justify-between text-[#111111]">
                <div>
                  <div className="text-xs text-[#E32759] font-bold">{activeProjectModal.handle}</div>
                  <h3 className="text-xl font-bold">{activeProjectModal.title}</h3>
                </div>
                <div className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#FCE7ED] text-[#E32759]">
                  {activeProjectModal.metric}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
