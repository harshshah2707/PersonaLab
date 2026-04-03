'use client'

import { useState, useCallback, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AlertCircle, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'

export interface URLValidationResult {
  isValid: boolean
  error?: string
  errorType?: 'format' | 'protocol' | 'blocked' | 'accessible'
}

export interface URLInputProps {
  placeholder?: string
  onSubmit: (url: string) => void
  isLoading?: boolean
  disabled?: boolean
  className?: string
  validateOnBlur?: boolean
  showValidationStatus?: boolean
}

// Blocked URL patterns for security (internal networks, localhost, etc.)
const BLOCKED_PATTERNS = [
  /^localhost$/i,
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^192\.168\.\d{1,3}\.\d{1,3}$/,
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/,
  /^0\.0\.0\.0$/,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
  /\.local$/i,
  /\.internal$/i,
  /\.localhost$/i,
]

const BLOCKED_PROTOCOLS = [
  'javascript:',
  'data:',
  'vbscript:',
  'file:',
]

/**
 * Validates URL format and security constraints
 */
export function validateURL(url: string): URLValidationResult {
  // Check for empty input
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'Please enter a URL', errorType: 'format' }
  }

  // Check for blocked protocols first (before URL parsing to avoid issues)
  const lowerUrl = url.toLowerCase().trim()
  for (const protocol of BLOCKED_PROTOCOLS) {
    if (lowerUrl.startsWith(protocol)) {
      return { isValid: false, error: 'This protocol is not allowed for security reasons', errorType: 'protocol' }
    }
  }

  let parsedUrl: URL
  
  // Try to parse the URL
  try {
    // Add https:// if no protocol is specified
    const urlWithProtocol = url.match(/^https?:\/\//i) ? url : `https://${url}`
    parsedUrl = new URL(urlWithProtocol)
  } catch {
    return { isValid: false, error: 'Invalid URL format', errorType: 'format' }
  }

  // Check protocol
  const protocol = parsedUrl.protocol.toLowerCase()
  
  // Only allow http and https
  if (protocol !== 'http:' && protocol !== 'https:') {
    return { isValid: false, error: 'Only HTTP and HTTPS protocols are supported', errorType: 'protocol' }
  }

  // Check for blocked hosts (internal networks, localhost, etc.)
  const hostname = parsedUrl.hostname.toLowerCase()
  
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(hostname)) {
      return { 
        isValid: false, 
        error: 'Internal network addresses are not allowed for security reasons', 
        errorType: 'blocked' 
      }
    }
  }

  // Check for IP addresses that might be internal
  const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
  const ipMatch = hostname.match(ipPattern)
  if (ipMatch) {
    const [, a, b, c, d] = ipMatch.map(Number)
    // Check if it's a valid IP and not in blocked ranges
    if (a === 0 || a >= 224 || (a === 169 && b === 254)) {
      return { 
        isValid: false, 
        error: 'This IP address range is not allowed', 
        errorType: 'blocked' 
      }
    }
  }

  // Check for valid TLD (at least one dot or be a known single-word domain)
  if (!hostname.includes('.') && !['localhost'].includes(hostname)) {
    return { isValid: false, error: 'Please enter a valid domain name', errorType: 'format' }
  }

  return { isValid: true }
}

/**
 * Normalizes URL by adding protocol if missing
 */
export function normalizeURL(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return trimmed
  
  // Add https:// if no protocol is specified
  return trimmed.match(/^https?:\/\//i) ? trimmed : `https://${trimmed}`
}

export function URLInput({
  placeholder = 'https://your-saas.com',
  onSubmit,
  isLoading = false,
  disabled = false,
  className,
  validateOnBlur = true,
  showValidationStatus = true,
}: URLInputProps) {
  const [url, setUrl] = useState('')
  const [validation, setValidation] = useState<URLValidationResult>({ isValid: true })
  const [isFocused, setIsFocused] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Clear error when URL changes
  useEffect(() => {
    if (hasInteracted && validation.error) {
      setValidation({ isValid: true })
    }
  }, [url])

  const handleValidation = useCallback((value: string) => {
    const result = validateURL(value)
    setValidation(result)
    return result
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    if (validateOnBlur && url.trim()) {
      handleValidation(url)
    }
  }, [url, validateOnBlur, handleValidation])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    setHasInteracted(true)
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setValidation({ isValid: false, error: 'Please enter a URL', errorType: 'format' })
      return
    }

    const result = handleValidation(url)
    
    if (result.isValid) {
      const normalizedUrl = normalizeURL(url)
      onSubmit(normalizedUrl)
    }
  }, [url, handleValidation, onSubmit])

  const showSuccess = showValidationStatus && hasInteracted && !isFocused && validation.isValid && url.trim()
  const showError = showValidationStatus && validation.error && hasInteracted && !isFocused

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)} noValidate>
      <div className="flex flex-col sm:flex-row gap-3 p-2 bg-secondary/50 rounded-2xl border border-border/50 backdrop-blur-sm transition-all duration-200 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
        <div className="relative flex-1">
          <Input
            type="url"
            placeholder={placeholder}
            value={url}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled || isLoading}
            className={cn(
              "h-12 text-base bg-background/50 border-0 focus-visible:ring-1 pr-10",
              showError && "focus-visible:ring-destructive",
              showSuccess && "focus-visible:ring-emerald-500"
            )}
            aria-invalid={showError ? 'true' : 'false'}
            aria-describedby={showError ? 'url-error' : undefined}
          />
          
          {/* Validation status icon */}
          {showValidationStatus && hasInteracted && !isFocused && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : validation.isValid && url.trim() ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : validation.error ? (
                <AlertCircle className="w-5 h-5 text-destructive" />
              ) : null}
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          size="lg" 
          disabled={isLoading || disabled}
          variant="emerald"
          className="h-12 px-8"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Run Simulation
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Error message */}
      {showError && (
        <div 
          id="url-error" 
          className="mt-2 flex items-center gap-2 text-sm text-destructive animate-in fade-in slide-in-from-top-1 duration-200"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{validation.error}</span>
        </div>
      )}
    </form>
  )
}