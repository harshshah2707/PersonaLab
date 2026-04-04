'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { URLInput } from '@/components/landing/URLInput'
import { Zap, Users, BarChart3, Sparkles, AlertCircle, RefreshCw, CheckCircle2, Loader2, Target, Fingerprint, MousePointer2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type AnalysisState = 'idle' | 'validating' | 'analyzing' | 'success' | 'error'

interface AnalysisError {
  message: string
  canRetry: boolean
  errorType: 'timeout' | 'network' | 'validation' | 'unknown'
}

const ANALYSIS_STAGES = [
  { id: 'validate', label: 'Validating Logic', duration: 500 },
  { id: 'scrape', label: 'Extracting Dom Structure', duration: 2000 },
  { id: 'personas', label: 'Seeding AI Entities', duration: 3000 },
  { id: 'simulate', label: 'Neural Path Simulation', duration: 4000 },
  { id: 'insights', label: 'Strategic Synthesis', duration: 1500 },
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
          ? 'Extraction timed out. The system requires high-fidelity access.'
          : 'Unable to audit this node. Please verify access and try again.',
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

  return (
    <section className="relative pt-24 pb-12 overflow-hidden bg-background">
      {/* Subtle Studio Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-24 w-[600px] h-[600px] bg-coffee/5 rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-terracotta/5 rounded-full blur-[140px] opacity-15" />
      </div>

      <div className="layout-container relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-sand text-coffee text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
            <span>Neural Simulation v4.0</span>
          </div>
          
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-[0.95] text-foreground max-w-[15ch] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
               Simulate <span className="text-accent italic font-normal">human</span> intuition.
            </h1>
            <p className="text-base md:text-lg text-coffee/40 max-w-xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
              An analytical studio for elite product teams. Observe customer journeys <br className="hidden md:block"/> with behavioral precision.
            </p>
          </div>
          
          {/* Action Core */}
          <div className="relative max-w-2xl mx-auto pt-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
            {analysisState === 'idle' ? (
              <URLInput
                onSubmit={handleURLSubmit}
                isLoading={isLoading}
                placeholder="https://your-product-studio.com"
                className="shadow-xl shadow-coffee/5"
              />
            ) : (
              <div className={cn(
                "bg-white p-8 rounded-3xl border border-sand shadow-2xl relative overflow-hidden",
                analysisState === 'error' && "border-terracotta/20 bg-terracotta/5"
              )}>
                {isLoading && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-coffee text-white shadow-lg">
                          <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                        <div className="text-left space-y-1">
                          <p className="text-xs font-black uppercase tracking-[0.2em] text-coffee">
                            {ANALYSIS_STAGES[currentStage]?.label}
                          </p>
                          <p className="text-[10px] text-coffee/30 font-medium italic">Neural engine synchronizing...</p>
                        </div>
                      </div>
                      <span className="text-3xl font-black tabular-nums tracking-tighter text-coffee/20">{Math.round(progress)}%</span>
                    </div>
                    
                    {/* Architectural Progress Indicator */}
                    <div className="relative h-1.5 w-full bg-cream rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full bg-coffee transition-all duration-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
                       {ANALYSIS_STAGES.map((stage, i) => (
                         <div 
                           key={stage.id} 
                           className={cn(
                             "flex items-center gap-2 text-[8px] uppercase tracking-widest font-black transition-all",
                             i <= currentStage ? "text-coffee" : "text-coffee/10"
                           )}
                         >
                           {i < currentStage ? <CheckCircle2 className="w-3.5 h-3.5 text-forest" /> : <div className={cn("w-1 h-1 rounded-full", i === currentStage ? "bg-terracotta animate-pulse" : "bg-current")} />}
                           <span className="truncate">{stage.id}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {analysisState === 'success' && (
                   <div className="py-8 space-y-4 text-center animate-in zoom-in-95">
                     <div className="w-16 h-16 bg-forest/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-forest/20 shadow-xl">
                       <CheckCircle2 className="w-8 h-8 text-forest" />
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-xl font-black text-coffee tracking-tighter">Diagnostic Complete</h3>
                        <p className="text-xs text-coffee/40 font-medium max-w-xs mx-auto leading-relaxed">Neural paths verified. Strategic cockpit loading...</p>
                     </div>
                   </div>
                 )}

                {analysisState === 'error' && error && (
                  <div className="text-left space-y-6 animate-in fade-in">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-terracotta text-white shadow-xl">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-coffee">Neural Interruption</p>
                        <p className="text-xs text-coffee/50 leading-relaxed font-bold italic">{error.message}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-terracotta/10">
                      {error.canRetry && (
                        <Button
                          onClick={handleRetry}
                          size="sm"
                          className="bg-coffee text-white font-black rounded-xl px-6 shadow-xl"
                        >
                          <RefreshCw className="w-3 h-3 mr-2" />
                          Retry Audit
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        onClick={handleCancel}
                        size="sm"
                        className="font-black text-[9px] uppercase tracking-widest text-coffee/30"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Institutional Trust Cluster */}
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-16 animate-in fade-in duration-1000">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white border border-sand">
                 <Users className="w-4 h-4 text-coffee/20" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-coffee/20">Neural Entities</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white border border-sand">
                 <MousePointer2 className="w-4 h-4 text-coffee/20" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-coffee/20">Behavioral Maps</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}