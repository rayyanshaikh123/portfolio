"use client"
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BentoProjectCard from '../cards/BentoProjectCard'
import SectionWrapper from './SectionWrapper'

// Bento grid size patterns cycling for visual variety
const bentoSizes = [
  'col-span-2 row-span-1',  // wide
  'col-span-1 row-span-1',  // normal
  'col-span-1 row-span-2',  // tall
  'col-span-2 row-span-2',  // large
  'col-span-1 row-span-1',  // normal
  'col-span-1 row-span-1',  // normal
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

export default function ProjectSection() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const projectsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true)
      try {
        const res = await fetch('/api/projects')
        const data = await res.json()
        setProjects(data)
      } catch (e) {
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const displayedProjects = showAll ? projects : projects.slice(0, 6)

  const handleToggle = () => {
    if (showAll && projectsRef.current) {
      projectsRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    setShowAll((prev) => !prev)
  }

  return (
    <SectionWrapper
      id="projects"
      className="min-h-screen w-full bg-background text-foreground flex flex-col items-center py-12 md:py-20"
    >
      <div ref={projectsRef} className="flex w-full max-w-[98vw] md:max-w-6xl justify-between items-center px-2 sm:px-4 mb-8 md:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading tracking-tight w-full text-center md:text-left">
          Recent projects
        </h2>
        {projects.length > 6 && (
          <motion.button
            onClick={handleToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="text-electric-500 font-semibold flex items-center gap-1 hover:underline text-sm sm:text-base md:text-lg focus:outline-none font-heading shrink-0"
          >
            {showAll ? 'Show Less' : 'View All'} <span className="text-xl">{showAll ? '\u2191' : '\u2192'}</span>
          </motion.button>
        )}
      </div>
      {loading ? (
        <div className="text-lg text-muted-foreground py-20">Loading projects...</div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={showAll ? 'all' : 'limited'}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(200px,auto)] gap-4 sm:gap-5 md:gap-6 w-full max-w-[98vw] md:max-w-6xl px-2 sm:px-4"
          >
            {displayedProjects.map((project, idx) => (
              <BentoProjectCard
                key={project._id || idx}
                project={project}
                index={idx}
                spanClass={
                  // On mobile, all cards are same size. On desktop, use bento pattern
                  `${bentoSizes[idx % bentoSizes.length]} max-sm:!col-span-1 max-sm:!row-span-1`
                }
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </SectionWrapper>
  )
}
