import React from 'react'
import Component from '../vercel-logo-particles'

const floatingImages = [
  { src: '/placeholder-logo.png', alt: 'Obj3', className: 'bottom-24 left-32 w-14 animate-float-fast' },
  { src: '/placeholder-user.jpg', alt: 'Obj6', className: 'top-1/3 right-24 w-10 animate-float-fast' },
  { src: '/placeholder-logo.png', alt: 'Obj7', className: 'bottom-1/4 left-40 w-12 animate-float-slow' },
]

interface HeroSectionProps {
  theme: 'dark' | 'light'
  setTheme: (t: 'dark' | 'light') => void
}

export default function HeroSection({ theme, setTheme }: HeroSectionProps) {
  const handleToggle = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  // Replace the user icon with steve.png
  const updatedFloatingImages = floatingImages.map(img =>
    img.alt === 'Obj6'
      ? { ...img, src: '/steve.png', alt: 'Steve' }
      : img
  )

  return (
    <section className={`relative w-full h-dvh flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'} overflow-hidden`}>
      {/* Download Resume Floating Icon (replaces first floating image) */}
      <a
        href="/resume.pdf"
        download
        className="absolute top-24 left-24 w-16 h-16 rounded-xl z-20 flex items-center justify-center animate-float-slow hover:scale-110 transition text-3xl bg-white/80 dark:bg-black/80 shadow-xl border border-gray-200 dark:border-gray-800"
        style={{ cursor: 'pointer' }}
        aria-label="Download Resume"
        title="Download Resume"
      >
        {/* Download SVG icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-9 8h10" /></svg>
      </a>
      {/* GitHub Floating Icon (bottom left) */}
      <a
        href="https://github.com/rayyanshaikh123"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute left-16 top-1/2 w-12 h-12 rounded-xl z-20 flex items-center justify-center animate-float-reverse hover:scale-110 transition text-3xl bg-white/80 dark:bg-black/80 shadow-xl border border-gray-200 dark:border-gray-800"
        style={{ cursor: 'pointer', transform: 'translateY(-50%)' }}
        aria-label="GitHub Profile"
        title="GitHub Profile"
      >
        {/* GitHub SVG icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2Z"/>
        </svg>
      </a>
      {/* Eventify Floating Icon (bottom right, replaces Acme Inc.) */}
      <a
        href="https://eventify-blush.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-24 right-1/3 w-16 h-16 z-20 flex items-center justify-center animate-float-reverse hover:scale-110 transition"
        style={{ cursor: 'pointer' }}
        aria-label="Eventify"
        title="Eventify"
      >
        <img src="/eventify.png" alt="Eventify" className="w-14 h-14 object-contain" />
      </a>
      {/* MedSync Floating Icon (bottom right, replaces Acme Inc.) */}
      <a
        href="https://med-sync-nine.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-32 right-24 w-24 h-24 z-20 flex items-center justify-center animate-float-slow hover:scale-110 transition"
        style={{ cursor: 'pointer' }}
        aria-label="MedSync"
        title="MedSync"
      >
        <img src="/medsync.png" alt="MedSync" className="w-20 h-20 object-contain" />
      </a>
      {/* Grid Background - more visible */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage:
          theme === 'dark'
            ? 'linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.10) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      {/* Small tag at the very top center, theme-aware */}
      <span
        className={`absolute left-1/2 top-8 -translate-x-1/2 z-20 px-3 py-1 rounded-full text-xs font-semibold shadow-lg tracking-widest uppercase select-none pointer-events-none
          ${theme === 'dark' ? 'bg-cyan-500 text-white' : 'bg-cyan-100 text-cyan-700'}`}
      >
        Portfolio
      </span>
      {/* Particle Animation as the main centerpiece */}
      <Component theme={theme} />
      {/* Many Small Floating Images */}
      {updatedFloatingImages.map((img, i) => {
        // Make Steve icon clickable and scroll to #about
        if (img.alt === 'Steve') {
          return (
            <img
              key={i}
              src={img.src}
              alt={img.alt}
              className={`floating-corner absolute shadow-2xl z-10 ${img.className}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          )
        }
        return (
          <img
            key={i}
            src={img.src}
            alt={img.alt}
            className={`floating-corner absolute${img.alt === 'Steve' ? '' : ' rounded-xl'} shadow-2xl z-10 dark:invert ${img.className}`}
          />
        )
      })}
      {/* Light/Dark Toggle as a floating object (top right) with emoji, transparent background */}
      <button
        aria-label="Toggle light/dark mode"
        onClick={handleToggle}
        className="absolute top-24 right-24 w-14 h-14 rounded-xl z-20 flex items-center justify-center animate-float-fast hover:scale-110 transition text-3xl border-none bg-transparent shadow-none"
        style={{ cursor: 'pointer', background: 'transparent' }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      {/* Floating animation keyframes */}
      <style jsx>{`
        @keyframes float-slow {
          0% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(-2deg); }
        }
        @keyframes float-reverse {
          0% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(12px) rotate(-2deg); }
          100% { transform: translateY(0px) rotate(2deg); }
        }
        @keyframes float-fast {
          0% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(-1deg); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 7s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
} 