"use client"

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { Sparkles, LayoutDashboard, LogOut, User, Sun, Moon } from 'lucide-react'

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-16 border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-cyan flex items-center justify-center shadow-lg shadow-emerald/20 group-hover:rotate-6 transition-transform">
            <span className="text-background font-black text-xl tracking-tighter">P</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-lg text-foreground tracking-tight">PersonaLab</span>
            <span className="text-[10px] text-emerald font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">v2.0 Beta</span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 rounded-xl border border-border/50 hover:bg-muted transition-all"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <div className="hidden md:flex flex-col items-end leading-none">
                <span className="text-sm font-bold text-foreground tracking-tight">{user?.name || 'User'}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{user?.email}</span>
              </div>
              
              <div className="relative group">
                <Avatar 
                  fallback={<User className="w-4 h-4" />} 
                  className="h-10 w-10 border-2 border-white/5 group-hover:border-emerald/50 transition-all cursor-pointer"
                />
                {/* Subtle online indicator */}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald border-2 border-background rounded-full" />
              </div>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-bold hover:bg-white/5">
                  Sign in
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="bg-white text-black hover:bg-white/90 font-bold px-6 rounded-full shadow-lg shadow-white/5">
                  Analyze URL
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}