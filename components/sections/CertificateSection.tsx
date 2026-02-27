"use client"
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTheme } from 'next-themes'
import SectionWrapper from './SectionWrapper'

type FilterType = 'all' | 'certificate' | 'achievement'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
}

// Polaroid-style rotations for achievements
const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2']

// Pin SVG component
function PinSVG({ color = '#c2410c' }: { color?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="10" r="7" fill={color} stroke="#222" strokeWidth="2" />
      <rect x="14.5" y="16" width="3" height="12" rx="1.5" fill="#222" />
    </svg>
  )
}

export default function CertificateSection() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mixedItems, setMixedItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const certRes = await fetch('/api/certificates')
        let certData = await certRes.json()
        certData = Array.isArray(certData) ? certData : certData.certificates || []
        certData.forEach((c: any) => { c._itemType = 'certificate' })
        const achRes = await fetch('/api/achievements')
        let achData = await achRes.json()
        achData = Array.isArray(achData) ? achData : achData.achievements || []
        achData.forEach((a: any) => { a._itemType = 'achievement' })
        const allItems = [...certData, ...achData].sort((a: any, b: any) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        setMixedItems(allItems)
      } catch (e) {
        setMixedItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredItems = mixedItems.filter((item) => {
    if (activeFilter === 'all') return true
    return item._itemType === activeFilter
  })

  const openModal = (item: any) => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedItem(null)
  }

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Certificates', value: 'certificate' },
    { label: 'Achievements', value: 'achievement' },
  ]

  const isDark = mounted ? theme === 'dark' : true

  return (
    <SectionWrapper
      id="certificates"
      className="min-h-screen w-full bg-background text-foreground flex flex-col items-center py-12 md:py-20 relative overflow-hidden"
    >
      {/* Pinboard background with crosshatch pattern */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: isDark
            ? 'repeating-linear-gradient(135deg, #23272f 0 2px, transparent 2px 40px), repeating-linear-gradient(45deg, #23272f 0 2px, transparent 2px 40px), #18181b'
            : 'repeating-linear-gradient(135deg, #e2c290 0 2px, transparent 2px 40px), repeating-linear-gradient(45deg, #e2c290 0 2px, transparent 2px 40px), #f5e6c5',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      >
        {/* Randomly placed emojis */}
        <span style={{ position: 'absolute', top: '12%', left: '8%', fontSize: 32, pointerEvents: 'none' }}>&#127881;</span>
        <span style={{ position: 'absolute', top: '30%', left: '80%', fontSize: 28, pointerEvents: 'none' }}>&#127942;</span>
        <span style={{ position: 'absolute', top: '65%', left: '15%', fontSize: 30, pointerEvents: 'none' }}>&#128204;</span>
        <span style={{ position: 'absolute', top: '75%', left: '70%', fontSize: 34, pointerEvents: 'none' }}>&#10024;</span>
        <span style={{ position: 'absolute', top: '50%', left: '45%', fontSize: 30, pointerEvents: 'none' }}>&#127891;</span>
      </div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading tracking-tight mb-6 md:mb-8 z-10 text-center">
        Achievement Board
      </h2>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 z-10">
        {filters.map((filter) => (
          <motion.button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full text-sm font-heading font-medium transition-all ${
              activeFilter === filter.value
                ? 'bg-electric-500 text-white shadow-lg glow-purple'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            {filter.label}
          </motion.button>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-3xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <img
                src={selectedItem.image || ''}
                alt={selectedItem.title || selectedItem.issuer || 'Item'}
                className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border-4 border-white dark:border-zinc-700"
              />
              <div className="p-4 text-center w-full">
                <h3 className="font-heading font-bold text-lg text-foreground">
                  {selectedItem.title || selectedItem.issuer || ''}
                </h3>
                {selectedItem.description && (
                  <p className="text-sm text-muted-foreground mt-1 font-body">{selectedItem.description}</p>
                )}
                {selectedItem.link && (
                  <a
                    href={selectedItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-electric-500 hover:underline text-sm mt-2 inline-block font-heading"
                  >
                    View Certificate &rarr;
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-lg text-muted-foreground py-20 z-10">Loading achievements and certificates...</div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={container}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full max-w-7xl px-4 z-10 justify-items-center"
          >
            {filteredItems.map((cardItem, idx) => (
              cardItem._itemType === 'certificate' ? (
                /* Certificate: Wooden frame with pin */
                <motion.div
                  key={cardItem._id || idx}
                  variants={item}
                  whileHover={{ scale: 1.04, y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => openModal(cardItem)}
                  className="relative flex flex-col items-center w-full max-w-xs sm:max-w-sm pb-4 pt-6 md:pb-10 md:pt-12 px-1 md:px-4 cursor-pointer"
                  style={{ minHeight: 260, maxWidth: 340 }}
                >
                  {/* Pin at top */}
                  <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-20">
                    <PinSVG color={isDark ? '#c2410c' : '#FFCC00'} />
                  </div>
                  {/* Wooden frame */}
                  <div
                    className="flex items-center justify-center shadow-xl border-4"
                    style={{
                      width: '100%',
                      maxWidth: 320,
                      minHeight: 180,
                      background: isDark
                        ? 'repeating-linear-gradient(135deg, #7c4a03 0 8px, #a97c50 8px 16px, #7c4a03 16px 24px), #5a3a1b'
                        : 'repeating-linear-gradient(135deg, #e2b07a 0 8px, #c68642 8px 16px, #e2b07a 16px 24px), #deb887',
                      border: isDark ? '4px solid #a97c50' : '4px solid #c68642',
                    }}
                  >
                    <div
                      className={`border-2 ${isDark ? 'border-zinc-700' : 'border-zinc-200'} bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden`}
                      style={{ width: '95%', height: 160, boxShadow: '0 2px 16px rgba(0,0,0,0.18)' }}
                    >
                      <img
                        src={cardItem.image}
                        alt={cardItem.issuer || 'Certificate'}
                        className="object-cover border w-full h-full"
                        style={{ display: 'block', background: '#fff' }}
                      />
                    </div>
                  </div>
                  {/* Issuer and link below */}
                  <div className="w-full text-center mt-4">
                    <div className="font-bold text-base sm:text-lg md:text-xl font-heading mb-2 text-foreground">
                      {cardItem.issuer || ''}
                    </div>
                    {cardItem.link && (
                      <a href={cardItem.link} target="_blank" rel="noopener noreferrer" className="text-electric-500 hover:underline text-xs sm:text-sm mt-2 font-heading">
                        View Certificate &rarr;
                      </a>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* Achievement: Polaroid card with rotation and pin */
                <motion.div
                  key={cardItem._id || idx}
                  variants={item}
                  whileHover={{ scale: 1.05, rotate: 0, y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => openModal(cardItem)}
                  className={`relative rounded-2xl flex flex-col items-center w-full max-w-xs sm:max-w-lg pb-6 pt-8 md:pb-8 md:pt-10 px-2 md:px-6 ${rotations[idx % rotations.length]} cursor-pointer transition-shadow ${
                    isDark
                      ? 'bg-zinc-800 border-zinc-700 shadow-[0_4px_32px_0_rgba(0,0,0,0.7),0_1.5px_6px_0_rgba(0,0,0,0.5)]'
                      : 'bg-white border-zinc-200 shadow-2xl'
                  }`}
                  style={{ minHeight: 220, borderWidth: 2, borderStyle: 'solid' }}
                >
                  {/* Pin SVG at the top center */}
                  <div className="absolute -top-6 md:-top-5 left-1/2 -translate-x-1/2 z-20">
                    <PinSVG color={isDark ? '#e2c290' : '#c2410c'} />
                  </div>
                  {/* Achievement image polaroid style */}
                  <div
                    className={`w-full flex items-center justify-center rounded-xl border overflow-hidden ${
                      isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-100 border-zinc-200 shadow'
                    }`}
                    style={{ minHeight: 80 }}
                  >
                    <img
                      src={cardItem.image}
                      alt={cardItem.title}
                      className="w-full h-auto max-h-48 object-contain rounded-lg"
                      style={{ display: 'block' }}
                    />
                  </div>
                  {/* Title and description below image */}
                  <div className="w-full text-center mt-4">
                    <div className="font-bold text-base sm:text-lg md:text-xl font-heading mb-2 text-foreground">
                      {cardItem.title}
                    </div>
                    {cardItem.description && (
                      <div className="text-xs sm:text-base font-body mb-1 text-muted-foreground">
                        {cardItem.description}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </SectionWrapper>
  )
}
