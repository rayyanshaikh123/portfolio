"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import SectionWrapper from './SectionWrapper'

export default function HireMeSection() {
  const { theme } = useTheme()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to send message')
      setSubmitted(true)
    } catch (err) {
      setError('Something went wrong. Please try again later.')
    }
  }

  return (
    <SectionWrapper
      id="hire-me"
      className="min-h-[60vh] w-full bg-background text-foreground flex flex-col items-center py-12 md:py-20"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading tracking-tight mb-8 md:mb-10">
        Hire Me
      </h2>
      <div className="w-full max-w-xs sm:max-w-md rounded-2xl p-4 sm:p-8 glass-card glow-purple">
        {submitted ? (
          <div className="text-center text-electric-500 dark:text-electric-400 text-lg font-semibold py-12 font-heading">
            Thank you for reaching out! I will get back to you soon.
          </div>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-1 font-heading text-foreground">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-foreground font-body focus:outline-none focus:ring-2 focus:ring-electric-500 placeholder:text-muted-foreground"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1 font-heading text-foreground">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-foreground font-body focus:outline-none focus:ring-2 focus:ring-electric-500 placeholder:text-muted-foreground"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-1 font-heading text-foreground">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-foreground font-body focus:outline-none focus:ring-2 focus:ring-electric-500 resize-none placeholder:text-muted-foreground"
                placeholder="How can I help you?"
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-2 bg-electric-500 hover:bg-electric-600 text-white font-bold py-3 px-8 rounded-full text-base shadow-lg transition font-heading w-full sm:w-auto glow-purple"
            >
              Send Message
            </motion.button>
          </form>
        )}
      </div>
    </SectionWrapper>
  )
}
