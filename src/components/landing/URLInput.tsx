'use client'

import { useState, useCallback, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AlertCircle, Loader2, CheckCircle2, ArrowRight, Globe } from 'lucide-react'

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

// Blocked URL patterns for security
const BLOCKED_PATTERNS = [
  /^localhost$/i,
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^192\.168\.\d{1,3}\.\d{1,3}$/,
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/,
  /^0\.0\.0\.0$/,
  /^::1$/,
  /\.local$/i,
]

export function validateURL(url: string): URLValidationResult {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'Please enter a diagnostic node', errorType: 'format' }
  }

  let parsedUrl: URL
  try {
    const urlWithProtocol = url.match(/^https?:\/\//i) ? url : `https://${url}`
    parsedUrl = new URL(urlWithProtocol)
  } catch {
    return { isValid: false, error: 'Invalid architectural node format', errorType: 'format' }
  }

  const hostname = parsedUrl.hostname.toLowerCase()
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(hostname)) {
      return { isValid: false, error: 'Internal nodes are restricted', errorType: 'blocked' }
    }
  }

  if (!hostname.includes('.')) {
    return { isValid: false, error: 'Please enter a valid studio domain', errorType: 'format' }
  }

  return { isValid: true }
}

export function URLInput({
  placeholder = 'https://your-studio.com',
  onSubmit,
  isLoading = false,
  disabled = false,
  className,
}: URLInputProps) {
  const [url, setUrl] = useState('')
  const [validation, setValidation] = useState<URLValidationResult>({ isValid: true })
  const [isFocused, setIsFocused] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    const result = validateURL(url)
    if (result.isValid) onSubmit(url)
    else setValidation(result)
  }, [url, onSubmit])

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
       <div className={cn(
         "flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-[2.5rem] border-2 border-sand shadow-[0_20px_50px_rgba(107,79,59,0.05)] transition-all duration-700",
         isFocused && "border-coffee/20 shadow-[0_30px_70px_rgba(107,79,59,0.1)] scale-[1.02]"
       )}>
          <div className="relative flex-1 flex items-center">
             <div className="absolute left-4 p-2 rounded-xl bg-cream text-coffee/20 group-focus-within:text-coffee/40 transition-colors">
                <Globe className="w-5 h-5" />
             </div>
             <Input
                type="url"
                placeholder={placeholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => { setIsFocused(true); setHasInteracted(true); }}
                onBlur={() => setIsFocused(false)}
                disabled={disabled || isLoading}
                className="h-14 pl-16 pr-12 text-lg bg-transparent border-0 focus-visible:ring-0 placeholder:text-coffee/20 font-medium text-coffee"
             />
             {hasInteracted && !isFocused && url.trim() && (
               <div className="absolute right-4">
                  {validation.isValid ? <CheckCircle2 className="w-5 h-5 text-forest" /> : <AlertCircle className="w-5 h-5 text-terracotta" />}
               </div>
             )}
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || !url.trim()}
            className="h-14 px-10 rounded-2xl bg-coffee text-white hover:opacity-90 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-coffee/10 transition-all active:scale-95 shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Initiate Audit
                <ArrowRight className="w-5 h-5 ml-4" />
              </>
            )}
          </Button>
       </div>

       {validation.error && !isFocused && (
          <div className="mt-4 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-terracotta px-6 animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validation.error}</span>
          </div>
       )}
    </form>
  )
}