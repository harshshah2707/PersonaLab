// Core data models for PersonaLab

export type TimeRange = '24h' | '7d' | '30d' | 'all'

export interface TimeRangeOption {
  value: TimeRange
  label: string
  hours: number
}

export const TIME_RANGES: TimeRangeOption[] = [
  { value: '24h', label: '24 Hours', hours: 24 },
  { value: '7d', label: '7 Days', hours: 168 },
  { value: '30d', label: '30 Days', hours: 720 },
  { value: 'all', label: 'All Time', hours: Infinity }
]

export interface HistoricalMetricPoint {
  timestamp: Date
  value: number
}

export interface HistoricalMetrics {
  timeRange: TimeRange
  conversionRate: HistoricalMetricPoint[]
  uxScore: HistoricalMetricPoint[]
  engagement: HistoricalMetricPoint[]
  dropOffRisk: Array<{
    timestamp: Date
    value: 'low' | 'medium' | 'high'
  }>
}

export interface MetricsCalculationConfig {
  minConversionRate: number
  maxConversionRate: number
  minUxScore: number
  maxUxScore: number
  minEngagement: number
  maxEngagement: number
}

export const METRICS_BOUNDS: MetricsCalculationConfig = {
  minConversionRate: 0,
  maxConversionRate: 1,
  minUxScore: 0,
  maxUxScore: 100,
  minEngagement: 0,
  maxEngagement: 100
}

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
  historical?: HistoricalMetrics
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

export interface InsightEvidence {
  type: 'metric' | 'heatmap' | 'persona' | 'simulation'
  data: Record<string, unknown>
  description: string
}

export interface InsightImpact {
  level: 'high' | 'medium' | 'low'
  estimatedImprovement: string
  confidence: number
}

export type InsightImplementationStatus = 'pending' | 'in-progress' | 'completed' | 'dismissed'

export interface InsightStatusHistory {
  status: InsightImplementationStatus
  changedAt: Date
  note?: string
}

export interface AIInsight {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: 'navigation' | 'content' | 'conversion' | 'design'
  recommendation: string
  impact: InsightImpact
  evidence: InsightEvidence[]
  implementationStatus: InsightImplementationStatus
  statusHistory: InsightStatusHistory[]
  createdAt: Date
  updatedAt: Date
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

// Extended analysis result for behavior simulation (test compatibility)
export interface WebsiteAnalysisResult {
  url: string
  title: string
  description: string
  structure: {
    pages: Array<{
      url: string
      title: string
      elements: string[]
      loadTime: number
    }>
    forms: Array<{
      id: string
      type: string
      fields: string[]
      hasValidation: boolean
    }>
    navigation: {
      mainLinks: string[]
      hasSearch: boolean
      hasBreadcrumbs: boolean
      depth: number
    }
  }
  content: {
    topics: string[]
    targetAudience: {
      primary: string
      secondary: string[]
      industry: string
      companySize: string
      technicalLevel: string
    }
    language: string
  }
  metadata: {
    analyzedAt: Date
    processingTime: number
  }
}