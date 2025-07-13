"use client"

import React, { useState } from "react"
import HeroSection from "../components/HeroSection"
import AboutUs from "../components/AboutUs"

export default function SyntheticV0PageForDeployment() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  return (
    <>
      <HeroSection theme={theme} setTheme={setTheme} />
      <AboutUs theme={theme} />
    </>
  )
}