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
    <Card className="metric-card bg-white overflow-hidden group">
      <CardHeader className="pb-6 border-b border-sand bg-red-50/30">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
              Critical Friction
            </CardTitle>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Synthetic Barriers</p>
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
                className="group/item flex items-start gap-5 p-5 rounded-[1.5rem] bg-white border border-sand hover:bg-cream/20 transition-all duration-500 animate-in slide-in-from-right-4"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mt-1 flex items-center justify-center w-10 h-10 rounded-2xl bg-terracotta/10 text-terracotta group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-500 shadow-sm border border-terracotta/5">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div className="space-y-2 flex-1 pr-2">
                  <p className="text-sm font-bold text-coffee tracking-tight group-hover/item:text-terracotta transition-colors leading-snug">{point}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-coffee/30 transition-colors group-hover/item:text-coffee/40">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sand/30 whitespace-nowrap">
                      <Zap className="w-3 h-3 text-terracotta" />
                      Alpha Class
                    </span>
                    <span className="whitespace-nowrap">Impact Cluster</span>
                  </div>
                </div>
              </div>
            ))}
            {points.length === 0 && (
              <div className="p-16 text-center space-y-6">
                 <div className="w-20 h-20 bg-cream text-forest rounded-3xl flex items-center justify-center mx-auto border border-sand transition-transform group-hover:scale-105 duration-700">
                    <Zap className="w-10 h-10 fill-forest animate-pulse" />
                 </div>
                 <div className="space-y-2">
                   <p className="text-sm text-coffee font-black uppercase tracking-[0.2em]">Zero Friction</p>
                   <p className="text-[11px] text-muted-foreground font-medium italic">Path analysis reports perfect poise.</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {/* Visual Indicator Footer */}
      <div className="px-6 py-4 border-t border-sand bg-cream/10 flex items-center justify-between">
         <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Live Threat Map
         </div>
         <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/20 italic">Validated Path Analysis</span>
      </div>
    </Card>
  )
}