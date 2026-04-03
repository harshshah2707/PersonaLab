import { chromium } from 'playwright'

/**
 * Service to capture screenshots of a given URL.
 * Falls back to a mock/placeholder if Playwright fails or is not available.
 */
export async function captureScreenshot(url: string): Promise<Buffer | null> {
  console.log(`[ScreenshotService] Capturing ${url}...`)
  
  try {
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()
    
    // Set a realistic viewport
    await page.setViewportSize({ width: 1280, height: 800 })
    
    // Navigate with a fast strategy
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    
    // Minimal wait for layout stability
    await new Promise(res => setTimeout(res, 1000))
    
    const screenshotBuffer = await page.screenshot({ 
      fullPage: false, // For LLM analysis, the fold is often enough
      type: 'jpeg',
      quality: 80 
    })
    
    await browser.close()
    return screenshotBuffer
    
  } catch (error) {
    console.error(`[ScreenshotService] Failed to capture ${url}:`, error)
    return null
  }
}
