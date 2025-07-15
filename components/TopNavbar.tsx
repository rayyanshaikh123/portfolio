"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { useState, useRef } from "react";
import React from "react";

interface TopNavbarProps {
  activeSection: string
}

const sectionTitles = {
  dashboard: "Dashboard",
  projects: "Projects",
  certificates: "Certificates",
  timeline: "Timeline",
  skills: "Skills",
  contact: "Contact Messages",
}

export function TopNavbar({ activeSection, onLogout }: TopNavbarProps & { onLogout?: () => void }) {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  async function handleLogout() {
    await fetch('/api/admin-login', { method: 'DELETE', credentials: 'include' });
    if (onLogout) onLogout();
    window.location.href = '/';
  }

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border shadow-sm w-full py-4 pl-6 px-10 md:pl-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-foreground tracking-tight relative left-[270px]">
          {sectionTitles[activeSection as keyof typeof sectionTitles]}
        </h1>
        <div className="flex items-center gap-4 relative">
          <button
            aria-label="Toggle theme"
            className="rounded-full p-2 border border-border bg-background hover:bg-accent transition"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71m16.97 0l-.71-.71M4.05 4.93l-.71-.71M21 12h-1M4 12H3m9-9a9 9 0 100 18 9 9 0 000-18z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </button>
          <div className="relative">
            <button
              aria-label="Admin menu"
              className="focus:outline-none"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                <AvatarFallback className="bg-muted text-muted-foreground">AD</AvatarFallback>
              </Avatar>
            </button>
            {menuOpen && (
              <div ref={menuRef} className="absolute right-0 mt-2 w-44 bg-popover border border-border rounded-md shadow-lg z-50">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-accent transition rounded-t-md"
                  onClick={() => { window.open('/', '_blank'); setMenuOpen(false); }}
                >
                  View Portfolio
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-accent transition rounded-b-md text-destructive"
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 