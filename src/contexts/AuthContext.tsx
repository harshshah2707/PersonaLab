"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User, AuthState } from '@/types'
import { simulateAuth } from '@/lib/mockData'

interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  })

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('personaLab_user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setState({
          user,
          isLoading: false,
          isAuthenticated: true
        })
      } catch {
        localStorage.removeItem('personaLab_user')
        setState(prev => ({ ...prev, isLoading: false }))
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const { user } = await simulateAuth(email)
      localStorage.setItem('personaLab_user', JSON.stringify(user))
      setState({
        user,
        isLoading: false,
        isAuthenticated: true
      })
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('personaLab_user')
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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