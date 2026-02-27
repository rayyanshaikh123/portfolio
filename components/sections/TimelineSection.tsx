"use client"
import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import SectionWrapper from './SectionWrapper'

export default function TimelineSection() {
  const { theme } = useTheme()
  const [timeline, setTimeline] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    async function fetchTimeline() {
      setLoading(true)
      try {
        const res = await fetch('/api/timeline')
        let data = await res.json()
        data = Array.isArray(data) ? data : data.timeline || []
        data.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        setTimeline(data)
      } catch (e) {
        setTimeline([])
      } finally {
        setLoading(false)
      }
    }
    fetchTimeline()
  }, [])

  return (
    <SectionWrapper
      id="timeline"
      className="min-h-screen w-full bg-background text-foreground flex flex-col items-center py-12 md:py-20"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading tracking-tight mb-8 md:mb-10">
        My Journey
      </h2>
      <div className="relative w-full max-w-2xl px-4">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 h-full w-1 bg-gradient-to-b from-electric-400/80 to-electric-600/80 dark:from-electric-600/80 dark:to-electric-400/80 rounded-full" style={{ zIndex: 0 }} />
        <ul className="space-y-12 relative z-10">
          {loading ? (
            <li className="text-center text-lg text-muted-foreground py-20">Loading timeline...</li>
          ) : timeline.length === 0 ? (
            <li className="text-center text-lg text-muted-foreground py-20">No timeline entries yet.</li>
          ) : (
            timeline.map((item, idx) => (
              <li key={item._id || idx} className="flex items-start relative">
                {/* Icon */}
                <div className="flex flex-col items-center mr-8">
                  <span className="text-3xl rounded-full border-4 border-border bg-card shadow-lg p-2" style={{ zIndex: 2 }}>{item.icon}</span>
                  {idx < timeline.length - 1 && (
                    <span className="flex-1 w-1 bg-electric-400/40 dark:bg-electric-700/40" style={{ minHeight: 32 }} />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg font-bold font-heading">{item.title}</span>
                    <span className="text-xs font-semibold text-electric-600 dark:text-electric-400 bg-electric-100 dark:bg-electric-900 px-2 py-0.5 rounded-full ml-2">{item.year}</span>
                  </div>
                  <div className="text-base opacity-80 font-body">{item.description}</div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </SectionWrapper>
  )
}
