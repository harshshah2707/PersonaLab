"use client"

import React, { useState, useMemo, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MousePointer, User, Info, X, Sparkles, Target, Zap, Activity } from 'lucide-react'
import type { HeatmapPoint } from '@/types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface HeatmapSectionProps {
  points: HeatmapPoint[]
  screenshotUrl?: string
  highlightedPersona?: string | null
}

const HeatmapDot = memo(({ 
  point, 
  isSelected, 
  onClick, 
  index 
}: { 
  point: HeatmapPoint, 
  isSelected: boolean, 
  onClick: (p: HeatmapPoint) => void,
  index: number
}) => {
  return (
    <button
      onClick={() => onClick(point)}
      className={cn(
        "heatmap-dot w-5 h-5 flex items-center justify-center animate-in zoom-in-50 duration-700 rounded-full cursor-pointer absolute transition-all z-20",
        isSelected ? 'scale-125' : 'hover:scale-110'
      )}
      style={{ 
        left: `${point.x}%`, 
        top: `${point.y}%`,
        transform: 'translate(-50%, -50%)',
        animationDelay: `${index * 50}ms`
      }}
    >
       {/* Thermal Glow - Corrected institutional colors 🚀 🏁🌟 */}
       <div className={cn(
         "absolute w-12 h-12 rounded-full blur-xl opacity-30 animate-pulse transition-all duration-1000",
         point.type === 'emerald' ? 'bg-emerald-500' : 'bg-orange-500'
       )} />
       
       {/* Core Interaction point */}
       <div className={cn(
         "w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center relative z-10 shadow-lg",
         point.type === 'emerald' ? 'bg-emerald-600' : 'bg-orange-600'
       )}>
          <div className="w-1 h-1 rounded-full bg-white/40 animate-ping" />
       </div>
    </button>
  )
})

HeatmapDot.displayName = 'HeatmapDot'

export function HeatmapSection({ points, screenshotUrl, highlightedPersona }: HeatmapSectionProps) {
  const [selectedPoint, setSelectedPoint] = useState<HeatmapPoint | null>(null)
  const memoizedPoints = useMemo(() => points, [points])

  return (
    <Card className="metric-card bg-white overflow-hidden group border-border/60 shadow-sm rounded-[2.5rem]">
      <CardHeader className="pb-4 pt-6 px-8 border-b border-border/30 bg-white/50 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3 text-coffee">
              <div className="p-2.5 rounded-2xl bg-coffee text-white shadow-lg transition-transform group-hover:scale-110 duration-500">
                <Target className="w-5 h-5" />
              </div>
              <span className="leading-none">Interaction Spectrum</span>
            </CardTitle>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-coffee/20 px-1">Behavioral Matrix</p>
          </div>
          {highlightedPersona && (
            <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/10 px-4 py-1.5 gap-2 rounded-full uppercase font-black tracking-widest text-[10px] hidden sm:flex shrink-0">
               <User className="h-3.5 w-3.5" />
               <span className="leading-none">{highlightedPersona} Trace</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col xl:flex-row gap-8">
            {/* Map Area - Editorial Precise Viewport */}
            <div 
              className={cn(
                "relative bg-cream/10 border border-sand rounded-[2rem] overflow-hidden shadow-inner group/map aspect-[16/10] flex-1 min-h-[300px]",
                highlightedPersona && "ring-4 ring-emerald-500/5"
              )}
            >
              {screenshotUrl ? (
                <img 
                  src={screenshotUrl} 
                  alt="Audit Snapshot" 
                  className="absolute inset-0 w-full h-full object-cover grayscale-[0.05] brightness-[0.98] group-hover/map:brightness-100 transition-all duration-1000"
                />
              ) : (
                <div className="absolute inset-0 bg-white flex items-center justify-center">
                   {/* High-Fidelity Neural Substrate - Matching Mockup Design 🏁🌟 */}
                   <div className="text-center space-y-6 relative z-30">
                      <div className="relative mx-auto">
                        <div className="absolute inset-0 bg-coffee/5 blur-3xl rounded-full" />
                        <div className="w-20 h-20 rounded-3xl border border-sand/40 bg-white/80 flex items-center justify-center mx-auto relative shadow-2xl overflow-hidden animate-in zoom-in-95">
                           <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(107,79,59,0.05)_50%,transparent_75%)] bg-[size:250%_250%] animate-shimmer" />
                           <Sparkles className="w-10 h-10 text-coffee/30 animate-pulse" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border border-sand shadow-lg flex items-center justify-center animate-bounce">
                           <Zap className="w-4 h-4 text-terracotta" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-coffee/30 italic animate-pulse">Awaiting Environment Scan</p>
                        <div className="h-1 w-12 bg-sand/30 rounded-full mx-auto" />
                      </div>
                   </div>
                   
                   {/* Architectural Background Grid */}
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />
                </div>
              )}

              {/* Neural Mesh Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.04] z-10 pointer-events-none" />

              {/* Interaction Nodes Cluster */}
              <div className="relative z-20 w-full h-full">
                {memoizedPoints.map((point, i) => (
                  <HeatmapDot
                    key={point.id}
                    point={point}
                    index={i}
                    isSelected={selectedPoint?.id === point.id}
                    onClick={setSelectedPoint}
                  />
                ))}
              </div>
              
              {/* Context Action Overlay */}
              {selectedPoint && (
                <div className="absolute bottom-8 left-8 right-8 animate-in slide-in-from-bottom-8 duration-700 z-40">
                  <div className="bg-white/95 backdrop-blur-2xl border border-sand rounded-[1.5rem] p-5 shadow-2xl flex items-center justify-between gap-8 group/tooltip">
                     <div className="flex items-center gap-5 min-w-0">
                        <div className={cn("p-3 rounded-2xl shrink-0 shadow-lg transition-transform group-hover/tooltip:rotate-6", selectedPoint.type === 'emerald' ? 'bg-emerald-600 text-white' : 'bg-orange-600 text-white')}>
                           <Zap className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                           <h4 className="font-bold text-base text-coffee tracking-tight truncate">{selectedPoint.label}</h4>
                           <p className="text-[11px] text-coffee/50 font-bold italic truncate tracking-tight">{selectedPoint.description}</p>
                        </div>
                     </div>
                     <button onClick={() => setSelectedPoint(null)} className="p-2.5 bg-cream hover:bg-white rounded-xl border border-sand transition-all shadow-sm hover:scale-105 active:scale-95">
                        <X className="w-4 h-4 text-coffee/20" />
                     </button>
                  </div>
                </div>
              )}
            </div>

            {/* Qualitative Diagnostic Sidebar */}
            <div className="xl:w-72 shrink-0 space-y-6">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-coffee/20" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-coffee/20">Vision Cluster</h4>
                  </div>
                  <Badge variant="outline" className="text-[9px] px-2.5 py-0.5 rounded-full bg-sand/10 border-sand text-coffee/40 font-bold tracking-widest leading-none">
                    {memoizedPoints.length} NODES
                  </Badge>
               </div>
               
               <div className="space-y-3 max-h-[340px] xl:max-h-[480px] overflow-y-auto pr-2 scrollbar-neutral transition-all">
                  {memoizedPoints.length === 0 ? (
                      <div className="py-20 text-center border-2 border-dashed border-sand rounded-[2rem] bg-cream/10">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee/10 italic">Awaiting Telemetry</p>
                      </div>
                  ) : (
                    memoizedPoints.map(point => (
                      <button
                        key={`list-${point.id}`}
                        onClick={() => setSelectedPoint(point)}
                        className={cn(
                          "w-full text-left p-4 rounded-[1.5rem] border transition-all duration-500 group/p relative overflow-hidden",
                          selectedPoint?.id === point.id 
                            ? "bg-white border-coffee/10 shadow-xl ring-1 ring-coffee/5" 
                            : "bg-cream/20 border-transparent hover:border-sand/40 hover:bg-white hover:shadow-lg"
                        )}
                      >
                         <div className="flex items-center gap-3 mb-2 relative z-10">
                            <div className={cn(
                              "w-2 h-2 rounded-full shrink-0 shadow-sm", 
                              point.type === 'emerald' ? 'bg-emerald-500' : 'bg-orange-500',
                              selectedPoint?.id === point.id && "animate-pulse"
                            )} />
                            <span className={cn(
                              "text-xs font-bold tracking-tight transition-colors truncate",
                              selectedPoint?.id === point.id ? "text-coffee" : "text-coffee/40 group-hover/p:text-coffee/80"
                            )}>{point.label}</span>
                         </div>
                         <p className="text-[10px] text-coffee/30 italic leading-snug line-clamp-2 pl-5 transition-colors group-hover:text-coffee/50 font-medium">{point.description}</p>
                         
                         {selectedPoint?.id === point.id && (
                           <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                              <Activity className="w-12 h-12 text-coffee" />
                           </div>
                         )}
                      </button>
                    ))
                  )}
               </div>
               
               {/* Laboratory Disclaimer Substrate */}
               <div className="p-4 rounded-2xl bg-coffee/5 border border-sand/30 flex items-center gap-3">
                  <Info className="w-4 h-4 text-coffee/20 shrink-0" />
                  <p className="text-[9px] text-coffee/40 leading-relaxed font-medium">Coordinate precision mapped to 1280x800 neural viewport. Visual nodes reflect behavioral hesitation clusters.</p>
               </div>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}