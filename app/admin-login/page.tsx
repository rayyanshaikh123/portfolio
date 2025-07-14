'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    // Call API route for login
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (data.success) {
      setSuccess(true)
      setError('')
      localStorage.setItem('adminToken', data.token)
      router.push('/admin/dashboard')
    } else {
      setError(data.message || 'Invalid username or password')
      setSuccess(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center`} style={{ background: theme === 'dark' ? '#000' : '#fff', color: theme === 'dark' ? '#fff' : '#000', fontFamily: 'Orbitron, Arial, sans-serif' }}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl p-8" style={{ background: theme === 'dark' ? '#18181b' : '#fff' }}>
        <h1 className="text-3xl md:text-4xl font-extrabold font-inter tracking-tight mb-8 text-center" style={{ color: theme === 'dark' ? '#fff' : '#111' }}>Admin Login</h1>
        {success ? (
          <div className="text-center text-cyan-600 dark:text-cyan-400 text-lg font-semibold py-12">Login successful! Welcome, admin.</div>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1 font-inter" style={{ color: theme === 'dark' ? '#e5e7eb' : '#000' }}>Username</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border font-inter focus:outline-none focus:ring-2 focus:ring-cyan-400"
                style={{
                  borderColor: theme === 'dark' ? '#3f3f46' : '#d4d4d8',
                  backgroundColor: theme === 'dark' ? '#27272a' : '#f4f4f5',
                  color: theme === 'dark' ? '#fff' : '#000',
                }}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-semibold mb-1 font-inter" style={{ color: theme === 'dark' ? '#e5e7eb' : '#000' }}>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border font-inter focus:outline-none focus:ring-2 focus:ring-cyan-400 pr-10"
                style={{
                  borderColor: theme === 'dark' ? '#3f3f46' : '#d4d4d8',
                  backgroundColor: theme === 'dark' ? '#27272a' : '#f4f4f5',
                  color: theme === 'dark' ? '#fff' : '#000',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-2 top-9 -translate-y-1/2 text-zinc-400 hover:text-cyan-600"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  // Eye-off SVG
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5 0-9.27-3.11-10.74-7.5a10.05 10.05 0 0 1 3.07-4.51m3.11-2.01A9.97 9.97 0 0 1 12 4c5 0 9.27 3.11 10.74 7.5a10.02 10.02 0 0 1-2.09 3.32M9.53 9.53A3.5 3.5 0 0 1 12 8.5c1.93 0 3.5 1.57 3.5 3.5 0 .47-.09.92-.26 1.33m-1.21 1.21A3.5 3.5 0 0 1 12 15.5c-1.93 0-3.5-1.57-3.5-3.5 0-.47.09-.92.26-1.33" /><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m3 3 18 18" /></svg>
                ) : (
                  // Eye SVG
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12Z" /><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" /></svg>
                )}
              </button>
            </div>
            {error && <div className="text-red-500 text-sm text-center font-semibold" style={{ color: theme === 'dark' ? '#f87171' : '#dc2626' }}>{error}</div>}
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