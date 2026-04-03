"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Zap,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/personas', label: 'User personas', icon: Users },
  { href: '/dashboard/heatmap', label: 'Interaction map', icon: Flame },
  { href: '/dashboard/insights', label: 'Strategic insights', icon: Lightbulb },
]

import { useDashboard } from '@/contexts/DashboardContext'
import { PersonaTraceList } from './persona-trace-list'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { isSidebarCollapsed: isCollapsed, setIsSidebarCollapsed: setIsCollapsed } = useDashboard()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

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
        className="fixed left-4 bottom-4 z-[70] h-12 w-12 rounded-full glass-panel border-white/10 flex items-center justify-center lg:hidden shadow-2xl"
        aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      <aside
        className={cn(
          "fixed left-0 top-0 z-[50] h-screen bg-card border-r border-white/5 transition-all duration-500 ease-out",
          isCollapsed ? "w-20" : "w-72",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        <div className="flex h-full flex-col p-4">
          {/* Logo/Brand */}
          <div className={cn(
            "flex h-16 items-center px-2 mb-8",
            isCollapsed ? "justify-center" : "gap-3"
          )}>
            <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald to-cyan shadow-lg shadow-emerald/20">
              <BarChart3 className="h-5 w-5 text-background font-bold" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-foreground">PersonaLab</span>
                <span className="text-[10px] text-emerald font-bold uppercase tracking-widest">Enterprise AI</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 space-y-1">
             {!isCollapsed && (
               <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Navigation</p>
             )}
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-500 relative group",
                    isActive 
                      ? "bg-emerald/10 text-emerald shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] border border-emerald/20" 
                      : "text-muted-foreground/60 hover:bg-white/[0.03] hover:text-foreground border border-transparent",
                    isCollapsed && "justify-center px-0 w-12 mx-auto"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-all duration-500 group-hover:scale-110", isActive && "text-emerald drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]")} />
                  {!isCollapsed && <span className="tracking-tight">{item.label}</span>}
                  
                  {/* Active Indicator Pin */}
                  {isActive && (
                    <div className={cn(
                      "absolute rounded-full bg-emerald shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-all",
                      isCollapsed ? "right-[-4px] top-1/2 -translate-y-1/2 w-1.5 h-1.5" : "right-4 w-2 h-2"
                    )} />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Persona Browser Trace Control */}
          <PersonaTraceList isCollapsed={isCollapsed} />

          {/* Bottom Section */}
          <div className="pt-4 border-t border-white/5 space-y-1">
             <Link
              href="/dashboard/help"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-white/[0.03] hover:text-foreground group",
                isCollapsed && "justify-center px-0"
              )}
            >
              <HelpCircle className="h-5 w-5 group-hover:text-emerald" />
              {!isCollapsed && <span className="tracking-tight">Documentation</span>}
            </Link>
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-white/[0.03] hover:text-foreground group",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Settings className="h-5 w-5 group-hover:text-emerald" />
              {!isCollapsed && <span className="tracking-tight">System settings</span>}
            </Link>

            {/* Collapse Toggle - Desktop only */}
            <div className="pt-4 hidden lg:block">
               <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex items-center justify-center p-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-muted-foreground"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                   <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-2">
                     <ChevronLeft className="h-4 w-4" />
                     <span>Collapse Menu</span>
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