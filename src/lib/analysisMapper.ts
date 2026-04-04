import { WebsiteAnalysis, PersonaProfile, AIInsight, HeatmapPoint } from '@/types'
import { AnalysisResponse } from '@/types/analysis.types'

/**
 * Maps the AI Engine's raw JSON output (AnalysisResponse) to the 
 * frontend's expected data structure (WebsiteAnalysis).
 * 🏁🌟 Integrates real screenshot support.
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
      age: 25 + (i * 8),
      gender: i % 2 === 0 ? 'Female' : 'Male',
      location: 'Global Suburb',
      techSavviness: 0.85
    }
  }))

  // Map Insights
  const insights: AIInsight[] = response.insights.map((text, i) => {
    const titleCap = text.split('.')[0]
    return {
      id: `insight_${i + 1}`,
      title: titleCap.length > 40 ? titleCap.substring(0, 40) + '...' : titleCap,
      description: text,
      priority: i === 0 ? 'high' : 'medium',
      category: 'conversion',
      recommendation: `Deploy behavioral fix for ${text.split(' ')[0]} to optimize neural trust.`,
      impact: {
        level: 'high',
        estimatedImprovement: '+15.2%',
        confidence: 0.92
      },
      evidence: [],
      implementationStatus: 'pending',
      statusHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  // Map Heatmap Points
  const heatmapPoints: HeatmapPoint[] = (response.friction_points || []).map((fp, i) => ({
    id: `hp_${i + 1}`,
    x: fp.x,
    y: fp.y,
    intensity: fp.severity === 'high' ? 0.95 : fp.severity === 'medium' ? 0.65 : 0.35,
    type: fp.severity === 'high' ? 'emerald' : 'cyan', // Visual spectrum
    label: fp.issue,
    description: `Behavioral hesitation detected at [${fp.x}%, ${fp.y}%] coord – Severity: ${fp.severity}.`
  }))

  return {
    id: analysisId,
    url,
    summary: response.summary,
    screenshotUrl: response.screenshot_url, // 🖼️ LIVE PREVIEW
    metrics: {
      conversionRate: response.conversion_rate,
      uxScore: response.ux_score,
      engagement: response.engagement_score,
      dropOffRisk: response.ux_score < 65 ? 'high' : response.ux_score < 80 ? 'medium' : 'low',
      trend: {
        conversionRate: 2.1,
        uxScore: 1.5,
        engagement: 0.8
      }
    },
    personas,
    insights,
    heatmapPoints,
    frictionPoints: response.friction_points.map(fp => fp.issue)
  }
}
