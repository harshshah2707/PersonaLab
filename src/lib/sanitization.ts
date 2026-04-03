/**
 * Simple sanitization utility to prevent XSS in dynamic content.
 * React already provides built-in protection against most XSS, 
 * but this adds an extra layer of safety for AI-generated text.
 */
export function sanitizeContent(content: string): string {
  if (!content) return ''
  
  return content
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "") // Remove scripts
    .replace(/on\w+="[^"]*"/gim, "") // Remove inline event handlers
    .replace(/on\w+='[^']*'/gim, "")
    .replace(/on\w+=[^>\s]*/gim, "")
    .replace(/javascript:[^"'>]*/gim, "") // Remove javascript: URIs
}

/**
 * Validates if a string is safe to render as-is.
 */
export function isSafeContent(content: string): boolean {
  const unsafePatterns = [
    /<script\b[^>]*>([\s\S]*?)<\/script>/i,
    /on\w+="[^"]*"/i,
    /javascript:/i
  ]
  
  return !unsafePatterns.some(pattern => pattern.test(content))
}
