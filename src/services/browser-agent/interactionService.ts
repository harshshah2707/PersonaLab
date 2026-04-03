import { Page } from 'playwright'

/**
 * Service to simulate realistic user behavior.
 * This triggers the 'AI is exploring your site' feeling.
 */
export async function simulateUserBehavior(page: Page): Promise<string[]> {
  const trace: string[] = ['page_loaded']
  const viewport = page.viewportSize() || { width: 1280, height: 800 }

  console.log('[Browser-Agent] Starting interaction simulation...')

  // Step 1: Scan Hero section (Random mouse moves at top)
  for (let i = 0; i < 3; i++) {
    const x = Math.random() * viewport.width
    const y = Math.random() * (viewport.height * 0.4) // Top 40%
    await page.mouse.move(x, y, { steps: 5 })
    await page.waitForTimeout(300 + Math.random() * 500)
    trace.push(`scanned_hero_section_${i + 1}`)
  }

  // Step 2: Identify and hover a core CTA
  const buttons = await page.getByRole('button').all()
  if (buttons.length > 0) {
    const target = buttons[0] // Usually primary CTA
    try {
      await target.hover()
      await page.waitForTimeout(800)
      trace.push('hovered_cta')
    } catch (e) {
      console.warn('[Browser-Agent] Hover failed for target button.')
    }
  }

  // Step 3: Scroll halfway (Simulate reading)
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.5, behavior: 'smooth' }))
  await page.waitForTimeout(1500)
  trace.push('scrolled_50_percent')

  // Step 4: Scan middle section (Random mouse moves)
  for (let i = 0; i < 2; i++) {
    const x = Math.random() * viewport.width
    const y = (viewport.height * 0.5) + (Math.random() * 200)
    await page.mouse.move(x, y, { steps: 5 })
    await page.waitForTimeout(400)
    trace.push(`scanned_middle_section_${i + 1}`)
  }

  // Step 5: Final Pause (Hesitation / Decision)
  await page.waitForTimeout(1000)
  trace.push('interaction_complete')

  return trace
}
