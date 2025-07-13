import React, { useMemo, useEffect } from 'react'
import ParticleComponent from '../vercel-logo-particles'

const coreSkills = [
  'Frontend Development',
  'UI/UX Design',
  'Web Animation',
  'Performance',
  'Accessibility',
  'Responsive Design',
]
const tools = [
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Framer Motion',
  'Figma',
  'Git',
  'Vercel',
]

interface AboutUsProps {
  theme: 'dark' | 'light'
}

// Add ProjectSection component
function ProjectSection({ theme }: { theme: 'dark' | 'light' }) {
  const projects = [
    {
      title: 'Eventify',
      description: 'A modern event management platform with real-time features and beautiful UI.',
      link: 'https://eventify-blush.vercel.app/',
      image: '/eventify.png',
      tags: ['App', 'Technology'],
    },
    {
      title: 'MedSync',
      description: 'Next-gen hospital management ERP for secure, real-time healthcare operations.',
      link: 'https://med-sync-nine.vercel.app/',
      image: '/medsync.png',
      tags: ['Website', 'Services'],
    },
    {
      title: 'Portfolio',
      description: 'This portfolio site, built with React, Next.js, and creative particle effects.',
      link: '#',
      image: '/portfolio.png',
      tags: ['Website', 'Real Estate'],
    },
  ]
  return (
    <section
      id="projects"
      className={`min-h-screen w-full ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} flex flex-col items-center py-20`}
      style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
    >
      <div className="flex w-full max-w-6xl justify-between items-center px-4 mb-10">
        <h2
          className="text-3xl md:text-4xl font-extrabold font-inter tracking-tight"
          style={{
            color: theme === 'dark' ? '#fff' : '#111',
            textShadow: theme === 'dark' ? '0 2px 16px #000, 0 1px 1px #000' : '0 2px 8px #eee',
          }}
        >
          Recent projects
        </h2>
        <a href="#" className="text-orange-500 font-semibold flex items-center gap-1 hover:underline text-base md:text-lg">View All <span className="text-xl">→</span></a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl px-4 justify-center">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="relative rounded-xl flex flex-col items-start p-0 overflow-hidden transition hover:scale-105 max-w-md w-full mx-auto group"
            style={{
              minHeight: 440,
              backgroundColor: theme === 'dark' ? '#021526' : '#fff',
              boxShadow: theme === 'dark'
                ? '0 4px 32px 0 rgba(0,0,0,0.7), 0 1.5px 6px 0 rgba(0,0,0,0.5)'
                : '0 4px 32px 0 rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.08)',
              border: `1.5px solid ${theme === 'dark' ? '#23344d' : '#e5e7eb'}`,
            }}
          >
            {/* Tags */}
            <div className="flex gap-2 absolute top-6 left-6 z-10">
              {project.tags.map(tag => (
                <span key={tag} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-white px-4 py-1 rounded-full text-xs font-semibold font-inter shadow-sm">{tag}</span>
              ))}
            </div>
            {/* Image or Placeholder with hover overlay */}
            <div className="w-full aspect-[16/9] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center relative overflow-hidden rounded-t-xl">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover rounded-t-xl"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-lg font-bold">
                  Preview
                </div>
              )}
              {/* Description overlay on hover (desktop) */}
              <div
                className="hidden md:flex absolute inset-0 items-center justify-center text-center px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl z-20 text-white"
                style={{ pointerEvents: 'none', background: theme === 'dark' ? 'rgba(24,24,27,0.85)' : 'rgba(0,0,0,0.7)' }}
              >
                <span className="text-base font-medium">{project.description}</span>
              </div>
            </div>
            {/* Arrow Button */}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`absolute bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition border-2 ${theme === 'dark' ? 'bg-white text-black border-zinc-900' : 'bg-black text-white border-white'}`}
              style={{ fontSize: 28 }}
              aria-label={`View ${project.title}`}
            >
              <span>→</span>
            </a>
            {/* Title and description (description always visible on mobile) */}
            <div className="px-8 pt-6 pb-4 w-full">
              <h3
                className="text-2xl font-bold mb-2 font-inter truncate w-full"
                style={{ color: theme === 'dark' ? '#fff' : '#111' }}
              >
                {project.title}
              </h3>
              <span className="block md:hidden text-base opacity-80 mt-2 text-zinc-700 dark:text-white">{project.description}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Add CertificateSection component
function CertificateSection({ theme }: { theme: 'dark' | 'light' }) {
  const certificates = [
    {
      title: 'Frontend Developer Nanodegree',
      issuer: 'Udacity',
      image: '/certificate-placeholder.png',
      link: '#',
    },
    {
      title: 'React Advanced',
      issuer: 'Coursera',
      image: '/certificate-placeholder.png',
      link: '#',
    },
    {
      title: 'UI/UX Design Specialization',
      issuer: 'Google',
      image: '/certificate-placeholder.png',
      link: '#',
    },
  ]
  // Polaroid-style rotations
  const rotations = ['-rotate-3', 'rotate-2', '-rotate-2', 'rotate-3'];
  return (
    <section
      id="certificates"
      className={`min-h-screen w-full ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} flex flex-col items-center py-20 relative overflow-hidden`}
      style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
    >
      {/* Pinboard background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: theme === 'dark'
            ? 'repeating-linear-gradient(135deg, #23272f 0 2px, transparent 2px 40px), repeating-linear-gradient(45deg, #23272f 0 2px, transparent 2px 40px), #18181b'
            : 'repeating-linear-gradient(135deg, #e2c290 0 2px, transparent 2px 40px), repeating-linear-gradient(45deg, #e2c290 0 2px, transparent 2px 40px), #f5e6c5',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      />
      <h2
        className="text-3xl md:text-4xl font-extrabold font-inter tracking-tight mb-10 z-10"
        style={{
          color: theme === 'dark' ? '#fff' : '#111',
          textShadow: theme === 'dark' ? '0 2px 16px #000, 0 1px 1px #000' : '0 2px 8px #eee',
        }}
      >
        Certificates
      </h2>
      <div className="flex flex-wrap gap-10 justify-center w-full max-w-6xl px-4 z-10">
        {certificates.map((cert, idx) => (
          <div
            key={idx}
            className={`relative bg-white dark:bg-zinc-900 rounded-xl shadow-2xl flex flex-col items-center max-w-xs w-full pb-6 pt-8 px-4 ${rotations[idx % rotations.length]} transition-transform hover:scale-105`}
            style={{
              minHeight: 340,
              border: `2px solid ${theme === 'dark' ? '#23344d' : '#e5e7eb'}`,
              zIndex: 10 - idx,
            }}
          >
            {/* Pin SVG at the top center */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="10" r="7" fill={theme === 'dark' ? '#e2c290' : '#c2410c'} stroke="#222" strokeWidth="2" />
                <rect x="14.5" y="16" width="3" height="12" rx="1.5" fill="#222" />
              </svg>
            </div>
            <img
              src={cert.image}
              alt={cert.title}
              className="w-full h-48 object-contain rounded-lg bg-zinc-100 dark:bg-zinc-800 mb-4 border border-zinc-200 dark:border-zinc-800"
              style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}
            />
            <h3
              className="text-lg font-bold font-inter text-center mb-1"
              style={{ color: theme === 'dark' ? '#fff' : '#111' }}
            >
              {cert.title}
            </h3>
            <div className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 text-center mb-4">{cert.issuer}</div>
            <a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -top-4 right-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-1.5 px-4 rounded-full text-xs shadow-lg transition font-inter"
              style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}
            >
              View
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function AboutUs({ theme }: AboutUsProps) {
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
  // Larger responsive size for the icon canvas
  const iconSize = useMemo(() => {
    if (typeof window !== 'undefined') {
      return Math.min(window.innerHeight * 0.6, window.innerWidth * 0.25)
    }
    return 240 // fallback for SSR
  }, [])
  return (
    <>
      <section
        id="about"
        className={`min-h-screen w-full ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} flex items-center`}
        style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
      >
        <div className="w-full flex flex-col md:flex-row items-center md:items-center px-4 md:px-16 py-16 gap-8">
          {/* Left: Particle Image Avatar */}
          <div className="flex-shrink-0 flex items-center justify-center w-[55%] h-[60vh] min-w-[120px] min-h-[120px] bg-transparent">
            <ParticleComponent
              theme={theme}
              type="image"
              imageSrc="/icon.png"
              size={iconSize}
            />
          </div>
          {/* Right: Text Content */}
          <div className="flex-1 flex flex-col justify-center items-center md:items-start gap-6">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2 font-inter tracking-tight">About Me</h2>
            <h3 className="text-lg md:text-xl text-cyan-600 dark:text-cyan-400 font-semibold mb-2 font-inter">Software Developer</h3>
            <p className="mb-2 max-w-2xl text-base md:text-lg font-inter">
              I craft beautiful, performant, and accessible web experiences with a focus on delightful UI, animation, and modern technologies. My mission is to bridge design and engineering, making the web more engaging and inclusive for everyone.
            </p>
            <div className="flex flex-col md:flex-row gap-8 w-full">
              <div className="flex-1">
                <div className="font-semibold mb-2 font-inter">Tools & Technologies</div>
                <div className="flex flex-wrap gap-2">
                  {tools.map(tool => (
                    <span key={tool} className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-semibold font-inter">{tool}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <a href="#contact" className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-full text-base shadow-lg transition font-inter">Contact Me</a>
            </div>
          </div>
        </div>
      </section>
      <ProjectSection theme={theme} />
      <CertificateSection theme={theme} />
    </>
  )
} 