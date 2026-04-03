"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lightbulb, ChevronDown, ChevronUp, Filter, ArrowRight, CheckCircle, AlertTriangle, Info, Sparkles } from 'lucide-react'
import type { AIInsight } from '@/types'
import { cn } from '@/lib/utils'

export type InsightPriority = 'high' | 'medium' | 'low' | 'all'
export type InsightCategory = 'navigation' | 'content' | 'conversion' | 'design' | 'all'

export interface AIInsightsPanelProps {
  insights: AIInsight[]
}

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }
const CATEGORY_LABELS: Record<string, string> = {
  navigation: 'Nav',
  content: 'Content',
  conversion: 'CVR',
  design: 'UI/UX'
}

const PRIORITY_CONFIG = {
  high: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/5', border: 'border-red-500/20' },
  medium: { icon: Info, color: 'text-amber-500', bg: 'bg-amber-500/5', border: 'border-amber-500/20' },
  low: { icon: CheckCircle, color: 'text-emerald', bg: 'bg-emerald/5', border: 'border-emerald/20' }
}

export function AIInsightsPanel({ insights }: AIInsightsPanelProps) {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null)

  return (
    <Card className="glass-card border-white/5 overflow-hidden group">
      <CardHeader className="pb-6 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-violet/10 text-violet">
                <Lightbulb className="w-4 h-4" />
              </div>
              Strategic AI Insights
            </CardTitle>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Neural Engine Observations</p>
          </div>
          <Badge variant="outline" className="bg-violet/10 text-violet border-violet/20 px-2 py-0.5 animate-pulse">
             <Sparkles className="h-3 w-3 mr-1" />
             <span className="text-[9px] font-black uppercase tracking-tighter">Live Analysis</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[520px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="p-6 space-y-4">
            {insights.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm font-medium italic">
                Optimizing neural paths... virtually clear.
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
                      "rounded-[1.25rem] border transition-all duration-500 animate-in slide-in-from-right-4 group/insight",
                      priorityConfig.bg,
                      priorityConfig.border,
                      isExpanded ? "ring-1 ring-white/10 shadow-2xl" : "hover:bg-white/[0.02]"
                    )}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div 
                      className="p-4 cursor-pointer"
                      onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={cn("p-2 rounded-xl mt-0.5 shrink-0 transition-transform duration-500 group-hover/insight:scale-110", priorityConfig.bg, priorityConfig.color)}>
                            <PriorityIcon className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm tracking-tight text-foreground/90 leading-snug">{insight.title}</h4>
                            <p className={cn(
                              "text-xs text-muted-foreground leading-relaxed transition-all",
                              !isExpanded && "line-clamp-2"
                            )}>
                              {insight.description}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-2">
                           <div className="flex gap-1">
                              <Badge variant="outline" className={cn("text-[8px] font-black uppercase tracking-tighter h-4 px-1.5", priorityConfig.color, priorityConfig.border)}>
                                {insight.priority}
                              </Badge>
                           </div>
                           {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground/40" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/40" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-6 space-y-5 animate-in fade-in zoom-in-95 duration-300">
                          <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-3">
                             <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald">
                               <ArrowRight className="w-3 h-3" />
                               <span>Implementation Strategy</span>
                             </div>
                             <p className="text-xs text-foreground/70 leading-relaxed italic">{insight.recommendation}</p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2">
                             <div className="flex items-center gap-3">
                               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Confidence</span>
                               <div className="flex gap-1">
                                 {[1,2,3,4,5].map(dot => (
                                   <div key={dot} className={cn("w-1.5 h-1.5 rounded-full", dot <= 4 ? "bg-violet" : "bg-white/5")} />
                                 ))}
                               </div>
                             </div>
                             <Button size="sm" className="h-8 rounded-lg bg-foreground text-background font-bold text-[10px] uppercase tracking-wider hover:opacity-90 active:scale-95">
                               Apply Fix
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