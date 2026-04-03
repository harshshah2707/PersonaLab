import { Page } from 'playwright'
import { ClickableElement } from './types'

/**
 * Service to identify and map the clickable elements on the page.
 * Returns normalized coordinates (0-100) instead of raw pixels.
 */
export async function extractClickableElements(page: Page): Promise<ClickableElement[]> {
  console.log('[Browser-Agent] Identifying interactive nodes...')
  
  const viewport = page.viewportSize() || { width: 1280, height: 800 }
  const elements = await page.evaluate(({ width, height }) => {
    // Collect all links and buttons
    const selectors = ['a', 'button', 'input[type="button"]', 'input[type="submit"]', '[role="button"]']
    const nodes = document.querySelectorAll(selectors.join(','))
    
    return Array.from(nodes).map(node => {
      const rect = node.getBoundingClientRect()
      const text = node.textContent?.trim() || ''
      const type = node.tagName.toLowerCase() === 'a' ? 'link' : 'button'
      
      // Calculate normalized coordinates
      return {
        text: text.slice(0, 30),
        x: Math.round((rect.left + rect.width / 2) / width * 100),
        y: Math.round((rect.top + rect.height / 2) / height * 100),
        type,
        // Helper for filtering
        isVisible: rect.width > 0 && rect.height > 0 && rect.top < height && rect.left < width
      }
    })
  }, viewport)

  // Clean and filter elements
  return (elements as any[])
    .filter(el => el.isVisible && el.text !== '')
    .slice(0, 15) // Top-heavy selection to avoid noise
    .map(({ isVisible, ...el }) => el as ClickableElement)
}
