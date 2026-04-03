"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ChevronRight, ArrowRight, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface FrictionPointsPanelProps {
  points: string[]
}

export function FrictionPointsPanel({ points }: FrictionPointsPanelProps) {
  return (
    <Card className="glass-card border-white/5 overflow-hidden group">
      <CardHeader className="pb-6 border-b border-white/5 bg-red-500/[0.01]">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
              Critical Conversion Friction
            </CardTitle>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Identified Synthetic Barriers</p>
          </div>
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 px-2 py-0.5 font-bold text-[9px] uppercase tracking-tighter">
             Active Alert
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="p-6 space-y-3">
            {points.map((point, i) => (
              <div 
                key={i} 
                className="group/item flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5 animate-in slide-in-from-right-4 duration-500"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-red-500/10 text-red-500 group-hover/item:scale-110 transition-transform shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1.5 flex-1 pr-2">
                  <p className="text-sm font-bold text-foreground/90 tracking-tight group-hover/item:text-red-400 transition-colors leading-tight">{point}</p>
                  <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 transition-colors group-hover/item:text-muted-foreground/60">
                    <span className="flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-red-500" />
                      Priority Alpha
                    </span>
                    <div className="w-1 h-1 rounded-full bg-current opacity-30" />
                    <span>Impact High</span>
                  </div>
                </div>
              </div>
            ))}
            {points.length === 0 && (
              <div className="p-16 text-center space-y-4">
                 <div className="w-16 h-16 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto border border-emerald/20 transition-transform group-hover:scale-105 duration-700">
                    <Zap className="w-8 h-8 fill-emerald animate-pulse" />
                 </div>
                 <div className="space-y-1">
                   <p className="text-sm text-foreground font-bold tracking-tight">Zero Friction Detected</p>
                   <p className="text-xs text-muted-foreground font-medium italic">Neural simulation reports a perfect path.</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {/* Visual Indicator Footer */}
      <div className="px-6 py-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
         <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Live Threat Map
         </div>
         <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/20">System Verfied v2.1</span>
      </div>
    </Card>
  )
}