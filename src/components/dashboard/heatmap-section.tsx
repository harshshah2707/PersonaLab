"use client"

import React, { useState, useMemo, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MousePointer, User, Info, X } from 'lucide-react'
import type { HeatmapPoint } from '@/types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface HeatmapSectionProps {
  points: HeatmapPoint[]
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
        point.type === 'emerald' 
          ? 'bg-emerald shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
          : 'bg-cyan shadow-[0_0_20px_rgba(6,182,212,0.4)]',
        isSelected ? 'scale-150 ring-4 ring-white/10 z-30' : 'hover:scale-125 hover:z-20'
      )}
      style={{ 
        left: `${point.x}%`, 
        top: `${point.y}%`,
        transform: 'translate(-50%, -50%)',
        animationDelay: `${index * 50}ms`
      }}
      aria-label={`Interaction point: ${point.label}`}
      aria-expanded={isSelected}
    >
       <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
    </button>
  )
})

HeatmapDot.displayName = 'HeatmapDot'

export function HeatmapSection({ points, highlightedPersona }: HeatmapSectionProps) {
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
        <div 
          className={cn(
            "relative bg-background/50 border border-white/5 rounded-2xl overflow-hidden transition-all duration-700 shadow-inner group/map",
            highlightedPersona && "border-emerald/20 shadow-[0_0_40px_rgba(16,185,129,0.03)]"
          )}
          style={{ height: '480px' }}
          role="img"
          aria-label="Website interaction heatmap"
        >
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

          {/* Mock premium website UI elements */}
          <div className="absolute top-0 left-0 right-0 h-14 bg-white/[0.03] border-b border-white/5 flex items-center px-6 justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 leading-none">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
              </div>
              <div className="w-32 h-2 rounded-full bg-white/5" />
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-2 rounded-full bg-white/5" />
              <div className="w-12 h-2 rounded-full bg-white/5" />
            </div>
          </div>
          
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-white/[0.04] rounded-xl border border-white/5 shadow-lg shadow-black/20" />
          
          <div className="absolute top-48 left-10 w-1/3 h-56 bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm">
             <div className="absolute top-5 left-5 right-5 h-5 bg-white/10 rounded-md" />
             <div className="absolute top-14 left-5 right-12 h-4 bg-white/5 rounded-md" />
             <div className="absolute top-22 left-5 right-8 h-4 bg-white/5 rounded-md" />
             <div className="absolute bottom-5 left-5 right-5 h-12 bg-emerald/10 border border-emerald/20 rounded-xl flex items-center justify-center">
                <div className="w-1/2 h-2.5 bg-emerald/60 rounded-full" />
             </div>
          </div>
          
          <div className="absolute top-48 right-10 w-1/2 h-56 bg-white/[0.01] rounded-2xl border border-dashed border-white/10 transition-colors group-hover/map:border-white/20" />
          
          {/* Heatmap points with memoization */}
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
          
          {/* Selected point tooltip - Enhanced */}
          {selectedPoint && (
            <div className="absolute bottom-6 left-6 right-6 glass-panel border-white/10 rounded-[1.5rem] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 z-40 bg-background/80 backdrop-blur-2xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl mt-0.5",
                    selectedPoint.type === 'emerald' ? 'bg-emerald/10 text-emerald' : 'bg-cyan/10 text-cyan'
                  )}>
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-lg text-foreground tracking-tight leading-none">{selectedPoint.label}</h4>
                      <Badge variant="outline" className="text-[9px] h-4 font-black uppercase tracking-tighter opacity-60">Insight {selectedPoint.id.split('_')[1]}</Badge>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed italic pr-4 font-medium">&ldquo;{selectedPoint.description}&rdquo;</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPoint(null)}
                  className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground transition-all active:scale-90"
                  aria-label="Close details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
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