"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { mockAnalysis } from '@/lib/mockData'
import type { WebsiteAnalysis, PersonaProfile, AIInsight, HeatmapPoint } from '@/types'

interface DashboardContextType {
  analysis: WebsiteAnalysis | null
  isAnalyzing: boolean
  selectedPersona: string | null
  setSelectedPersona: (id: string | null) => void
  analysisUrl: string
  refreshAnalysis: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)
  const [analysisUrl, setAnalysisUrl] = useState<string>('')

  useEffect(() => {
    const storedUrl = sessionStorage.getItem('personaLab_analysisUrl')
    if (storedUrl) {
      setAnalysisUrl(storedUrl)
    }

    const timer = setTimeout(() => {
      setAnalysis(mockAnalysis)
      setIsAnalyzing(false)
      setSelectedPersona(mockAnalysis.personas[0]?.id || null)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const refreshAnalysis = () => {
    setIsAnalyzing(true)
    const timer = setTimeout(() => {
      setAnalysis(mockAnalysis)
      setIsAnalyzing(false)
      setSelectedPersona(mockAnalysis.personas[0]?.id || null)
    }, 1500)
    return () => clearTimeout(timer)
  }

  return (
    <DashboardContext.Provider 
      value={{ 
        analysis, 
        isAnalyzing, 
        selectedPersona, 
        setSelectedPersona,
        analysisUrl,
        refreshAnalysis
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}