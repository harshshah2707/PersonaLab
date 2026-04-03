"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Globe, Cpu, Zap, Activity } from 'lucide-react'

const LOADING_STEPS = [
  { icon: Globe, msg: "Initializing Playwright Headless...", color: "text-emerald" },
  { icon: Activity, msg: "Navigating to Target URL...", color: "text-cyan" },
  { icon: Target, msg: "Capturing High-Fidelity Website Snapshot...", color: "text-violet" },
  { icon: Cpu, msg: "Processing Visual Data with Gemini 1.5 Vision...", color: "text-emerald" },
  { icon: Zap, msg: "Mapping Synthetic User Personas...", color: "text-amber" },
  { icon: Activity, msg: "Quantifying Friction Points & Conversion Risk...", color: "text-red" }
]

import { Target } from 'lucide-react'

export function AnalysisLoadingSkeleton() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % LOADING_STEPS.length)
    }, 4500) // Change message every 4.5 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 relative">
      {/* Dynamic Status Indicator */}
      <div className="flex flex-col items-center justify-center py-8 space-y-6">
         <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full" />
            <div className="relative w-20 h-20 rounded-3xl bg-card border border-primary/20 flex items-center justify-center shadow-2xl overflow-hidden">
               <div className="absolute inset-0 animate-shimmer opacity-20" />
               {(() => {
                 const StepIcon = LOADING_STEPS[currentStep]?.icon
                 return StepIcon ? (
                   <StepIcon className={cn("w-8 h-8 animate-in zoom-in-50 duration-500", LOADING_STEPS[currentStep].color)} />
                 ) : null
               })()}
            </div>
         </div>
         
         <div className="text-center space-y-2">
            <h3 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text text-transparent">
               AI Simulation Active
            </h3>
            <div className="h-5 overflow-hidden">
               <p className={cn(
                  "text-xs font-bold uppercase tracking-[0.2em] animate-in slide-in-from-bottom-2 duration-500",
                  LOADING_STEPS[currentStep]?.color || 'text-muted-foreground'
               )}>
                  {LOADING_STEPS[currentStep]?.msg || 'Preparing Analysis...'}
               </p>
            </div>
         </div>

         {/* Estimated Time Segment */}
         <div className="w-full max-w-sm space-y-2">
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60">
               <span>Real-time Engine</span>
               <span>Est. 30-60s</span>
            </div>
            <div className="h-1.5 w-full bg-card border border-white/5 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-primary transition-all duration-[60s] ease-linear"
                 style={{ width: '100%' }} // Linear progress for 60 seconds
               />
            </div>
         </div>
      </div>

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 opacity-30 pointer-events-none grayscale">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="glass-card border-white/5">
            <CardContent className="p-6">
              <Skeleton className="h-10 w-10 rounded-xl bg-white/5 mb-4" />
              <Skeleton className="h-3 w-24 bg-white/5 mb-2" />
              <Skeleton className="h-8 w-20 bg-white/5" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Content Skeleton Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 opacity-30 pointer-events-none grayscale">
        <div className="lg:col-span-2">
           <Skeleton className="h-[440px] w-full rounded-3xl bg-white/5 border border-white/5 mb-6" />
           <Skeleton className="h-[200px] w-full rounded-3xl bg-white/5 border border-white/5" />
        </div>
        <div className="lg:col-span-2">
           <Skeleton className="h-[600px] w-full rounded-3xl bg-white/5 border border-white/5" />
        </div>
      </div>
    </div>
  )
}