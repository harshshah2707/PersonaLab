"use client"

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { LogOut, User, BarChart3, Fingerprint, Sun, Moon, Laptop } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-24 border-b border-border bg-background/80 backdrop-blur-2xl">
      <div className="layout-container h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-6 transition-all hover:opacity-90 active:scale-95 group">
          <div className="w-12 h-12 rounded-2xl bg-coffee flex items-center justify-center shadow-[0_10px_30px_rgba(107,79,59,0.15)] group-hover:rotate-6 transition-all duration-700 border-4 border-card dark:border-muted">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-2xl text-foreground tracking-tighter">PersonaLab</span>
            <span className="text-[10px] text-terracotta font-black uppercase tracking-[0.4em]">Audit Studio</span>
          </div>
        </Link>

        <div className="flex items-center gap-10">
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">
             <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
             <Link href="/dashboard/help" className="hover:text-foreground transition-colors">Neural Logic</Link>
             <Link href="/dashboard/settings" className="hover:text-foreground transition-colors">Enterprise</Link>
          </div>

          <div className="h-8 w-px bg-border mx-2 hidden md:block" />

          {/* Theme Toggle - High Fidelity Environment Control */}
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="w-12 h-12 rounded-2xl bg-card border-border shadow-sm hover:bg-secondary transition-all group"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-terracotta group-hover:rotate-90 transition-transform duration-700" />
              ) : (
                <Moon className="h-5 w-5 text-coffee group-hover:-rotate-12 transition-transform duration-700" />
              )}
            </Button>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end leading-none">
                <span className="text-sm font-black text-foreground tracking-tighter">{user?.name || 'Researcher'}</span>
                <span className="text-[10px] text-foreground/30 font-bold italic">Authenticated Analyst</span>
              </div>
              
              <div className="relative group">
                <Avatar 
                  fallback={<User className="w-4 h-4" />} 
                  className="h-12 w-12 border-2 border-border group-hover:border-foreground transition-all duration-500 cursor-pointer rounded-2xl shadow-sm bg-secondary flex items-center justify-center overflow-hidden"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-forest border-4 border-card rounded-full shadow-lg shadow-forest/20" />
              </div>

              <Button 
                variant="ghost" 
                size="icon"
                onClick={logout}
                className="text-foreground/20 hover:text-terracotta hover:bg-terracotta/5 transition-all w-12 h-12"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-foreground/40 hover:text-foreground">
                  Sign in
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                   size="lg" 
                   className="h-14 px-8 rounded-2xl bg-coffee text-white hover:opacity-90 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-coffee/10 border-4 border-secondary flex items-center gap-3"
                >
                  <Fingerprint className="h-4 w-4" />
                  Initiate Scan
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}