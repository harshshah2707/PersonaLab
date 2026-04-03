'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { URLInput } from '@/components/landing/URLInput'
import { Zap, Users, BarChart3, Sparkles, AlertCircle, RefreshCw, CheckCircle2, Loader2, MousePointer2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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

const MAX_ANALYSIS_TIME = 30000 // 30 seconds

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
      setAnalysisState('validating')
      setCurrentStage(0)
      setProgress(5)
      await new Promise(resolve => setTimeout(resolve, ANALYSIS_STAGES[0].duration))
      
      if (Date.now() - startTime > MAX_ANALYSIS_TIME) {
        throw new Error('Analysis timeout')
      }
      
      setAnalysisState('analyzing')
      let currentProgress = 10
      
      for (let i = 1; i < ANALYSIS_STAGES.length; i++) {
        setCurrentStage(i)
        const stageProgress = (i / ANALYSIS_STAGES.length) * 90
        const progressIncrement = (stageProgress - currentProgress) / 4
        
        for (let j = 0; j < 4; j++) {
          await new Promise(resolve => setTimeout(resolve, ANALYSIS_STAGES[i].duration / 4))
          currentProgress += progressIncrement
          setProgress(Math.min(currentProgress, 95))
          
          if (Date.now() - startTime > MAX_ANALYSIS_TIME) {
            throw new Error('Analysis timeout')
          }
        }
      }
      
      setProgress(100)
      setAnalysisState('success')
      sessionStorage.setItem('personaLab_analysisUrl', url)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
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
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-violet/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-96 bg-cyan/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald/10 border border-emerald/20 text-emerald text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>AI-Powered User Simulation Engine v2.0</span>
          </div>
          
          {/* Headline */}
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="premium-gradient-text">Capture conversions</span>
              <br />
              <span className="emerald-gradient-text">before you launch.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Don&apos;t wait for real users to find friction. Our AI personas simulate 
              authentic behavior patterns to identify drop-offs and optimize your UX in seconds.
            </p>
          </div>
          
          {/* Action Area */}
          <div className="relative max-w-2xl mx-auto pt-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            {analysisState === 'idle' ? (
              <URLInput
                onSubmit={handleURLSubmit}
                isLoading={isLoading}
                placeholder="Enter your product URL (e.g., https://acme.com)"
                className="shadow-2xl shadow-primary/10"
              />
            ) : (
              <div className={cn(
                "glass-panel p-8 rounded-3xl border-white/10 shadow-2xl relative overflow-hidden",
                isError && "border-destructive/30"
              )}>
                {isLoading && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald/10">
                          <Loader2 className="w-5 h-5 animate-spin text-emerald" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-foreground">
                            {ANALYSIS_STAGES[currentStage]?.label}
                          </p>
                          <p className="text-xs text-muted-foreground">This may take a moment...</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold emerald-gradient-text">{Math.round(progress)}%</span>
                    </div>
                    
                    <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full bg-gradient-to-r from-emerald to-cyan transition-all duration-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 animate-shimmer" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                       {ANALYSIS_STAGES.map((stage, i) => (
                         <div 
                           key={stage.id} 
                           className={cn(
                             "flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold transition-colors",
                             i <= currentStage ? "text-emerald" : "text-muted-foreground/40"
                           )}
                         >
                           {i < currentStage ? <CheckCircle2 className="w-3 h-3" /> : <div className={cn("w-1.5 h-1.5 rounded-full", i === currentStage ? "bg-emerald animate-pulse" : "bg-current")} />}
                           {stage.id}
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {isSuccess && (
                   <div className="py-4 space-y-4 text-center animate-in zoom-in-95 duration-500">
                     <div className="w-16 h-16 bg-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald/30">
                       <CheckCircle2 className="w-8 h-8 text-emerald" />
                     </div>
                     <h3 className="text-xl font-bold">Analysis Complete!</h3>
                     <p className="text-muted-foreground">We&apos;ve mapped your user journeys. Redirecting to dashboard...</p>
                   </div>
                )}

                {isError && error && (
                  <div className="text-left space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-destructive/10">
                        <AlertCircle className="w-6 h-6 text-destructive" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-foreground">Analysis Preempted</p>
                        <p className="text-sm text-muted-foreground">{error.message}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      {error.canRetry && (
                        <Button
                          onClick={handleRetry}
                          size="sm"
                          className="bg-foreground text-background hover:bg-foreground/90 font-bold"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Retry Analysis
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        onClick={handleCancel}
                        size="sm"
                        className="font-bold"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-12 text-sm font-medium text-muted-foreground/60 animate-in fade-in delay-500">
            <div className="flex items-center gap-2 group cursor-default transition-colors hover:text-emerald">
              <Users className="w-4 h-4 transition-colors group-hover:text-emerald" />
              <span>Multi-Persona Simulation</span>
            </div>
            <div className="flex items-center gap-2 group cursor-default transition-colors hover:text-cyan">
              <BarChart3 className="w-4 h-4 transition-colors group-hover:text-cyan" />
              <span>Predictive Conversion Heatmaps</span>
            </div>
            <div className="flex items-center gap-2 group cursor-default transition-colors hover:text-violet">
              <Sparkles className="w-4 h-4 transition-colors group-hover:text-violet" />
              <span>AI-Driven UX Optimization</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}