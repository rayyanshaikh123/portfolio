import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { jetbrainsMono, poppins } from '@/lib/fonts'
import React from 'react'
import StartupLoader from "@/components/StartupLoader"

export const metadata: Metadata = {
  title: 'Rayyan Shaikh',
  description: 'Created By Rayyan Shaikh',
  generator: 'Rayyan Shaikh',
  icons: {
    icon: '/steve.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning
      className={`${jetbrainsMono.variable} ${poppins.variable}`}>
      <body className="font-body">
        <StartupLoader />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
