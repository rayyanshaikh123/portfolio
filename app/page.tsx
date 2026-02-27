"use client"
import HeroSection from "../components/HeroSection"
import AboutSection from "../components/sections/AboutSection"
import ProjectSection from "../components/sections/ProjectSection"
import CertificateSection from "../components/sections/CertificateSection"
import TimelineSection from "../components/sections/TimelineSection"
import HireMeSection from "../components/sections/HireMeSection"
import FooterSection from "../components/sections/FooterSection"
import dynamic from 'next/dynamic'

const ChatWidget = dynamic(() => import('../components/ChatWidget'), { ssr: false })
const ScrollProgress = dynamic(() => import('../components/ScrollProgress'), { ssr: false })

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <HeroSection />
      <AboutSection />
      <ProjectSection />
      <CertificateSection />
      <TimelineSection />
      <HireMeSection />
      <FooterSection />
      <ChatWidget />
    </main>
  )
}
