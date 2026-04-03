// Core data models for PersonaLab

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
}

// URL Validation types
export type URLValidationErrorType = 'format' | 'protocol' | 'blocked' | 'accessible'

export interface URLValidationResult {
  isValid: boolean
  error?: string
  errorType?: URLValidationErrorType
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
  motivations: string[]
  quote: string
  conversionLikelihood: number
  behaviorPattern: {
    browsingStyle: 'scanner' | 'reader' | 'explorer'
    decisionSpeed: 'fast' | 'moderate' | 'deliberate'
    riskTolerance: number
    priceSensitivity: number
  }
  demographics: {
    age: number
    gender: string
    location: string
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

// Behavior Simulation Types
export type InteractionType = 'click' | 'hover' | 'scroll' | 'navigation' | 'form'

export interface Interaction {
  type: InteractionType
  element: string
  timestamp: number
  duration?: number
  page: string
  targetPage?: string
  metadata?: Record<string, unknown>
}

export interface SimulationResult {
  personaId: string
  interactions: Interaction[]
  converted: boolean
  dropOffPoint?: string
  engagementScore: number
  conversionLikelihood: number
  totalDuration: number
  pagesVisited: string[]
  finalPage: string
}

export interface UserState {
  currentPage: string
  isActive: boolean
  frustration: number
  satisfaction: number
  timeOnPage: number
  scrollDepth: number
  formsStarted: number
  formsCompleted: number
}

export interface SimulationConfig {
  maxInteractions: number
  maxDuration: number
  conversionThreshold: number
  dropOffThreshold: number
}

export interface WebsitePage {
  url: string
  title: string
  elements: string[]
  ctaElements: string[]
  formElements: string[]
  navigationElements: string[]
}

export interface WebsiteStructure {
  pages: WebsitePage[]
  navigation: {
    mainLinks: string[]
    footerLinks: string[]
  }
  forms: Array<{
    type: string
    fields: string[]
  }>
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
  structure?: WebsiteStructure
}