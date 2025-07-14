import React, { useEffect, useState } from 'react'
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

  // Admin dashboard button visibility
  const [showDashboard, setShowDashboard] = useState(false)
  useEffect(() => {
    function checkToken() {
      setShowDashboard(!!localStorage.getItem('adminToken'));
    }
    checkToken();
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  // Replace the user icon with steve.png
  const updatedFloatingImages = floatingImages.map(img =>
    img.alt === 'Obj6'
      ? { ...img, src: '/steve.png', alt: 'Steve' }
      : img
  )

  return (
    <section className={`relative w-full min-h-[80vh] md:h-dvh flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-white'} overflow-hidden`}>
      {/* View Dashboard Floating Button (top right, only if admin) */}
      {showDashboard && (
        <a
          href="/admin/dashboard"
          className="absolute top-2 right-2 md:top-8 md:right-8 z-30 px-3 md:px-5 py-1.5 md:py-2 rounded-lg bg-cyan-600 text-white font-bold shadow-lg hover:bg-cyan-700 transition text-xs md:text-base"
          style={{ textDecoration: 'none' }}
        >
          View Dashboard
        </a>
      )}
      {/* Download Resume Floating Icon (replaces first floating image) */}
      <a
        href="/resume.pdf"
        download
        className="absolute top-12 left-2 md:top-24 md:left-24 w-10 h-10 md:w-16 md:h-16 rounded-xl z-20 flex items-center justify-center animate-float-slow hover:scale-110 transition text-xl md:text-3xl"
        style={{ cursor: 'pointer' }}
        aria-label="Download Resume"
        title="Download Resume"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke={theme === 'dark' ? '#fff' : '#000'}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-9 8h10" /></svg>
      </a>
      {/* CodePen Floating Icon (bottom left) */}
      <a
        href="https://codepen.io/rayyan_shk70"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute left-2 top-1/2 md:left-16 md:top-1/2 w-8 h-8 md:w-12 md:h-12 rounded-xl z-20 flex items-center justify-center animate-float-reverse hover:scale-110 transition text-xl md:text-3xl "
        style={{ cursor: 'pointer', transform: 'translateY(-50%)' }}
        aria-label="CodePen Profile"
        title="CodePen Profile"
      >
        <img
          src={theme === 'dark' ? '/codepen.png' : '/codepen-light.png'}
          alt="CodePen"
          className="w-6 h-6 md:w-8 md:h-8 object-contain"
        />
      </a>
      {/* Eventify Floating Icon (bottom right) */}
      <a
        href="https://eventify-blush.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-16 right-1/4 md:bottom-24 md:right-1/3 w-10 h-10 md:w-16 md:h-16 z-20 flex items-center justify-center animate-float-reverse hover:scale-110 transition"
        style={{ cursor: 'pointer' }}
        aria-label="Eventify"
        title="Eventify"
      >
        <img src="/eventify.png" alt="Eventify" className="w-8 h-8 md:w-14 md:h-14 object-contain" />
      </a>
      {/* MedSync Floating Icon (bottom right) */}
      <a
        href="https://med-sync-nine.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-24 right-2 md:bottom-32 md:right-24 w-12 h-12 md:w-24 md:h-24 z-20 flex items-center justify-center animate-float-slow hover:scale-110 transition"
        style={{ cursor: 'pointer' }}
        aria-label="MedSync"
        title="MedSync"
      >
        <img src="/medsync.png" alt="MedSync" className="w-10 h-10 md:w-20 md:h-20 object-contain" />
      </a>
      {/* Grid Background - more visible */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage:
          theme === 'dark'
            ? 'linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0,0,0,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.10) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />
      {/* Small tag at the very top center, theme-aware */}
      <span
        className={`absolute left-1/2 top-2 md:top-8 -translate-x-1/2 z-20 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow-lg tracking-widest uppercase select-none pointer-events-none
          ${theme === 'dark' ? 'bg-cyan-500 text-white' : 'bg-cyan-100 text-cyan-700'}`}
      >
        Portfolio
        <button
          aria-label="Admin Login"
          onClick={() => {
            const secret = window.prompt('Enter the secret:');
            if (secret === 'kamlesh') {
              localStorage.setItem('adminSecret', 'kamlesh');
              window.location.href = '/admin-login';
            }
          }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            pointerEvents: 'auto',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            zIndex: 30,
          }}
          tabIndex={0}
        />
      </span>
      {/* Particle Animation as the main centerpiece */}
      <div className="w-full flex flex-col items-center justify-center max-w-screen px-2 md:px-0">
        <Component theme={theme} />
      </div>
      {/* Many Small Floating Images */}
      {updatedFloatingImages.map((img, i) => {
        if (img.alt === 'Steve') {
          return (
            <img
              key={i}
              src={img.src}
              alt={img.alt}
              className={`floating-corner absolute shadow-2xl z-10 ${img.className}`}
              style={{ cursor: 'pointer', maxWidth: '14vw', minWidth: 28, maxHeight: '14vw', minHeight: 28 }}
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
            style={{ maxWidth: '14vw', minWidth: 28, maxHeight: '14vw', minHeight: 28 }}
          />
        )
      })}
      {/* Light/Dark Toggle as a floating object (top right) with emoji, transparent background */}
      <button
        aria-label="Toggle light/dark mode"
        onClick={handleToggle}
        className="absolute top-12 right-2 md:top-24 md:right-24 w-8 h-8 md:w-14 md:h-14 rounded-xl z-20 flex items-center justify-center animate-float-fast hover:scale-110 transition text-xl md:text-3xl border-none bg-transparent shadow-none"
        style={{ cursor: 'pointer', background: 'transparent' }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
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