"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Info, ChevronRight, Sparkles } from 'lucide-react'
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
    <Card className="glass-card border-white/5 overflow-hidden group">
      <CardHeader className="pb-6 border-b border-white/5 bg-cyan-500/[0.01]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan/10 text-cyan">
                <Users className="w-4 h-4" />
              </div>
              Simulated Audit Team
            </CardTitle>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Synthetic Audience Segmentation</p>
          </div>
          <Badge variant="outline" className="bg-cyan/10 text-cyan border-cyan/20 px-2 py-0.5">
             <Sparkles className="h-3 w-3 mr-1" />
             <span className="text-[9px] font-black uppercase tracking-tighter">{personas.length} Live Personas</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[640px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {personas.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                isSelected={selectedId === persona.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      </CardContent>
      
      {/* Bottom Action Footer */}
      <button className="w-full px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between hover:bg-white/[0.04] transition-all group/footer">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 group-hover/footer:text-muted-foreground transition-colors">Configure Simulation Parameters</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover/footer:text-cyan group-hover/footer:translate-x-1 transition-all" />
      </button>
    </Card>
  )
}