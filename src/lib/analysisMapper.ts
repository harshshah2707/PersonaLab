import { WebsiteAnalysis, PersonaProfile, AIInsight, HeatmapPoint } from '@/types'
import { AnalysisResponse } from '@/types/analysis.types'

/**
 * Maps the AI Engine's raw JSON output (AnalysisResponse) to the 
 * frontend's expected data structure (WebsiteAnalysis).
 * Handles ID generation and complex object mapping.
 */
export function mapAnalysisResponseToFrontend(response: AnalysisResponse, url: string): WebsiteAnalysis {
  const analysisId = `analysis_${Date.now()}`
  
  // Map Personas
  const personas: PersonaProfile[] = response.personas.map((p, i) => ({
    id: `persona_${i + 1}`,
    name: p.name,
    role: p.role,
    goal: p.goal,
    painPoints: p.pain_points,
    motivations: ['Efficiency', 'ROI', 'Ease of Use'], // Defaults
    quote: p.quote,
    conversionLikelihood: (response.conversion_rate / 100) * (0.8 + Math.random() * 0.4),
    behaviorPattern: {
      browsingStyle: i % 2 === 0 ? 'scanner' : 'reader',
      decisionSpeed: 'moderate',
      riskTolerance: 0.5,
      priceSensitivity: 0.4
    },
    demographics: {
      age: 30 + (i * 5),
      gender: i % 2 === 0 ? 'Female' : 'Male',
      location: 'Global',
      techSavviness: 0.8
    }
  }))

  // Map Insights
  const insights: AIInsight[] = response.insights.map((text, i) => ({
    id: `insight_${i + 1}`,
    title: text.split('.')[0], // Use first sentence as title if possible
    description: text,
    priority: i === 0 ? 'high' : 'medium',
    category: 'conversion',
    recommendation: `Implement optimization strategy for ${text.toLowerCase().split(' ')[0]}`,
    impact: {
      level: 'high',
      estimatedImprovement: '+12%',
      confidence: 0.85
    },
    evidence: [],
    implementationStatus: 'pending',
    statusHistory: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }))

  // Map Heatmap Points from Friction Points
  const heatmapPoints: HeatmapPoint[] = response.friction_points.map((fp, i) => ({
    id: `hp_${i + 1}`,
    x: fp.x,
    y: fp.y,
    intensity: fp.severity === 'high' ? 0.9 : fp.severity === 'medium' ? 0.6 : 0.3,
    type: fp.severity === 'high' ? 'emerald' : 'cyan',
    label: fp.issue,
    description: `User hesitation detected at coordinates [${fp.x}, ${fp.y}] due to: ${fp.issue}`
  }))

  return {
    id: analysisId,
    url,
    summary: response.summary,
    metrics: {
      conversionRate: response.conversion_rate,
      uxScore: response.ux_score,
      engagement: response.engagement_score,
      dropOffRisk: response.ux_score < 60 ? 'high' : response.ux_score < 80 ? 'medium' : 'low',
      trend: {
        conversionRate: 2.1,
        uxScore: 1.5,
        engagement: -0.5
      }
    },
    personas,
    insights,
    heatmapPoints,
    frictionPoints: response.friction_points.map(fp => fp.issue)
  }
}
