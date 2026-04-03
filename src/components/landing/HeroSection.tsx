'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { URLInput } from '@/components/landing/URLInput'
import { Zap, Users, BarChart3, Sparkles, AlertCircle, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react'

type AnalysisState = 'idle' | 'validating' | 'analyzing' | 'success' | 'error'

interface AnalysisError {
  message: string
  canRetry: boolean
  errorType: 'timeout' | 'network' | 'validation' | 'unknown'
}

const ANALYSIS_STAGES = [
  { id: 'validate', label: 'Validating URL', duration: 500 },
  { id: 'scrape', label: 'Analyzing website structure', duration: 2000 },
  { id: 'personas', label: 'Generating AI personas', duration: 3000 },
  { id: 'simulate', label: 'Running behavior simulations', duration: 4000 },
  { id: 'insights', label: 'Compiling insights', duration: 1500 },
]

const MAX_ANALYSIS_TIME = 30000 // 30 seconds per requirements

export function HeroSection() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle')
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState(0)
  const [error, setError] = useState<AnalysisError | null>(null)
  const [submittedUrl, setSubmittedUrl] = useState<string>('')
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const simulateAnalysis = useCallback(async (url: string): Promise<void> => {
    const startTime = Date.now()
    
    try {
      // Stage 1: Validation
      setAnalysisState('validating')
      setCurrentStage(0)
      setProgress(5)
      await new Promise(resolve => setTimeout(resolve, ANALYSIS_STAGES[0].duration))
      
      // Check for timeout
      if (Date.now() - startTime > MAX_ANALYSIS_TIME) {
        throw new Error('Analysis timeout')
      }
      
      // Stage 2-5: Analysis stages
      setAnalysisState('analyzing')
      let currentProgress = 10
      
      for (let i = 1; i < ANALYSIS_STAGES.length; i++) {
        setCurrentStage(i)
        
        // Simulate progress within each stage
        const stageProgress = (i / ANALYSIS_STAGES.length) * 90
        const progressIncrement = (stageProgress - currentProgress) / 4
        
        for (let j = 0; j < 4; j++) {
          await new Promise(resolve => setTimeout(resolve, ANALYSIS_STAGES[i].duration / 4))
          currentProgress += progressIncrement
          setProgress(Math.min(currentProgress, 95))
          
          // Check for timeout during progress
          if (Date.now() - startTime > MAX_ANALYSIS_TIME) {
            throw new Error('Analysis timeout')
          }
        }
      }
      
      // Complete
      setProgress(100)
      setAnalysisState('success')
      
      // Store URL for dashboard
      sessionStorage.setItem('personaLab_analysisUrl', url)
      
      // Brief success state before redirect
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Redirect to dashboard or login
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
        // Store URL and redirect to login with return URL
        router.push(`/login?redirect=/dashboard&url=${encodeURIComponent(url)}`)
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed'
      const isTimeout = errorMessage.includes('timeout')
      
      setError({
        message: isTimeout 
          ? 'Analysis is taking longer than expected. Please try again.'
          : 'Unable to analyze this website. Please check the URL and try again.',
        canRetry: true,
        errorType: isTimeout ? 'timeout' : 'unknown'
      })
      setAnalysisState('error')
    }
  }, [isAuthenticated, router])

  const handleURLSubmit = useCallback(async (url: string) => {
    setSubmittedUrl(url)
    setError(null)
    setProgress(0)
    setCurrentStage(0)
    await simulateAnalysis(url)
  }, [simulateAnalysis])

  const handleRetry = useCallback(() => {
    if (submittedUrl) {
      handleURLSubmit(submittedUrl)
    }
  }, [submittedUrl, handleURLSubmit])

  const handleCancel = useCallback(() => {
    setAnalysisState('idle')
    setProgress(0)
    setCurrentStage(0)
    setError(null)
    setSubmittedUrl('')
  }, [])

  const isLoading = analysisState === 'validating' || analysisState === 'analyzing'
  const isSuccess = analysisState === 'success'
  const isError = analysisState === 'error'

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        {/* Badge */}
        <Badge variant="emerald" className="mb-6 px-4 py-1.5">
          <Zap className="w-3.5 h-3.5 mr-1.5" />
          AI-Powered User Simulation
        </Badge>
        
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
          Test your product
          <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            before users do.
          </span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Generate synthetic users that simulate real behavior. Predict conversions, 
          identify friction, and optimize your UX — without waiting for traffic.
        </p>
        
        {/* URL Input Form */}
        <URLInput
          onSubmit={handleURLSubmit}
          isLoading={isLoading}
          disabled={isLoading || isSuccess}
          placeholder="https://your-saas.com"
          className="max-w-2xl mx-auto mb-8"
        />

        {/* Progress Indicator */}
        {isLoading && (
          <div className="max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-secondary/50 rounded-xl border border-border/50 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {ANALYSIS_STAGES[currentStage]?.label || 'Processing...'}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-3">
                This usually takes 15-30 seconds
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {isSuccess && (
          <div className="max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-primary/10 rounded-xl border border-primary/30 p-6">
              <div className="flex items-center justify-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <span className="text-lg font-medium text-foreground">
                  Analysis complete! Redirecting...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && error && (
          <div className="max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-destructive/10 rounded-xl border border-destructive/30 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Analysis Failed
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {error.message}
                  </p>
                  <div className="flex gap-3">
                    {error.canRetry && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRetry}
                        className="gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>5 AI Personas Generated</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-accent" />
            <span>Real-time Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Instant Insights</span>
          </div>
        </div>
      </div>
    </section>
  )
}