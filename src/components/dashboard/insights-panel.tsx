"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lightbulb, ChevronDown, ArrowRight, AlertTriangle, Info, CheckCircle, Sparkles } from 'lucide-react'
import type { AIInsight } from '@/types'
import { cn } from '@/lib/utils'

export interface AIInsightsPanelProps {
  insights: AIInsight[]
}

const PRIORITY_CONFIG = {
  high: { icon: AlertTriangle, color: 'text-terracotta', bg: 'bg-terracotta/5', border: 'border-terracotta/20' },
  medium: { icon: Info, color: 'text-coffee', bg: 'bg-coffee/5', border: 'border-sand' },
  low: { icon: CheckCircle, color: 'text-forest', bg: 'bg-forest/5', border: 'border-forest/20' }
}

export function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null)

  return (
    <Card className="metric-card bg-white overflow-hidden group border-sand">
      <CardHeader className="pb-8 border-b border-sand bg-cream/30">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <CardTitle className="text-xl font-bold tracking-tighter flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-coffee text-white shadow-lg shadow-coffee/10">
                <Lightbulb className="w-5 h-5" />
              </div>
              <span className="truncate">Strategic AI</span>
            </CardTitle>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee/30 truncate">Neural Engine Pulse</p>
          </div>
          <Badge variant="outline" className="bg-white border-sand text-coffee/60 px-3 py-1 rounded-full shrink-0">
             <Sparkles className="h-3.5 w-3.5 mr-2 text-terracotta animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-tighter">Live Audit</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto scrollbar-neutral transition-all">
          <div className="p-8 space-y-6">
            {insights.length === 0 ? (
              <div className="text-center py-20 text-coffee/20 text-xs font-black uppercase tracking-[0.3em] italic">
                Optimizing neural paths...
              </div>
            ) : (
              insights.map((insight, i) => {
                const priorityConfig = PRIORITY_CONFIG[insight.priority as keyof typeof PRIORITY_CONFIG]
                const PriorityIcon = priorityConfig.icon
                const isExpanded = expandedInsight === insight.id

                return (
                  <div
                    key={insight.id}
                    className={cn(
                      "rounded-[2rem] border transition-all duration-700 animate-in slide-in-from-right-8 group/insight",
                      isExpanded ? "bg-white border-terracotta/40 shadow-xl ring-4 ring-terracotta/5" : "bg-white border-sand hover:border-coffee/20 hover:shadow-lg"
                    )}
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex flex-1 items-start gap-5 min-w-0">
                          <div className={cn("p-3.5 rounded-2xl mt-0.5 shrink-0 transition-all duration-700 group-hover/insight:scale-110", priorityConfig.bg, priorityConfig.color, "border border-current/10")}>
                            <PriorityIcon className="w-5 h-5" />
                          </div>
                          <div className="space-y-2 min-w-0">
                            <h4 className="font-bold text-base tracking-tight text-coffee leading-snug truncate">{insight.title}</h4>
                            <p className={cn(
                              "text-[13px] text-coffee/50 leading-relaxed transition-all font-medium",
                              !isExpanded && "line-clamp-2"
                            )}>
                              {insight.description}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-3 self-center">
                           <div className="flex gap-2">
                              <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-widest h-5 px-2.5 rounded-lg border-2", priorityConfig.color, priorityConfig.border)}>
                                {insight.priority}
                              </Badge>
                           </div>
                           <div className={cn("transition-transform duration-500", isExpanded && "rotate-180")}>
                             <ChevronDown className="w-4 h-4 text-coffee/20" />
                           </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
                          <div className="p-6 rounded-[1.5rem] bg-coffee border border-coffee shadow-inner space-y-4">
                             <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                               <ArrowRight className="w-4 h-4 text-terracotta" />
                               <span>Implementation Logic</span>
                             </div>
                             <p className="text-[13px] text-white/80 leading-relaxed font-bold italic pr-4">{insight.recommendation}</p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-sand">
                             <div className="flex items-center gap-4">
                               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee/20">Poise Confidence</span>
                               <div className="flex gap-1.5">
                                 {[1,2,3,4,5].map(dot => (
                                   <div key={dot} className={cn("w-2 h-2 rounded-full transition-all duration-700", dot <= 4 ? "bg-coffee scale-110" : "bg-sand")} />
                                 ))}
                               </div>
                             </div>
                             <Button size="sm" className="h-10 rounded-2xl bg-terracotta text-white font-black text-[11px] uppercase tracking-[0.2em] hover:opacity-90 active:scale-95 shadow-xl shadow-terracotta/10 px-6 border-0">
                               Deploy Fix
                             </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}