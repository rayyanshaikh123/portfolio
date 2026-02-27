"use client"
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function TypingText({ text, className }: { text: string; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.p ref={ref} className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: i * 0.015, duration: 0.1 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  )
}
