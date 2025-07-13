import React, { useRef, useEffect, useState } from 'react'

const timelineData = [
  {
    title: 'Graduated University',
    date: '2019',
    description: 'Completed B.Sc. in Computer Science at XYZ University.'
  },
  {
    title: 'First Developer Job',
    date: '2020',
    description: 'Joined ABC Corp as a Frontend Developer.'
  },
  {
    title: 'Certified React Developer',
    date: '2021',
    description: 'Earned React Professional Certification.'
  },
  {
    title: 'Freelance Projects',
    date: '2022',
    description: 'Worked with clients worldwide on web projects.'
  }
]

function useParallax(offset = 100) {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (factor: number) => `translateY(${scrollY / factor - offset}px)`
}

export default function Timeline() {
  const parallax = useParallax(100)
  return (
    <section className="relative py-24 bg-gradient-to-b from-transparent to-gray-100 dark:to-gray-900">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">My Journey</h2>
        <div className="relative border-l-2 border-gray-300 dark:border-gray-700">
          {timelineData.map((item, i) => (
            <div
              key={i}
              className="mb-16 ml-8 relative"
              style={{ transform: parallax(6 + i * 2) }}
            >
              <div className="absolute -left-8 top-1 w-6 h-6 bg-cyan-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg"></div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="text-cyan-500 font-semibold text-sm mb-1">{item.date}</div>
                <div className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.title}</div>
                <div className="text-gray-600 dark:text-gray-300">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 