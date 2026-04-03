import { NextResponse } from 'next/server'
import { runAnalysisPipeline } from '@/services/ai-engine/analyzeController'
import type { AnalysisRequest } from '@/types/analysis.types'

/**
 * AI Engine API Handler for PersonaLab.
 * Accepts a URL and returns structured UX analysis.
 */
export async function POST(req: Request) {
  try {
    const { url, user_id, project_id, mock_mode }: AnalysisRequest = await req.json()
    
    if (!url || !user_id || !project_id) {
       return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }
    
    console.log(`[API-Analyze] Starting pipeline for ${url}...`)
    
    const analysis = await runAnalysisPipeline({
      url,
      user_id,
      project_id,
      mock_mode: mock_mode ?? (process.env.MOCK_MODE === 'true')
    })
    
    return NextResponse.json(analysis)
    
  } catch (error) {
    console.error('[API-Analyze] Handler critical error:', error)
    return NextResponse.json({ 
      error: 'Analysis engine encountered a critical error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
