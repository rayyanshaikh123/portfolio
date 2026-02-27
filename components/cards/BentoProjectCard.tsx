"use client"
import React from 'react'
import { motion } from 'framer-motion'

interface Project {
  _id?: string
  title: string
  description: string
  techStack?: string[]
  image?: string
  link?: string
}

interface BentoProjectCardProps {
  project: Project
  index: number
  spanClass: string
}

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
}

export default function BentoProjectCard({ project, index, spanClass }: BentoProjectCardProps) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass-card rounded-2xl overflow-hidden group relative hover:glow-purple transition-all duration-500 ${spanClass}`}
      style={{ minHeight: 220 }}
    >
      {/* Image */}
      <div className="w-full h-full absolute inset-0">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-lg font-heading font-bold">
            {project.title}
          </div>
        )}
      </div>

      {/* Gradient overlay - always visible at bottom, full on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      {/* Tech stack chips - top left */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
        {project.techStack?.slice(0, 4).map((tech: string) => (
          <span
            key={tech}
            className="px-2.5 py-0.5 text-[10px] font-heading font-medium rounded-full bg-black/40 backdrop-blur-sm text-white border border-white/10"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Arrow link - top right */}
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-electric-500/80 backdrop-blur-sm text-white hover:bg-electric-500 transition-colors hover:scale-110 shadow-lg"
          aria-label={`View ${project.title}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <h3 className="text-base sm:text-lg font-bold font-heading text-white mb-1 truncate">
          {project.title}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-300 font-body line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:line-clamp-3">
          {project.description}
        </p>
        {/* Mobile: always show description */}
        <p className="text-xs text-zinc-300 font-body line-clamp-2 md:hidden mt-1">
          {project.description}
        </p>
      </div>
    </motion.div>
  )
}
