import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import React from 'react';
import StartupLoader from "@/components/StartupLoader";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <StartupLoader />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
