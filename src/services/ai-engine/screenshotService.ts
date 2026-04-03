import { chromium } from 'playwright'

/**
 * Service to capture screenshots of a given URL.
 * Supports both local Chromium and remote Browserless.io (required for Vercel).
 */
export async function captureScreenshot(url: string): Promise<Buffer | null> {
  console.log(`[ScreenshotService] Capturing ${url}...`)
  
  const browserWSEndpoint = process.env.BROWSER_WS_ENDPOINT
  let browser

  try {
    if (browserWSEndpoint) {
      console.log(`[ScreenshotService] Connecting to remote browser...`)
      browser = await chromium.connect(browserWSEndpoint)
    } else {
      console.log(`[ScreenshotService] Launching local browser...`)
      browser = await chromium.launch({ headless: true })
    }

    const page = await browser.newPage()
    
    // Set a realistic viewport
    await page.setViewportSize({ width: 1280, height: 800 })
    
    // Navigate with a fast strategy
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    
    // Minimal wait for layout stability
    await new Promise(res => setTimeout(res, 1000))
    
    const screenshotBuffer = await page.screenshot({ 
      fullPage: false, 
      type: 'jpeg',
      quality: 80 
    })
    
    await browser.close()
    return screenshotBuffer
    
  } catch (error: any) {
    console.error(`[ScreenshotService] Failed to capture ${url}:`, error.message)
    if (browser) await (browser as any).close().catch(() => {})
    return null
  }
}
