import React, { useMemo, useEffect, useRef, useState } from 'react'
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
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const projectsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data);
      } catch (e) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const displayedProjects = showAll ? projects : projects.slice(0, 4);

  const handleToggle = () => {
    if (showAll && projectsRef.current) {
      projectsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setShowAll((prev) => !prev);
  };

  return (
    <section
      id="projects"
      ref={projectsRef}
      className={`min-h-screen w-full ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} flex flex-col items-center py-12 md:py-20`}
      style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
    >
      <div className="flex w-full max-w-[98vw] md:max-w-[70vw] justify-between items-center px-2 sm:px-4 mb-8 md:mb-10">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-inter tracking-tight w-full text-center md:text-left"
          style={{
            color: theme === 'dark' ? '#fff' : '#111',
            textShadow: theme === 'dark' ? '0 2px 16px #000, 0 1px 1px #000' : '0 2px 8px #eee',
          }}
        >
          Recent projects
        </h2>
        {projects.length > 4 && (
          <button
            onClick={handleToggle}
            className="text-orange-500 font-semibold flex items-center gap-1 hover:underline text-sm sm:text-base md:text-lg focus:outline-none"
          >
            {showAll ? 'Show Less' : 'View All'} <span className="text-xl">{showAll ? '↑' : '→'}</span>
          </button>
        )}
      </div>
      {loading ? (
        <div className="text-lg text-muted-foreground py-20">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10 w-full max-w-[98vw] md:max-w-[70vw] px-2 sm:px-4 justify-center">
        {displayedProjects.map((project, idx) => (
          <div
              key={project._id || idx}
            className="relative rounded-xl flex flex-col items-start p-0 overflow-hidden transition hover:scale-105 max-w-xs sm:max-w-md w-full mx-auto group"
            style={{
              minHeight: 340,
                backgroundColor: theme === 'dark' ? '#27272a' : '#fff',
              boxShadow: theme === 'dark'
                ? '0 4px 32px 0 rgba(0,0,0,0.7), 0 1.5px 6px 0 rgba(0,0,0,0.5)'
                : '0 4px 32px 0 rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.08)',
                border: `1.5px solid ${theme === 'dark' ? '#3f3f46' : '#e5e7eb'}`,
            }}
          >
            {/* Tags */}
            <div className="flex gap-2 absolute top-4 left-4 z-10">
                {project.techStack?.map((tag: string) => (
                <span key={tag} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-white px-3 py-1 rounded-full text-xs font-semibold font-inter shadow-sm">{tag}</span>
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
                className="hidden md:flex absolute inset-0 items-center justify-center text-center px-4 md:px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl z-20 text-white"
                style={{ pointerEvents: 'none', background: theme === 'dark' ? 'rgba(24,24,27,0.85)' : 'rgba(0,0,0,0.7)' }}
              >
                <span className="text-base font-medium">{project.description}</span>
              </div>
            </div>
            {/* Arrow Button */}
            <a
                href={project.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`absolute bottom-4 right-4 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition border-2 ${theme === 'dark' ? 'bg-white text-black border-zinc-900' : 'bg-black text-white border-white'}`}
              style={{ fontSize: 24 }}
              aria-label={`View ${project.title}`}
            >
              <span>→</span>
            </a>
            {/* Title and description (description always visible on mobile) */}
            <div className="px-4 md:px-8 pt-4 md:pt-6 pb-2 md:pb-4 w-full">
              <h3
                className="text-lg sm:text-xl md:text-2xl font-bold mb-2 font-inter truncate w-full"
                style={{ color: theme === 'dark' ? '#fff' : '#111' }}
              >
                {project.title}
              </h3>
              <span className="block md:hidden text-sm sm:text-base opacity-80 mt-2 text-zinc-700 dark:text-white">{project.description}</span>
            </div>
          </div>
        ))}
      </div>
      )}
    </section>
  )
}

// Add CertificateSection component
function CertificateSection({ theme }: { theme: 'dark' | 'light' }) {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const certRes = await fetch('/api/certificates');
        let certData = await certRes.json();
        certData = Array.isArray(certData) ? certData : certData.certificates || [];
        certData.forEach((c: any) => { c._itemType = 'certificate'; });
        const achRes = await fetch('/api/achievements');
        let achData = await achRes.json();
        achData = Array.isArray(achData) ? achData : achData.achievements || [];
        achData.forEach((a: any) => { a._itemType = 'achievement'; });
        // Merge and sort by createdAt ascending (oldest first)
        const allItems = [...certData, ...achData].sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setCertificates([]); // not used anymore
        setAchievements([]); // not used anymore
        setMixedItems(allItems);
      } catch (e) {
        setCertificates([]);
        setAchievements([]);
        setMixedItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  const [mixedItems, setMixedItems] = useState<any[]>([]);
  // Polaroid-style rotations
  const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];

  // Modal close handler
  const closeModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  return (
    <section
      id="certificates"
      className={`min-h-screen w-full ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} flex flex-col items-center py-12 md:py-20 relative overflow-hidden`}
      style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
    >
      {/* Modal for certificate image */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={closeModal}
        >
          <div className="relative max-w-3xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-white text-3xl font-bold bg-black bg-opacity-50 rounded-full px-3 py-1 hover:bg-opacity-80"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src={modalImage || ''}
              alt="Certificate Large View"
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border-4 border-white dark:border-zinc-700"
            />
          </div>
        </div>
      )}
      {/* Pinboard background with random emojis */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: theme === 'dark'
            ? 'repeating-linear-gradient(135deg, #23272f 0 2px, transparent 2px 40px), repeating-linear-gradient(45deg, #23272f 0 2px, transparent 2px 40px), #18181b'
            : 'repeating-linear-gradient(135deg, #e2c290 0 2px, transparent 2px 40px), repeating-linear-gradient(45deg, #e2c290 0 2px, transparent 2px 40px), #f5e6c5',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      >
        {/* Randomly placed emojis */}
        <span style={{ position: 'absolute', top: '12%', left: '8%', fontSize: 32, pointerEvents: 'none' }}>🎉</span>
        <span style={{ position: 'absolute', top: '30%', left: '80%', fontSize: 28, pointerEvents: 'none' }}>🏆</span>
        <span style={{ position: 'absolute', top: '65%', left: '15%', fontSize: 30, pointerEvents: 'none' }}>📌</span>
        <span style={{ position: 'absolute', top: '75%', left: '70%', fontSize: 34, pointerEvents: 'none' }}>✨</span>
        <span style={{ position: 'absolute', top: '50%', left: '45%', fontSize: 30, pointerEvents: 'none' }}>🎓</span>
      </div>
      <h2
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-inter tracking-tight mb-8 md:mb-10 z-10 text-center"
        style={{
          color: theme === 'dark' ? '#fff' : '#111',
          textShadow: theme === 'dark' ? '0 2px 16px #000, 0 1px 1px #000' : '0 2px 8px #eee',
        }}
      >
        Achievement Board
      </h2>
      {loading ? (
        <div className="text-lg text-muted-foreground py-20">Loading achievements and certificates...</div>
      ) : (
        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center w-full max-w-7xl px-2 z-10">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full justify-items-center">
            {mixedItems.map((item, idx) => (
              item._itemType === 'certificate' ? (
                <div
                  key={item._id || idx}
                  className="relative flex flex-col items-center w-full max-w-xs sm:max-w-sm pb-4 pt-6 md:pb-10 md:pt-12 px-1 md:px-4 cursor-pointer mx-auto"
                  style={{ minHeight: 260, maxWidth: 340, zIndex: 10 - idx }}
                  onClick={() => { setModalImage(item.image); setModalOpen(true); }}
                >
                  {/* Framed image with wooden border */}
                  <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-20">
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="10" r="7" fill={theme === 'dark' ? '#c2410c ' : '#FFCC00'} stroke="#222" strokeWidth="2" />
                      <rect x="14.5" y="16" width="3" height="12" rx="1.5" fill="#222" />
                    </svg>
                  </div>
                  <div
                    className="flex items-center justify-center shadow-xl border-4"
                    style={{
                      width: '100%',
                      maxWidth: 320,
                      minHeight: 180,
                      background: theme === 'dark'
                        ? 'repeating-linear-gradient(135deg, #7c4a03 0 8px, #a97c50 8px 16px, #7c4a03 16px 24px), #5a3a1b'
                        : 'repeating-linear-gradient(135deg, #e2b07a 0 8px, #c68642 8px 16px, #e2b07a 16px 24px), #deb887',
                      border: theme === 'dark' ? '4px solid #a97c50' : '4px solid #c68642',
                    }}
                  >
                    <div
                      className={` border-2 ${theme === 'dark' ? 'border-zinc-700' : 'border-zinc-200'} bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden`} style={{ width: '95%', height: 160, boxShadow: '0 2px 16px rgba(0,0,0,0.18)' }}>
                      <img
                        src={item.image}
                        alt={item.issuer || 'Certificate'}
                        className="object-cover border w-full h-full "
                        style={{ display: 'block', background: '#fff' }}
                      />
                    </div>
                  </div>
                  {/* Issuer and link below image */}
                  <div className="w-full text-center mt-4">
                    <div className={`font-bold text-base sm:text-lg md:text-xl font-inter mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{item.issuer || ''}</div>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline text-xs sm:text-sm mt-2">View Certificate</a>
                    )}
                  </div>
                </div>
              ) :
                <div
                  key={item._id || idx}
                  className={`relative rounded-2xl flex flex-col items-center w-full max-w-xs sm:max-w-lg pb-6 pt-8 md:pb-8 md:pt-10 px-2 md:px-6 ${rotations[idx % rotations.length]} transition-transform hover:scale-105
                    ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700 shadow-[0_4px_32px_0_rgba(0,0,0,0.7),0_1.5px_6px_0_rgba(0,0,0,0.5)]' : 'bg-white border-zinc-200 shadow-2xl'} mx-auto`}
                  style={{
                    minHeight: 220,
                    borderWidth: 2,
                    borderStyle: 'solid',
                    zIndex: 10 - idx,
                  }}
                >
                  {/* Pin SVG at the top center */}
                  <div className="absolute -top-6 md:-top-7 left-1/2 -translate-x-1/2 z-20">
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="10" r="7" fill={theme === 'dark' ? '#e2c290' : '#c2410c'} stroke="#222" strokeWidth="2" />
                      <rect x="14.5" y="16" width="3" height="12" rx="1.5" fill="#222" />
                    </svg>
                  </div>
                  {/* Achievement image polaroid style, always fit and centered */}
                  <div className={`w-full flex items-center justify-center rounded-xl border p-2 md:p-4 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-100 border-zinc-200 shadow'}`} style={{ minHeight: 80 }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-28 w-auto object-contain mx-auto"
                      style={{ display: 'block', maxWidth: '100%' }}
                    />
                  </div>
                  {/* Title and description below image */}
                  <div className="w-full text-center mt-4">
                    <div className={`font-bold text-base sm:text-lg md:text-xl font-inter mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{item.title}</div>
                    <div className={`text-xs sm:text-base font-inter mb-1 ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>{item.description}</div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function TimelineSection({ theme }: { theme: 'dark' | 'light' }) {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeline() {
      setLoading(true);
      try {
        const res = await fetch('/api/timeline');
        let data = await res.json();
        data = Array.isArray(data) ? data : data.timeline || [];
        // Sort by year ascending (oldest first)
        data.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setTimeline(data);
      } catch (e) {
        setTimeline([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTimeline();
  }, []);

  return (
    <section
      id="timeline"
      className={`min-h-screen w-full ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} flex flex-col items-center py-12 md:py-20`}
      style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
    >
      <h2
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-inter tracking-tight mb-8 md:mb-10"
        style={{
          color: theme === 'dark' ? '#fff' : '#111',
          textShadow: theme === 'dark' ? '0 2px 16px #000, 0 1px 1px #000' : '0 2px 8px #eee',
        }}
      >
        My Journey
      </h2>
      <div className="relative w-full max-w-2xl px-4">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 h-full w-1 bg-gradient-to-b from-cyan-400/80 to-cyan-600/80 dark:from-cyan-600/80 dark:to-cyan-400/80 rounded-full" style={{ zIndex: 0 }} />
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
                  <span className={`text-3xl rounded-full border-4 ${theme === 'dark' ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'} shadow-lg p-2`} style={{ zIndex: 2 }}>{item.icon}</span>
                  {idx < timeline.length - 1 && (
                    <span className="flex-1 w-1 bg-cyan-400/40 dark:bg-cyan-700/40" style={{ minHeight: 32 }} />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg font-bold font-inter" style={{ color: theme === 'dark' ? '#fff' : '#111' }}>{item.title}</span>
                    <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900 px-2 py-0.5 rounded-full ml-2">{item.year}</span>
                  </div>
                  <div className="text-base opacity-80 font-inter">{item.description}</div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}

// HireMeSection component
function HireMeSection({ theme }: { theme: 'dark' | 'light' }) {
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
    <section
      id="hire-me"
      className={`min-h-[60vh] w-full ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-black'} flex flex-col items-center py-12 md:py-20`}
      style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
    >
      <h2
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-inter tracking-tight mb-8 md:mb-10"
        style={{
          color: theme === 'dark' ? '#fff' : '#111',
          textShadow: theme === 'dark' ? '0 2px 16px #000, 0 1px 1px #000' : '0 2px 8px #eee',
        }}
      >
        Hire Me
      </h2>
      <div className={`w-full max-w-xs sm:max-w-md rounded-2xl p-4 sm:p-8 border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-700 shadow-[0_4px_32px_0_rgba(0,0,0,0.7),0_1.5px_6px_0_rgba(0,0,0,0.5)]' : 'bg-white border-zinc-200 shadow-2xl'}`}>
        {submitted ? (
          <div className="text-center text-cyan-600 dark:text-cyan-400 text-lg font-semibold py-12">Thank you for reaching out! I will get back to you soon.</div>
        ) : (
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-1 font-inter" style={{ color: theme === 'dark' ? '#e5e7eb' : '#000' }}>Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border font-inter focus:outline-none focus:ring-2 focus:ring-cyan-400 ${theme === 'dark' ? 'placeholder:text-zinc-300' : 'placeholder:text-zinc-400'}`}
                style={{
                  borderColor: theme === 'dark' ? '#3f3f46' : '#d4d4d8',
                  backgroundColor: theme === 'dark' ? '#27272a' : '#f4f4f5',
                  color: theme === 'dark' ? '#fff' : '#000',
                }}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1 font-inter" style={{ color: theme === 'dark' ? '#e5e7eb' : '#000' }}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border font-inter focus:outline-none focus:ring-2 focus:ring-cyan-400 ${theme === 'dark' ? 'placeholder:text-zinc-300' : 'placeholder:text-zinc-400'}`}
                style={{
                  borderColor: theme === 'dark' ? '#3f3f46' : '#d4d4d8',
                  backgroundColor: theme === 'dark' ? '#27272a' : '#f4f4f5',
                  color: theme === 'dark' ? '#fff' : '#000',
                }}
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-1 font-inter" style={{ color: theme === 'dark' ? '#e5e7eb' : '#000' }}>Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className={`w-full px-4 py-2 rounded-lg border font-inter focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none ${theme === 'dark' ? 'placeholder:text-zinc-300' : 'placeholder:text-zinc-400'}`}
                style={{
                  borderColor: theme === 'dark' ? '#3f3f46' : '#d4d4d8',
                  backgroundColor: theme === 'dark' ? '#27272a' : '#f4f4f5',
                  color: theme === 'dark' ? '#fff' : '#000',
                }}
                placeholder="How can I help you?"
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-full text-base shadow-lg transition font-inter w-full sm:w-auto"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

// FooterSection component
function FooterSection({ theme }: { theme: 'dark' | 'light' }) {
  return (
    <footer
      className={`w-full py-8 flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-black'}`}
      style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
    >
      <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
        <span className="font-inter text-base">&copy; {new Date().getFullYear()} Rayyan Shaikh. All rights reserved.</span>
        <a
          href="mailto:rayyan.shaikhh@gmail.com"
          className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold ml-0 md:ml-4"
        >
          rayyan.shaikhh@gmail.com
        </a>
      </div>
      <div className="flex gap-4 mt-2">
        <a href="https://github.com/rayyanshaikh123" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.338 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .267.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
        </a>
        <a href="https://www.linkedin.com/in/rayyan-shaikh-9806b5259/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
        </a>
      </div>
    </footer>
  );
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

  // Fetch skills dynamically
  const [skills, setSkills] = useState<any[]>([]);
  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch('/api/skills');
        let data = await res.json();
        data = Array.isArray(data) ? data : data.skills || [];
        setSkills(data);
      } catch (e) {
        setSkills([]);
      }
    }
    fetchSkills();
  }, []);

  return (
    <>
      <section
        id="about"
        className={`min-h-screen w-full ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} flex items-center`}
        style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
      >
        <div className="w-full flex flex-col md:flex-row items-center md:items-center px-4 sm:px-6 md:px-16 py-10 md:py-16 gap-8">
          {/* Left: Particle Image Avatar */}
          <div className="flex-shrink-0 flex items-center justify-center w-full md:w-[55%] h-[40vh] md:h-[60vh] min-w-[120px] min-h-[120px] bg-transparent mb-8 md:mb-0">
            <ParticleComponent
              theme={theme}
              type="image"
              imageSrc="/icon.png"
              size={iconSize}
            />
          </div>
          {/* Right: Text Content */}
          <div className="flex-1 flex flex-col justify-center items-center md:items-start gap-6 w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 font-inter tracking-tight text-center md:text-left">About Me</h2>
            <h3 className="text-base sm:text-lg md:text-xl text-cyan-600 dark:text-cyan-400 font-semibold mb-2 font-inter text-center md:text-left">Software Developer</h3>
            <p className="mb-2 max-w-2xl text-sm sm:text-base md:text-lg font-inter text-center md:text-left">
              I craft beautiful, performant, and accessible web experiences with a focus on delightful UI, animation, and modern technologies. My mission is to bridge design and engineering, making the web more engaging and inclusive for everyone.
            </p>
            <div className="flex flex-col md:flex-row gap-8 w-full">
              <div className="flex-1">
                <div className="font-semibold mb-2 font-inter">Tools & Technologies</div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: any) => (
                    <span key={skill._id || skill.name} className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-semibold font-inter">{skill.name}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 w-full flex justify-center md:justify-start">
              <button
                type="button"
                onClick={() => {
                  const hireMeSection = document.getElementById('hire-me');
                  if (hireMeSection) {
                    hireMeSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-full text-base shadow-lg transition font-inter"
              >
                Contact Me
              </button>
            </div>
          </div>
        </div>
      </section>
      <ProjectSection theme={theme} />
      <CertificateSection theme={theme} />
      <TimelineSection theme={theme} />
      <HireMeSection theme={theme} />
      <FooterSection theme={theme} />
    </>
  )
} 