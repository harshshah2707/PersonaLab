"use client"

import React, { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { PersonaProfile } from '@/types'
import { User, Target, Zap, AlertCircle, Quote, Activity } from 'lucide-react'

interface PersonaCardProps {
  persona: PersonaProfile
  isSelected: boolean
  onSelect: (id: string, startChat?: boolean) => void
  isCompact?: boolean
}

const conversionVariant = (likelihood: number): string => {
  if (likelihood >= 0.7) return 'bg-forest/5 text-forest border-forest/10'
  if (likelihood >= 0.5) return 'bg-coffee/5 text-coffee border-border'
  if (likelihood >= 0.3) return 'bg-terracotta/5 text-terracotta border-terracotta/10'
  return 'bg-red-500/5 text-red-500 border-red-100'
}

const browsingStyleLabels: Record<PersonaProfile['behaviorPattern']['browsingStyle'], string> = {
  scanner: 'Scanner',
  reader: 'Reader',
  explorer: 'Explorer'
}

export const PersonaCard = memo(({ persona, isSelected, onSelect, isCompact = false }: PersonaCardProps) => {
  const { demographics, behaviorPattern, conversionLikelihood } = persona

  if (isCompact) {
    return (
      <Card
        className={cn(
          "metric-card bg-card group relative border-border transition-all duration-500 overflow-hidden cursor-pointer",
          isSelected ? "ring-2 ring-accent/10 border-accent shadow-md bg-secondary/20" : "hover:border-primary/20 hover:shadow-sm"
        )}
        onClick={() => onSelect(persona.id)}
      >
        <CardContent className="p-4 flex items-center justify-between gap-4 relative z-10 transition-all">
          <div className="flex items-center gap-3 min-w-0">
             <div className={cn(
               "p-2.5 rounded-xl transition-all duration-500 shrink-0 shadow-sm",
               isSelected ? "bg-primary text-primary-foreground" : "bg-background text-foreground/40"
             )}>
               <User className="w-4 h-4" />
             </div>
             <div className="min-w-0">
               <h3 className="font-bold text-foreground tracking-tight text-sm leading-none mb-1 truncate">{persona.name}</h3>
               <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/20 truncate">{persona.role}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
             <div className={cn("px-2 py-0.5 rounded-full border text-[8px] font-black tracking-widest tabular-nums uppercase", conversionVariant(conversionLikelihood))}>
               {Math.round(conversionLikelihood * 100)}% CVR
             </div>
             <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-background group-hover:border-accent/40 transition-all">
                <Activity className={cn("w-3.5 h-3.5", isSelected ? "text-accent animate-pulse" : "text-foreground/10")} />
             </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        "metric-card bg-card group relative border-border transition-all duration-700 overflow-hidden cursor-pointer",
        isSelected ? "ring-2 ring-accent/10 border-accent shadow-xl" : "hover:border-primary/20 hover:shadow-lg"
      )}
      onClick={() => onSelect(persona.id)}
    >
      <CardContent className="p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
             <div className={cn(
               "p-3 rounded-2xl transition-all duration-500 shrink-0 shadow-sm",
               isSelected ? "bg-primary text-primary-foreground" : "bg-background text-foreground/40"
             )}>
               <User className="w-5 h-5" />
             </div>
             <div className="min-w-0">
               <h3 className="font-bold text-foreground tracking-tighter text-lg leading-none mb-1.5 truncate">{persona.name}</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 truncate">{persona.role}</p>
             </div>
          </div>
          <div className={cn("px-3 py-1 rounded-full border text-[10px] font-black tracking-widest tabular-nums uppercase", conversionVariant(conversionLikelihood))}>
            {Math.round(conversionLikelihood * 100)}% CVR
          </div>
        </div>

        {/* Goal Section */}
        <div className="space-y-2 p-4 rounded-2xl bg-secondary/40 border border-border group-hover:bg-card transition-colors">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-foreground/20">
            <Target className="w-3.5 h-3.5" />
            <span>Primary Goal</span>
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed font-bold italic line-clamp-2">{persona.goal}</p>
        </div>

        {/* Behavior Metrics */}
        <div className="grid grid-cols-2 gap-6">
           <div className="space-y-2">
              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.25em] text-foreground/30">
                <span>Trust</span>
                <span className="text-foreground">{Math.round(behaviorPattern.riskTolerance * 100)}%</span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${behaviorPattern.riskTolerance * 100}%` }} />
              </div>
           </div>
           <div className="space-y-2">
              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.25em] text-foreground/30">
                <span>Price</span>
                <span className="text-foreground">{Math.round(behaviorPattern.priceSensitivity * 100)}%</span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${behaviorPattern.priceSensitivity * 100}%` }} />
              </div>
           </div>
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-3 pt-2">
           <Badge variant="outline" className="text-foreground/60 text-[9px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full whitespace-nowrap">{demographics.age}yr</Badge>
           <Badge variant="outline" className="text-foreground/60 text-[9px) font-black uppercase tracking-widest py-1.5 px-4 rounded-full whitespace-nowrap">{demographics.location}</Badge>
           <Badge variant="outline" className="text-foreground/60 text-[9px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full whitespace-nowrap">{browsingStyleLabels[behaviorPattern.browsingStyle]}</Badge>
        </div>

        {/* Quote - Only if selected or on hover */}
        {persona.quote && (
           <div className="relative pt-6 border-t border-border flex items-center justify-between gap-6 group/quote">
             <div className="relative flex-1">
                <Quote className="absolute -top-3 left-0 w-5 h-5 text-accent/20 rotate-12" />
                <p className="text-[11px] text-foreground/50 italic leading-relaxed pl-2 transition-colors group-hover:text-foreground line-clamp-2">
                    &ldquo;{persona.quote}&rdquo;
                </p>
             </div>
             
             <button 
                onClick={(e) => {
                    e.stopPropagation()
                    onSelect(persona.id, true)
                }}
                className={cn(
                    "p-3 rounded-2xl border border-border bg-secondary text-[10px] font-black uppercase tracking-[0.2em] text-foreground shadow-sm transition-all duration-500",
                    "hover:bg-accent hover:text-white hover:border-accent hover:scale-110 active:scale-95",
                    isSelected ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                )}
             >
                Trace Path
             </button>
           </div>
        )}
      </CardContent>

      {/* Background Graphic */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-accent/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </Card>
  )
})

PersonaCard.displayName = 'PersonaCard'