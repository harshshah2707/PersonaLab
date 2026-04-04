export type Severity = 'low' | 'medium' | 'high'

export interface Persona {
  name: string
  role: string
  goal: string
  pain_points: string[]
  quote: string
}

export interface FrictionPoint {
  x: number
  y: number
  issue: string
  severity: Severity
}

export interface AnalysisResponse {
  conversion_rate: number
  ux_score: number
  engagement_score: number
  personas: Persona[]
  friction_points: FrictionPoint[]
  insights: string[]
  summary: string
  screenshot_url?: string // 🚀 Snapshot from automation engine
  confidence_score?: number
  analysis_time_ms?: number
  reasoning_trace?: string
}

export interface AnalysisRequest {
  url: string
  user_id: string
  project_id: string
  mock_mode?: boolean
}
