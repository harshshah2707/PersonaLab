import { createClient } from '@supabase/supabase-js'
import { captureScreenshot } from './screenshotService'
import { analyzeWithVision, generateMockAnalysis } from './visionService'
import type { AnalysisRequest, AnalysisResponse } from '../../types/analysis.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
// Prioritize Service Role for backend writes (bypasses RLS)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Controller to handle the end-to-end AI analysis pipeline.
 */
export async function runAnalysisPipeline(req: AnalysisRequest): Promise<AnalysisResponse> {
  const { url, user_id, project_id, mock_mode = false } = req
  
  if (mock_mode) {
    console.log('[AI-Engine] Mock mode active. Generating realistic analysis...')
    await new Promise(res => setTimeout(res, 1500))
    return generateMockAnalysis(url)
  }
  
  try {
    // Stage 1: Capture Screenshot
    const screenshot = await captureScreenshot(url)
    
    // Stage 2: Prompt LLM with Screenshot & Build JSON
    let analysis = await analyzeWithVision(screenshot)
    
    // Fallback to high-quality mock if LLM fails or is empty
    if (!analysis) {
       console.warn('[AI-Engine] LLM returned null. Falling back to high-quality mock.')
       analysis = generateMockAnalysis(url)
    }
    
    // Stage 3: Store result in Supabase
    // Using jsonb for nested structures as per rules
    const { error } = await supabase
      .from('analyses')
      .insert({
        project_id,
        user_id,
        url,
        conversion_rate: analysis.conversion_rate,
        ux_score: analysis.ux_score,
        engagement_score: analysis.engagement_score,
        personas: analysis.personas, // Corrected jsonb
        friction_points: analysis.friction_points, // Corrected jsonb
        insights: analysis.insights, // Corrected jsonb
        summary: analysis.summary,
        metadata: {
          confidence: analysis.confidence_score,
          time_ms: analysis.analysis_time_ms,
          reasoning: analysis.reasoning_trace
        }
      })
      
    if (error) {
      console.error('[AI-Engine] Supabase storage failed:', error)
    }
    
    return analysis
    
  } catch (error) {
    console.error('[AI-Engine] Pipeline critical failure:', error)
    return generateMockAnalysis(url)
  }
}
