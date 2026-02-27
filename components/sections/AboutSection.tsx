"use client"
import React, { useMemo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import ParticleComponent from '../../vercel-logo-particles'
import SectionWrapper from './SectionWrapper'

export default function AboutSection() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Inject Orbitron font if not present
  useEffect(() => {
    if (!document.getElementById('orbitron-font')) {
      const link = document.createElement('link')
      link.id = 'orbitron-font'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  const iconSize = useMemo(() => {
    if (typeof window !== 'undefined') {
      return Math.min(window.innerHeight * 0.6, window.innerWidth * 0.25)
    }
    return 240
  }, [])

  const [skills, setSkills] = useState<any[]>([])
  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch('/api/skills')
        let data = await res.json()
        data = Array.isArray(data) ? data : data.skills || []
        setSkills(data)
      } catch (e) {
        setSkills([])
      }
    }
    fetchSkills()
  }, [])

  const currentTheme = mounted ? theme : 'dark'

  return (
    <SectionWrapper
      id="about"
      className="min-h-screen w-full bg-background text-foreground flex items-center"
    >
      <div className="w-full flex flex-col md:flex-row items-center md:items-center px-4 sm:px-6 md:px-16 py-10 md:py-16 gap-8">
        {/* Left: Particle Image Avatar */}
        <div className="flex-shrink-0 flex items-center justify-center w-full md:w-[55%] h-[40vh] md:h-[60vh] min-w-[120px] min-h-[120px] bg-transparent mb-8 md:mb-0">
          <ParticleComponent
            theme={currentTheme as 'dark' | 'light'}
            type="image"
            imageSrc="/icon.png"
            size={iconSize}
          />
        </div>
        {/* Right: Text Content */}
        <div className="flex-1 flex flex-col justify-center items-center md:items-start gap-6 w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 font-heading tracking-tight text-center md:text-left">About Me</h2>
          <h3 className="text-base sm:text-lg md:text-xl text-electric-500 dark:text-electric-400 font-semibold mb-2 font-body text-center md:text-left">Software Developer</h3>
          <p className="mb-2 max-w-2xl text-sm sm:text-base md:text-lg font-body text-center md:text-left text-muted-foreground">
            I craft beautiful, performant, and accessible web experiences with a focus on delightful UI, animation, and modern technologies. My mission is to bridge design and engineering, making the web more engaging and inclusive for everyone.
          </p>
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="flex-1">
              <div className="font-semibold mb-3 font-heading text-sm uppercase tracking-wider text-muted-foreground">Tools & Technologies</div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: any) => (
                  <motion.span
                    key={skill._id || skill.name}
                    whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(139,92,246,0.4)" }}
                    className="px-3 py-1.5 rounded-full text-xs font-heading font-medium bg-electric-500/10 text-electric-400 dark:text-electric-300 border border-electric-500/20 cursor-default transition-colors hover:bg-electric-500/20 hover:text-electric-200"
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 w-full flex justify-center md:justify-start">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const hireMeSection = document.getElementById('hire-me')
                if (hireMeSection) {
                  hireMeSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="inline-block bg-electric-500 hover:bg-electric-600 text-white font-bold py-3 px-8 rounded-full text-base shadow-lg transition font-heading glow-purple"
            >
              Contact Me
            </motion.button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
