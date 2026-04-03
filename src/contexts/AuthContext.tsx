"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/client'
import type { User, AuthState } from '@/types'

interface AuthContextType extends AuthState {
  login: (email: string, password?: string) => Promise<void>
  signUp: (email: string, password?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })

  // Initialize Supabase Client
  const supabase = createClient()

  useEffect(() => {
    async function getInitialSession() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setState({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            createdAt: new Date(session.user.created_at)
          },
          isLoading: false,
          isAuthenticated: true
        })
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setState({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              createdAt: new Date(session.user.created_at)
            },
            isLoading: false,
            isAuthenticated: true
          })
        } else {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false
          })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Login with Password or Magic Link
  const login = async (email: string, password?: string) => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      if (password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        // Fallback to OTP/Magic Link if no password provided
        const { error } = await supabase.auth.signInWithOtp({ email })
        if (error) throw error
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  // Sign Up
  const signUp = async (email: string, password?: string) => {
    setState(prev => ({ ...prev, isLoading: true }))
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: password || 'temp_password_123', // Demo fallback
        options: {
          data: {
             name: email.split('@')[0]
          }
        }
      })
      if (error) throw error
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}