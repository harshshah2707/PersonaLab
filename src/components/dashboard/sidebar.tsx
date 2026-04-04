"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { 
  LayoutDashboard, 
  Users, 
  Flame,
  Lightbulb, 
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Menu,
  X,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/contexts/DashboardContext'
import { PersonaTraceList } from './persona-trace-list'
import { BrowserAutomationLog } from './browser-automation-log'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/personas', label: 'User personas', icon: Users },
  { href: '/dashboard/heatmap', label: 'Interaction map', icon: Flame },
  { href: '/dashboard/insights', label: 'Strategic insights', icon: Lightbulb },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { isSidebarCollapsed: isCollapsed, setIsSidebarCollapsed: setIsCollapsed } = useDashboard()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-4 bottom-4 z-[70] h-11 w-11 rounded-full bg-card border border-border flex items-center justify-center lg:hidden shadow-2xl"
        aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileOpen ? (
          <X className="h-4 h-4 text-foreground" />
        ) : (
          <Menu className="h-4 h-4 text-foreground" />
        )}
      </button>

      <aside
        className={cn(
          "fixed left-0 top-0 z-[50] h-screen bg-background border-r border-border transition-all duration-700 ease-in-out scrollbar-neutral",
          isCollapsed ? "w-20" : "w-72",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        <div className="flex h-full flex-col p-4 md:p-5 overflow-y-auto overflow-x-hidden">
          {/* Logo/Brand - Institutional Poise */}
          <div className={cn(
            "flex h-16 items-center mb-6 transition-all duration-700",
            isCollapsed ? "justify-center" : "px-3 gap-3"
          )}>
            <div className="flex h-10 w-10 min-w-[2.5rem] items-center justify-center rounded-xl bg-primary shadow-xl shadow-primary/10 group-hover:rotate-6 transition-all duration-500">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col leading-none animate-in fade-in slide-in-from-left-4 duration-700">
                <span className="font-bold text-lg tracking-tighter text-foreground">PersonaLab</span>
                <span className="text-[9px] text-accent font-black uppercase tracking-[0.3em]">Studio v2.1</span>
              </div>
            )}
          </div>

          {/* Navigation - High-Fidelity Editorial Gaps */}
          <nav className="flex-1 space-y-1.5">
             {!isCollapsed && (
               <p className="px-4 mb-3 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">Analysis</p>
             )}
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-2.5 text-[12px] font-bold transition-all duration-500 relative group animate-in slide-in-from-left-2",
                    isActive 
                      ? "bg-card text-foreground shadow-sm border border-border" 
                      : "text-foreground/40 hover:bg-card/40 hover:text-foreground border border-transparent",
                    isCollapsed && "justify-center px-0 w-12 mx-auto"
                  )}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <item.icon className={cn("h-4.5 w-4.5 flex-shrink-0 transition-all duration-500", isActive ? "text-accent" : "opacity-40 group-hover:opacity-100")} />
                  {!isCollapsed && <span className="tracking-tight">{item.label}</span>}
                  
                  {isActive && !isCollapsed && (
                    <div className="absolute right-4 w-1 h-1 rounded-full bg-accent animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Neural Trace & Browser Control Hub 🚀 🏁🌟 */}
          <div className="my-4 border-t border-border/40">
            <PersonaTraceList isCollapsed={isCollapsed} />
            {!isCollapsed && <BrowserAutomationLog />}
          </div>

          {/* Advanced Utility - Clean Paper Architecture */}
          <div className="pt-4 border-t border-border/40 space-y-1.5">
            {/* Theme Toggle Utility - Inline 🏁🌟 */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl px-4 py-2 text-[11px] font-bold text-foreground/30 transition-all duration-500 hover:text-foreground group hover:bg-secondary/50",
                  isCollapsed && "justify-center px-0"
                )}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-4.5 w-4.5 text-accent" />
                    {!isCollapsed && <span className="tracking-tight">Light Mode</span>}
                  </>
                ) : (
                  <>
                    <Moon className="h-4.5 w-4.5 text-primary" />
                    {!isCollapsed && <span className="tracking-tight">Dark Mode</span>}
                  </>
                )}
              </button>
            )}

             <Link
              href="/dashboard/help"
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2 text-[11px] font-bold text-foreground/30 transition-all duration-500 hover:text-foreground group",
                isCollapsed && "justify-center px-0"
              )}
            >
              <HelpCircle className="h-4.5 w-4.5 opacity-30 group-hover:opacity-100" />
              {!isCollapsed && <span className="tracking-tight">Documentation</span>}
            </Link>
            
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2 text-[11px] font-bold text-foreground/30 transition-all duration-500 hover:text-foreground group",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Settings className="h-4.5 w-4.5 opacity-30 group-hover:opacity-100" />
              {!isCollapsed && <span className="tracking-tight">Configuration</span>}
            </Link>

            {/* Premium Collapse Toggle */}
            <div className="pt-4 hidden md:block">
               <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex items-center justify-center p-2.5 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-500 text-foreground/60 group"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                ) : (
                   <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] px-1">
                     <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform text-accent" />
                     <span>Minimize</span>
                   </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}