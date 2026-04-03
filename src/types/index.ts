// Core data models for PersonaLab

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
}

export interface AnalysisSession {
  id: string
  url: string
  status: 'pending' | 'analyzing' | 'completed' | 'failed'
  createdAt: Date
  completedAt?: Date
}

export interface PersonaProfile {
  id: string
  name: string
  role: string
  goal: string
  painPoints: string[]
  quote: string
  conversionLikelihood: number
  behaviorPattern: {
    browsingStyle: 'scanner' | 'reader' | 'explorer'
    decisionSpeed: 'fast' | 'moderate' | 'deliberate'
  }
  demographics: {
    age: number
    techSavviness: number
  }
}

export interface MetricsData {
  conversionRate: number
  uxScore: number
  dropOffRisk: 'low' | 'medium' | 'high'
  engagement: number
  trend: {
    conversionRate: number
    uxScore: number
    engagement: number
  }
}

export interface HeatmapPoint {
  id: string
  x: number
  y: number
  intensity: number
  type: 'emerald' | 'cyan'
  label: string
  description: string
}

export interface AIInsight {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'navigation' | 'content' | 'conversion' | 'design'
  impact: 'high' | 'medium' | 'low'
}

export interface WebsiteAnalysis {
  id: string
  url: string
  metrics: MetricsData
  personas: PersonaProfile[]
  heatmapPoints: HeatmapPoint[]
  insights: AIInsight[]
  frictionPoints: string[]
  summary: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}