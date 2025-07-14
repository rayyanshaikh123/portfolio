"use client"

import { LayoutDashboard, FolderOpen, Award, Clock, Code, MessageSquare, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "skills", label: "Skills", icon: Code },
  { id: "contact", label: "Contact", icon: MessageSquare },
]

export function AdminSidebar({ activeSection, setActiveSection }: AdminSidebarProps) {
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border z-50">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-heading font-bold text-foreground tracking-tight">Portfolio Admin</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-11 text-muted-foreground hover:text-foreground hover:bg-accent font-medium tracking-wide",
                activeSection === item.id && "bg-accent text-foreground font-semibold",
              )}
              onClick={() => setActiveSection(item.id)}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col z-50">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
} 