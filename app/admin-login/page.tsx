'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const secret = localStorage.getItem('adminSecret')
      if (secret !== 'kamlesh') {
        router.replace('/')
      }
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Hardcoded credentials
    if (form.username === 'admin' && form.password === 'admin123') {
      setSuccess(true)
      setError('')
    } else {
      setError('Invalid username or password')
      setSuccess(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`} style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold font-inter tracking-tight mb-8 text-center" style={{ color: theme === 'dark' ? '#fff' : '#111' }}>Admin Login</h1>
        {success ? (
          <div className="text-center text-cyan-600 dark:text-cyan-400 text-lg font-semibold py-12">Login successful! Welcome, admin.</div>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-semibold mb-1 font-inter">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-black dark:text-white font-inter focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-1 font-inter">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-black dark:text-white font-inter focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center font-semibold">{error}</div>}
            <button
              type="submit"
              className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-full text-base shadow-lg transition font-inter"
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  )
} 