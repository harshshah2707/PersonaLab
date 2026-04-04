"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Info, ChevronRight, Sparkles, SlidersHorizontal } from 'lucide-react'
import { PersonaCard } from './persona-card'
import type { PersonaProfile } from '@/types'
import { Badge } from '@/components/ui/badge'

interface PersonasSectionProps {
  personas: PersonaProfile[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function PersonasSection({ personas, selectedId, onSelect }: PersonasSectionProps) {
  return (
    <Card className="metric-card bg-card overflow-hidden group border-border">
      <CardHeader className="pb-4 border-b border-border bg-secondary/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-2.5 text-foreground">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
              Audit Team
            </CardTitle>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/20">Behavioral Entities</p>
          </div>
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/10 px-2 py-0.5 rounded-full">
                <span className="text-[9px] font-black uppercase tracking-tighter">{personas.length} Live Profiles</span>
             </Badge>
             <button className="p-1.5 rounded-lg bg-card border border-border hover:bg-secondary transition-all">
                <SlidersHorizontal className="w-3.5 h-3.5 text-foreground/30" />
             </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[340px] overflow-y-auto scrollbar-neutral transition-all">
          <div className="p-4 grid grid-cols-1 gap-3">
            {personas.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                isSelected={selectedId === persona.id}
                onSelect={onSelect}
                isCompact={true} // 🚀 FORCED COMPACT MODE FOR SPACE ECONOMY 🏁🌟
              />
            ))}
          </div>
        </div>
      </CardContent>
      
      {/* Bottom Action Footer - Refined */}
      <button className="w-full px-5 py-3 bg-card border-t border-border flex items-center justify-between hover:bg-secondary/50 transition-all group/footer">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/20 group-hover/footer:text-foreground/40 transition-colors">Configure Simulation Matrix</span>
        <ChevronRight className="w-4 h-4 text-foreground/10 group-hover/footer:text-accent group-hover/footer:translate-x-1 transition-all" />
      </button>
    </Card>
  )
}