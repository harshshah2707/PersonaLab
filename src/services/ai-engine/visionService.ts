import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildVisionPrompt } from '../../utils/ai/promptBuilder'
import type { AnalysisResponse } from '../../types/analysis.types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

/**
 * Service to analyze a screenshot using Gemini Vision LLM.
 * Includes structured JSON parsing and retry logic.
 */
export async function analyzeWithVision(screenshotBuffer: Buffer | null): Promise<AnalysisResponse | null> {
  if (!screenshotBuffer) {
    console.warn('[VisionService] No screenshot available, jumping to mock mode.')
    return null
  }
  
  const prompt = buildVisionPrompt()
  const imagePart = {
    inlineData: {
      data: screenshotBuffer.toString('base64'),
      mimeType: 'image/jpeg'
    }
  }
  
  // Retry mechanism for API robustness
  let attempts = 0
  const maxAttempts = 2
  
  while (attempts < maxAttempts) {
    try {
      attempts++
      console.log(`[VisionService] Gemini analysis attempt ${attempts}...`)
      
      const result = await model.generateContent([prompt, imagePart])
      const response = await result.response
      const text = response.text()
      
      // Attempt to clean JSON (LLMs sometimes wrap in ```json)
      const cleanJsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim()
      
      const parsedData: AnalysisResponse = JSON.parse(cleanJsonStr)
      return parsedData
      
    } catch (error) {
      console.error(`[VisionService] Analysis attempt ${attempts} failed:`, error)
      if (attempts === maxAttempts) return null
    }
  }
  
  return null
}

/**
 * Fallback realistic mock data strategy for Hackathon environments.
 * Returns a high-quality analysis that mimics real user behavior.
 */
export function generateMockAnalysis(url: string = 'https://example.com'): AnalysisResponse {
  let host = 'Target Node'
  try {
     host = new URL(url).hostname
  } catch (e) {}
  
  return {
    conversion_rate: 4.2 + (Math.random() * 2),
    ux_score: 75 + (Math.random() * 15),
    engagement_score: 60 + (Math.random() * 20),
    screenshot_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600&h=1200', // 🖼️ PREMIUM FALLBACK SCREENSHOT 🏁🌟
    personas: [
      {
        name: 'Sarah Chen',
        role: 'Startup Founder',
        goal: `Evaluate ${host}'s scalability for a fast-moving SaaS team.`,
        pain_points: ['Critical info buried below the fold', 'Pricing tiered confusingly'],
        quote: "I just needed to know how the API works, but I had to navigate through three menus."
      },
      {
        name: 'Marcus Johnson',
        role: 'Product Manager',
        goal: `Understand technical implementation speed and support quality on ${host}.`,
        pain_points: ['Low hierarchy of primary CTA', 'No clear social proof in hero section'],
        quote: "The value prop is clear but the call to actions are competing with each other."
      },
      {
        name: 'Emily Davis',
        role: 'Growth Marketer',
        goal: `Identify conversion bottlenecks and landing page performance on ${host}.`,
        pain_points: ['Mobile navigation is clunky', 'Form fields are too numerous'],
        quote: "I was looking for a demo, but the form felt like a tax audit."
      }
    ],
    friction_points: [
      { x: 50, y: 30, issue: 'Primary heading lacks visual weight', severity: 'medium' },
      { x: 80, y: 15, issue: 'Navigation is dense and overwhelming', severity: 'high' }
    ],
    insights: [
      'Value proposition currently lacks a specific benefit statement.',
      'Primary call-to-action color doesn\'t contrast enough with background.',
      'Social proof is too distal from conversion triggers.'
    ],
    summary: `Comprehensive evaluation of ${host} reveals strong core logic but significant friction in information hierarchy and action clarity.`,
    confidence_score: 0.92,
    analysis_time_ms: 1200 + Math.random() * 400
  }
}
