"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2, Mail, Lock, Globe, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/client'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, signUp, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Handle redirect after successful login
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = searchParams.get('redirect') || '/dashboard'
      router.push(redirectPath)
    }
  }, [isAuthenticated, router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password')
      return
    }

    setIsLoading(true)
    
    try {
      if (isSignUp) {
        await signUp(email, password)
        setError('Check your email for the confirmation link')
      } else {
        await login(email, password)
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
       {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 justify-center">
          <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center shadow-2xl">
            <Globe className="text-background w-6 h-6" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-foreground">PersonaLab</span>
        </Link>

        <Card className="border-white/10 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald via-cyan to-violet" />
          
          <CardHeader className="text-center space-y-1 pt-8">
            <CardTitle className="text-2xl font-black uppercase tracking-tight">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              {isSignUp ? 'Start simulating user behavior' : 'Continue your conversion analysis'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-4 pb-10 px-8">
            {/* Google Login */}
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 font-bold uppercase tracking-wider text-[10px] gap-3"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator weight="thin" />
              </div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-[0.2em] font-black">
                <span className="bg-background px-4 text-muted-foreground/60">or secure login</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-13 rounded-xl border-white/5 bg-white/[0.02] focus:bg-white/[0.04] transition-all"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-13 rounded-xl border-white/5 bg-white/[0.02] focus:bg-white/[0.04] transition-all"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium animate-in fade-in zoom-in-95">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-13 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-black uppercase text-[11px] tracking-[0.1em] shadow-xl shadow-white/5 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? 'Initialize Account' : 'Enter PersonaLab'}
                    <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
               <button 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
               >
                 {isSignUp ? 'Already have access?' : 'Request access?'} <span className="text-primary">{isSignUp ? 'Login' : 'Sign Up'}</span>
               </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.2em]">
          Protected by AES-256 Encryption & Supabase Auth
        </p>
      </div>
    </div>
  )
}

function LoginLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-6">
       <div className="w-12 h-12 rounded-2xl bg-foreground animate-pulse" />
       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Booting Auth Module...</p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}