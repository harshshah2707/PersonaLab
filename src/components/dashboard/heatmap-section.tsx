"use client"

import React, { useState, useMemo, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MousePointer, User, Info, X } from 'lucide-react'
import type { HeatmapPoint } from '@/types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface HeatmapSectionProps {
  points: HeatmapPoint[]
  screenshotUrl?: string
  highlightedPersona?: string | null
}

// Memoized Heatmap Point component for performance
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
        "heatmap-dot w-6 h-6 flex items-center justify-center animate-in zoom-in-50 duration-500 rounded-full cursor-pointer absolute transition-all",
        isSelected ? 'z-30' : 'hover:z-20'
      )}
      style={{ 
        left: `${point.x}%`, 
        top: `${point.y}%`,
        transform: 'translate(-50%, -50%)',
        animationDelay: `${index * 50}ms`
      }}
      aria-label={`Interaction point: ${point.label}`}
    >
       {/* High-Fidelity Thermal Glow */}
       <div className={cn(
         "absolute w-16 h-16 rounded-full blur-2xl opacity-40 animate-pulse transition-all duration-700",
         point.type === 'emerald' ? 'bg-emerald' : 'bg-cyan'
       )} />
       <div className={cn(
         "absolute w-8 h-8 rounded-full blur-md opacity-60",
         point.type === 'emerald' ? 'bg-emerald' : 'bg-cyan'
       )} />
       
       {/* Core Interaction point */}
       <div className={cn(
         "w-4 h-4 rounded-full border-2 border-white/40 flex items-center justify-center relative z-10",
         point.type === 'emerald' ? 'bg-emerald shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-cyan shadow-[0_0_15px_rgba(6,182,212,0.5)]'
       )}>
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
       </div>

       {/* Distance Trigger for Hover visibility */}
       {isSelected && (
           <div className="absolute top-1/2 left-full translate-x-4 -translate-y-1/2 bg-popover border border-white/10 rounded-lg p-2 whitespace-nowrap shadow-xl z-50 animate-in slide-in-from-left-2 duration-200">
               <p className="text-[10px] font-bold uppercase tracking-wider">{point.label}</p>
               <p className="text-[9px] text-muted-foreground font-medium">{Math.round(point.intensity * 100)}% Conversion Friction</p>
           </div>
       )}
    </button>
  )
})

HeatmapDot.displayName = 'HeatmapDot'

export function HeatmapSection({ points, screenshotUrl, highlightedPersona }: HeatmapSectionProps) {
  const [selectedPoint, setSelectedPoint] = useState<HeatmapPoint | null>(null)

  const memoizedPoints = useMemo(() => points, [points])

  return (
    <Card className="glass-card border-white/5 overflow-hidden group">
      <CardHeader className="pb-6 border-b border-white/5 bg-white/[0.01]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald/10 text-emerald">
                <MousePointer className="w-4 h-4" />
              </div>
              Predictive Interaction Map
              <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-[9px] opacity-40">
                {points.length} Points
              </Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Synthetic Behavioral Clusters</p>
          </div>
          {highlightedPersona && (
            <Badge variant="outline" className="bg-emerald/10 text-emerald border-emerald/20 px-3 py-1 gap-1.5 animate-in zoom-in-95 self-start sm:self-center">
               <User className="h-3 w-3" />
               <span className="text-[10px] font-bold uppercase tracking-wider">{highlightedPersona} Path</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2">
            {/* Map Area */}
            <div 
              className={cn(
                "relative bg-background/50 border border-white/5 rounded-2xl overflow-hidden transition-all duration-700 shadow-inner group/map lg:col-span-9",
                highlightedPersona && "border-emerald/20 shadow-[0_0_40px_rgba(16,185,129,0.03)]"
              )}
              style={{ height: '520px' }}
              role="img"
              aria-label="Website interaction heatmap"
            >
              {/* Actual Site Screenshot Background */}
              {screenshotUrl ? (
                <img 
                  src={screenshotUrl} 
                  alt="Website Analysis" 
                  className="absolute inset-0 w-full h-full object-contain bg-black/40 opacity-70 group-hover/map:opacity-90 transition-opacity duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center opacity-20">
                   <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
                     <div className="w-24 h-24 rounded-2xl border border-dashed border-white/10" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 text-center px-4">Initializing AI Eye...</span>
                   </div>
                </div>
              )}

              {/* Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse:60%_50%_at_50%_50%,#000_70%,transparent_100%)] z-10 pointer-events-none" />

              {/* Heatmap points */}
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
              
              {/* Tooltip Overlay */}
              {selectedPoint && (
                <div className="absolute top-6 left-6 right-6 animate-in fade-in slide-in-from-top-4 duration-300 z-40">
                  <div className="glass-panel border-white/10 rounded-2xl p-4 shadow-2xl bg-background/80 backdrop-blur-2xl flex items-center justify-between gap-4">
                     <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-xl", selectedPoint.type === 'emerald' ? 'bg-emerald text-background' : 'bg-cyan text-background')}>
                           <Info className="w-4 h-4" />
                        </div>
                        <div>
                           <h4 className="font-bold text-sm tracking-tight">{selectedPoint.label}</h4>
                           <p className="text-[10px] text-muted-foreground font-medium">{selectedPoint.description}</p>
                        </div>
                     </div>
                     <button onClick={() => setSelectedPoint(null)} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-4 h-4 text-muted-foreground" />
                     </button>
                  </div>
                </div>
              )}
            </div>

            {/* Interaction List Sidebar */}
            <div className="lg:col-span-3 space-y-3 max-h-[520px] overflow-y-auto pr-2 scrollbar-hide">
               <div className="px-1 pb-2">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-4">Vision Cluster Log</h4>
                 <div className="space-y-2">
                    {memoizedPoints.length === 0 ? (
                        <div className="py-8 text-center border border-dashed border-white/5 rounded-xl">
                            <p className="text-[10px] font-bold uppercase text-muted-foreground/40">No clusters detected</p>
                        </div>
                    ) : (
                      memoizedPoints.map(point => (
                        <button
                          key={`list-${point.id}`}
                          onClick={() => setSelectedPoint(point)}
                          className={cn(
                            "w-full text-left p-3 rounded-xl border border-white/5 transition-all",
                            "hover:border-white/10 hover:bg-white/5 group/p",
                            selectedPoint?.id === point.id ? "bg-white/5 border-white/20 ring-1 ring-white/10" : "bg-white/[0.01]"
                          )}
                        >
                           <div className="flex items-center gap-2 mb-1">
                              <div className={cn("w-1.5 h-1.5 rounded-full", point.type === 'emerald' ? 'bg-emerald' : 'bg-cyan')} />
                              <span className="text-[10px] font-black tracking-tight text-foreground/80 group-hover/p:text-foreground transition-colors uppercase">{point.label}</span>
                           </div>
                           <p className="text-[9px] text-muted-foreground/60 leading-tight line-clamp-2">{point.description}</p>
                        </button>
                      ))
                    )}
                 </div>
               </div>
            </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-10 mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 group/leg cursor-help">
            <div className="w-3 h-3 rounded-full bg-emerald shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover/leg:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 transition-colors group-hover/leg:text-muted-foreground">High Conversion Signal</span>
          </div>
          <div className="flex items-center gap-3 group/leg cursor-help">
            <div className="w-3 h-3 rounded-full bg-cyan shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover/leg:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 transition-colors group-hover/leg:text-muted-foreground">Complex Interaction Node</span>
          </div>
          <div className="ml-auto hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
            <MousePointer className="w-3 h-3" />
            <span>Interactive Map Active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}