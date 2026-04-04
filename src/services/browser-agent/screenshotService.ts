import { Page } from 'playwright'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Captures a high-resolution snapshot of the target viewport.
 * 🏁🌟 Fallback: Returns a Data-URI if Supabase Storage is not configured.
 */
export async function captureFullPageScreenshot(page: Page, projectId?: string): Promise<{ buffer: Buffer; url: string }> {
  console.log('[Browser-Agent] Capturing high-resolution viewport...')
  
  // Set viewport to the standard laboratory desktop size
  await page.setViewportSize({ width: 1280, height: 800 })
  
  // Wait for images and layouts to settle
  await page.waitForLoadState('networkidle')
  
  const buffer = await page.screenshot({ 
    fullPage: false, // Laboratory view: Above-the-fold focus
    type: 'jpeg',
    quality: 85 
  })

  let screenshotUrl: string = ''

  // Logic: Prioritize Supabase Storage for persistent audits 🚀 🏁🌟
  const isSupabaseValid = supabaseKey && supabaseKey.length > 20 // Basic check for real key vs placeholder 'admin'
  
  if (isSupabaseValid && projectId) {
    try {
      const fileName = `screenshots/${projectId}/${Date.now()}.jpg`
      const { data, error } = await supabase.storage
          .from('analyses')
          .upload(fileName, buffer, { contentType: 'image/jpeg' })

      if (data) {
        const { data: urlData } = supabase.storage.from('analyses').getPublicUrl(fileName)
        screenshotUrl = urlData.publicUrl
      } else if (error) {
        console.warn(`[Browser-Agent] Supabase Storage error: ${error.message}`)
      }
    } catch (err) {
      console.warn('[Browser-Agent] Supabase upload exception, falling back to Data-URI.')
    }
  }

  // 🏁🌟 FAILSAFE: If no Supabase URL is generated, return a base64 Data-URI
  // This ensures the frontend ALWAYS displays the captured snapshot during internal audits.
  if (!screenshotUrl) {
    console.log('[Browser-Agent] Generating local Data-URI for snapshot...')
    const base64Image = buffer.toString('base64')
    screenshotUrl = `data:image/jpeg;base64,${base64Image}`
  }

  return { buffer, url: screenshotUrl }
}
