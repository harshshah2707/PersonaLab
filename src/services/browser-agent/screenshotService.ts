import { Page } from 'playwright'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function captureFullPageScreenshot(page: Page, projectId?: string): Promise<{ buffer: Buffer; url?: string }> {
  console.log('[Browser-Agent] Capturing high-resolution viewport...')
  
  // Set viewport to a common desktop size for consistent mapping
  await page.setViewportSize({ width: 1280, height: 800 })
  
  const buffer = await page.screenshot({ 
    fullPage: false, // We favor the "first section" view for better AI vision context
    type: 'jpeg',
    quality: 85 
  })

  // Optional: Upload to Supabase Storage if configured
  let publicUrl: string | undefined
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && projectId) {
    try {
      const fileName = `screenshots/${projectId}/${Date.now()}.jpg`
      const { data, error } = await supabase.storage
        .from('analyses')
        .upload(fileName, buffer, { contentType: 'image/jpeg' })

      if (data) {
        const { data: urlData } = supabase.storage.from('analyses').getPublicUrl(fileName)
        publicUrl = urlData.publicUrl
      }
    } catch (err) {
      console.warn('[Browser-Agent] Supabase upload failed, proceeding with local-only flow.')
    }
  }

  return { buffer, url: publicUrl }
}
