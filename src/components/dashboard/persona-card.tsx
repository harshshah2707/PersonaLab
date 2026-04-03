"use client"

import React, { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { PersonaProfile } from '@/types'
import { User, Target, Zap, AlertCircle, Quote } from 'lucide-react'

interface PersonaCardProps {
  persona: PersonaProfile
  isSelected: boolean
  onSelect: (id: string) => void
}

const conversionVariant = (likelihood: number): string => {
  if (likelihood >= 0.7) return 'bg-emerald/10 text-emerald border-emerald/20'
  if (likelihood >= 0.5) return 'bg-cyan/10 text-cyan border-cyan/20'
  if (likelihood >= 0.3) return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  return 'bg-muted text-muted-foreground border-border/50'
}

const browsingStyleLabels: Record<PersonaProfile['behaviorPattern']['browsingStyle'], string> = {
  scanner: 'Scanner',
  reader: 'Reader',
  explorer: 'Explorer'
}

export const PersonaCard = memo(({ persona, isSelected, onSelect }: PersonaCardProps) => {
  const { demographics, behaviorPattern, conversionLikelihood } = persona

  return (
    <Card
      className={cn(
        "persona-card group relative border-white/5 transition-all duration-500 overflow-hidden",
        isSelected ? "border-emerald/40 bg-emerald/5 shadow-[0_0_30px_rgba(16,185,129,0.05)] ring-1 ring-emerald/20" : "hover:bg-white/[0.02]"
      )}
      onClick={() => onSelect(persona.id)}
    >
      <CardContent className="p-5 space-y-5 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className={cn(
               "p-2 rounded-xl transition-colors duration-500",
               isSelected ? "bg-emerald text-background" : "bg-white/5 text-muted-foreground"
             )}>
               <User className="w-5 h-5" />
             </div>
             <div>
               <h3 className="font-bold text-foreground tracking-tight leading-none mb-1">{persona.name}</h3>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{persona.role}</p>
             </div>
          </div>
          <div className={cn("px-2 py-0.5 rounded-lg border text-[10px] font-bold tracking-tighter tabular-nums", conversionVariant(conversionLikelihood))}>
            {Math.round(conversionLikelihood * 100)}% CVR
          </div>
        </div>

        {/* Goal Section */}
        <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
            <Target className="w-3 h-3" />
            <span>Primary Objective</span>
          </div>
          <p className="text-xs text-foreground/90 leading-relaxed font-medium line-clamp-2">{persona.goal}</p>
        </div>

        {/* Behavior Metrics */}
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                <span>Trust Speed</span>
                <span className="text-foreground">{Math.round(behaviorPattern.riskTolerance * 100)}%</span>
              </div>
              <Progress value={behaviorPattern.riskTolerance * 100} className="h-1 bg-white/5" indicatorClassName="bg-emerald" />
           </div>
           <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                <span>Cost Sensitivity</span>
                <span className="text-foreground">{Math.round(behaviorPattern.priceSensitivity * 100)}%</span>
              </div>
              <Progress value={behaviorPattern.priceSensitivity * 100} className="h-1 bg-white/5" indicatorClassName="bg-cyan" />
           </div>
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2 pt-1">
           <Badge variant="outline" className="bg-white/5 border-white/5 text-[9px] font-bold uppercase tracking-wider py-0.5">{demographics.age}yr</Badge>
           <Badge variant="outline" className="bg-white/5 border-white/5 text-[9px] font-bold uppercase tracking-wider py-0.5">{demographics.location}</Badge>
           <Badge variant="outline" className="bg-white/5 border-white/5 text-[9px] font-bold uppercase tracking-wider py-0.5">{browsingStyleLabels[behaviorPattern.browsingStyle]}</Badge>
        </div>

        {/* Quote - Only if selected or on hover */}
        {persona.quote && (
           <div className="relative pt-4 border-t border-white/5">
             <Quote className="absolute -top-2 left-0 w-4 h-4 text-emerald/20" />
             <p className="text-[11px] text-muted-foreground italic leading-relaxed pl-1 transition-colors group-hover:text-foreground/70 line-clamp-2">
               &ldquo;{persona.quote}&rdquo;
             </p>
           </div>
        )}
      </CardContent>

      {/* Background Graphic */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </Card>
  )
})

PersonaCard.displayName = 'PersonaCard'