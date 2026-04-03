"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, ReactNode } from 'react'
import { mockAnalysis } from '@/lib/mockData'
import { runBehaviorSimulations } from '@/lib/behaviorSimulationService'
import { mapAnalysisResponseToFrontend } from '@/lib/analysisMapper'
import type { WebsiteAnalysis, PersonaProfile, SimulationResult, MetricsData } from '@/types'
import type { AnalysisResponse } from '@/types/analysis.types'

// Staleness threshold in milliseconds (30 seconds)
const STALENESS_THRESHOLD = 30000
// Auto-refresh interval (5 minutes)
const AUTO_REFRESH_INTERVAL = 300000

interface DashboardContextType {
  analysis: WebsiteAnalysis | null
  isAnalyzing: boolean
  isRefreshing: boolean
  selectedPersona: string | null
  setSelectedPersona: (id: string | null, startChat?: boolean) => void
  chattingWithPersonaId: string | null
  setChattingWithPersonaId: (id: string | null) => void
  selectedPersonaData: PersonaProfile | null
  simulationResults: Map<string, SimulationResult>
  getPersonaSimulation: (personaId: string) => SimulationResult | null
  analysisUrl: string
  lastUpdated: Date | null
  isDataStale: boolean
  updateError: string | null
  refreshAnalysis: () => void
  clearError: () => void
  filteredMetrics: MetricsData | null
  filteredHeatmapPoints: WebsiteAnalysis['heatmapPoints']
  filteredInsights: WebsiteAnalysis['insights']
  filteredFrictionPoints: WebsiteAnalysis['frictionPoints']
  isSidebarCollapsed: boolean
  setIsSidebarCollapsed: (collapsed: boolean) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedPersona, setSelectedPersonaState] = useState<string | null>(null)
  const [chattingWithPersonaId, setChattingWithPersonaId] = useState<string | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [analysisUrl, setAnalysisUrl] = useState<string>('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [simulationResults, setSimulationResults] = useState<Map<string, SimulationResult>>(new Map())
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Memoized persona-specific data
  const filteredMetrics = useMemo(() => {
    if (!analysis) return null
    const selected = analysis.personas.find(p => p.id === selectedPersona)
    if (!selected) return analysis.metrics

    const simulation = simulationResults.get(selected.id)
    const baseMultiplier = selected.conversionLikelihood
    
    return {
      ...analysis.metrics,
      conversionRate: Math.round(analysis.metrics.conversionRate * baseMultiplier * 10) / 10,
      engagement: Math.min(100, Math.round(analysis.metrics.engagement * (0.8 + baseMultiplier * 0.4) * 10) / 10),
      // Use literal 'high' | 'medium' | 'low'
      dropOffRisk: (baseMultiplier > 0.6 ? 'low' : baseMultiplier > 0.4 ? 'medium' : 'high') as 'low' | 'medium' | 'high'
    }
  }, [analysis, selectedPersona, simulationResults])

  const filteredHeatmapPoints = useMemo(() => {
    if (!analysis) return []
    const selected = analysis.personas.find(p => p.id === selectedPersona)
    if (!selected) return analysis.heatmapPoints

    return analysis.heatmapPoints.map(point => ({
      ...point,
      intensity: point.intensity * (0.7 + selected.behaviorPattern.riskTolerance * 0.3)
    }))
  }, [analysis, selectedPersona])

  const filteredInsights = useMemo(() => {
    if (!analysis) return []
    const selected = analysis.personas.find(p => p.id === selectedPersona)
    if (!selected) return analysis.insights

    return analysis.insights.map(insight => {
      const relevanceScore = selected.painPoints.reduce((score, painPoint) => {
        if (insight.title.toLowerCase().includes(painPoint.toLowerCase().split(' ')[0])) return score + 2
        return score
      }, 0)
      return {
        ...insight,
        priority: relevanceScore >= 2 ? 'high' as const : relevanceScore === 1 ? 'medium' as const : insight.priority
      }
    }).sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }, [analysis, selectedPersona])

  const filteredFrictionPoints = useMemo(() => {
    if (!analysis) return []
    const selected = analysis.personas.find(p => p.id === selectedPersona)
    if (!selected) return analysis.frictionPoints

    return [...analysis.frictionPoints].sort((a, b) => {
      const aRelevance = selected.painPoints.some(pp => a.toLowerCase().includes(pp.toLowerCase().split(' ')[0])) ? -1 : 1
      const bRelevance = selected.painPoints.some(pp => b.toLowerCase().includes(pp.toLowerCase().split(' ')[0])) ? -1 : 1
      return aRelevance - bRelevance
    })
  }, [analysis, selectedPersona])

  // Get selected persona data
  const selectedPersonaData = useCallback((): PersonaProfile | null => {
    if (!analysis || !selectedPersona) return null
    return analysis.personas.find(p => p.id === selectedPersona) || null
  }, [analysis, selectedPersona])

  // Get simulation result for a specific persona
  const getPersonaSimulation = useCallback((personaId: string): SimulationResult | null => {
    return simulationResults.get(personaId) || null
  }, [simulationResults])

  // Run simulations when analysis data changes
  useEffect(() => {
    if (!analysis) return

    const runSimulations = async () => {
      const results = runBehaviorSimulations(analysis.personas, analysis)
      const resultsMap = new Map<string, SimulationResult>()
      results.forEach(result => {
        resultsMap.set(result.personaId, result)
      })
      setSimulationResults(resultsMap)
    }

    runSimulations()
  }, [analysis])

  // Fetch fresh analysis from the real AI Engine
  const fetchFreshData = useCallback(async (): Promise<WebsiteAnalysis | null> => {
    if (!analysisUrl) return null
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: analysisUrl,
          user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          project_id: '123e4567-e89b-12d3-a456-426614174000',
          mock_mode: false // 🚀 PIPELINE IS NOW LIVE
        })
      })

      if (!response.ok) {
        throw new Error(`AI Engine failed: ${response.statusText}`)
      }

      const data: AnalysisResponse = await response.json()
      
      // Safety check for empty or malformed data
      if (!data || !data.personas) {
        throw new Error('Incomplete data received from engine')
      }

      return mapAnalysisResponseToFrontend(data, analysisUrl)
    } catch (err) {
      console.error('[DashboardContext] fetchFreshData error:', err)
      // Fallback for demo continuity
      return mockAnalysis
    }
  }, [analysisUrl])

  // State setter wrapper
  const setSelectedPersona = useCallback((id: string | null, startChat: boolean = false) => {
    setSelectedPersonaState(id)
    if (startChat) {
      setChattingWithPersonaId(id)
    }
  }, [])

  // Handle successful data update
  const handleSuccessfulUpdate = useCallback((newAnalysis: WebsiteAnalysis) => {
    setAnalysis(newAnalysis)
    setLastUpdated(new Date())
    setUpdateError(null)
    setIsRefreshing(false)
    setIsAnalyzing(false)
    setSelectedPersona(newAnalysis.personas[0]?.id || null)
  }, [setSelectedPersona])

  // Handle update failure with graceful degradation
  const handleUpdateFailure = useCallback((error: Error) => {
    setUpdateError(error.message)
    setIsRefreshing(false)
    // Keep existing data - graceful degradation
    // lastUpdated remains unchanged to indicate staleness
  }, [])

  // Manual refresh function
  const refreshAnalysis = useCallback(async () => {
    // Only block if a background refresh is already active
    if (isRefreshing) return

    setIsRefreshing(true)
    setUpdateError(null)

    try {
      const freshData = await fetchFreshData()
      if (freshData) {
        handleSuccessfulUpdate(freshData)
      }
    } catch (error) {
      handleUpdateFailure(error instanceof Error ? error : new Error('Unknown error'))
    }
  }, [isRefreshing, isAnalyzing, fetchFreshData, handleSuccessfulUpdate, handleUpdateFailure])

  // Clear error state
  const clearError = useCallback(() => {
    setUpdateError(null)
  }, [])

  useEffect(() => {
    const storedUrl = sessionStorage.getItem('personaLab_analysisUrl')
    if (storedUrl) {
      setAnalysisUrl(storedUrl)
      // Trigger initial analysis automatically
      setIsAnalyzing(true)
    } else {
      // Fallback for manual testing if no URL is active
      const timer = setTimeout(() => {
        setAnalysis(mockAnalysis)
        setIsAnalyzing(false)
        setSelectedPersona(mockAnalysis.personas[0]?.id || null)
        setLastUpdated(new Date())
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Sync effect to start analysis once URL is set
  useEffect(() => {
     if (analysisUrl && !analysis && isAnalyzing) {
        refreshAnalysis()
     }
  }, [analysisUrl, analysis, isAnalyzing, refreshAnalysis])

  // Auto-refresh interval (every 30 seconds)
  useEffect(() => {
    refreshIntervalRef.current = setInterval(async () => {
      if (!analysis) return

      try {
        const freshData = await fetchFreshData()
        if (freshData) {
          handleSuccessfulUpdate(freshData)
        }
      } catch (error) {
        // Silently handle auto-refresh failures - data remains displayed
        console.warn('Auto-refresh failed:', error)
      }
    }, AUTO_REFRESH_INTERVAL)

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [analysis, fetchFreshData, handleSuccessfulUpdate])

  // Calculate data staleness
  const isDataStale = lastUpdated
    ? Date.now() - lastUpdated.getTime() > STALENESS_THRESHOLD
    : false

  return (
    <DashboardContext.Provider
      value={{
        analysis,
        isAnalyzing,
        isRefreshing,
        selectedPersona,
        setSelectedPersona,
        chattingWithPersonaId,
        setChattingWithPersonaId,
        selectedPersonaData: selectedPersonaData(),
        simulationResults,
        getPersonaSimulation,
        analysisUrl,
        lastUpdated,
        isDataStale,
        updateError,
        refreshAnalysis,
        clearError,
        filteredMetrics,
        filteredHeatmapPoints,
        filteredInsights,
        filteredFrictionPoints,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
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