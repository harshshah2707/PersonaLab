import { chromium, Browser, Page } from 'playwright'
import { BrowserAgentRequest, BrowserAgentResponse } from './types'
import { captureFullPageScreenshot } from './screenshotService'
import { simulateUserBehavior } from './interactionService'
import { extractClickableElements } from './elementExtractor'

/**
 * Main Controller for the Browser Agent.
 * High-fidelity, lightweight simulation engine.
 */
export async function runBrowserAgent(req: BrowserAgentRequest): Promise<BrowserAgentResponse> {
  const { url, project_id } = req
  let browser: Browser | null = null
  let page: Page | null = null

  console.log(`[Browser-Agent] Launching agent session for ${url}...`)

  try {
    // Launch Chromium (Headless for prod, Headful for visual debugging)
    browser = await chromium.launch({ 
      headless: process.env.BROWSER_HEADLESS === 'false' ? false : true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    })
    
    const context = await browser.newContext({ 
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1
    })
    
    page = await context.newPage()

    // 1. Navigate & Wait
    const response = await page.goto(url, { waitUntil: 'load', timeout: 30000 })
    if (!response || !response.ok()) {
      throw new Error(`Navigation failed with status: ${response?.status()}`)
    }
    
    // Stabilize UI
    await page.waitForTimeout(2000)

    // 2. Capture Screenshot (Standard and Uploaded)
    const { buffer, url: screenshot_url } = await captureFullPageScreenshot(page, project_id)

    // 3. User Simulation (Trace generation)
    const interaction_trace = await simulateUserBehavior(page)

    // 4. Extract Interactive Nodes
    const clickable_elements = await extractClickableElements(page)

    // 5. Build Metadata
    const page_title = await page.title()

    return {
      screenshot_url,
      screenshot_buffer: buffer,
      page_title,
      clickable_elements,
      interaction_trace
    }

  } catch (error) {
    console.error('[Browser-Agent] Session critical failure:', error)
    
    // Failsafe response as per instructions
    return {
      page_title: 'Unreachable Host',
      clickable_elements: [],
      interaction_trace: ['navigation_failed', 'interaction_aborted'],
      screenshot_url: 'https://placehold.co/1280x800?text=Navigation+Failed'
    }
    
  } finally {
    if (browser) await browser.close()
  }
}
