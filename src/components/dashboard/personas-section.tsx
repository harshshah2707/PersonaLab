"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'
import type { PersonaProfile } from '@/types'
import { cn } from '@/lib/utils'

interface PersonasSectionProps {
  personas: PersonaProfile[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function PersonasSection({ personas, selectedId, onSelect }: PersonasSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Synthetic Personas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {personas.map((persona) => (
            <div
              key={persona.id}
              onClick={() => onSelect(persona.id)}
              className={cn(
                "persona-card cursor-pointer",
                selectedId === persona.id && "border-primary/50"
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(persona.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{persona.name}</h4>
                  <p className="text-sm text-muted-foreground">{persona.role}</p>
                </div>
                <Badge variant={persona.conversionLikelihood >= 0.7 ? 'emerald' : 'secondary'}>
                  {Math.round(persona.conversionLikelihood * 100)}% conv.
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Goal: </span>
                  <span className="text-foreground">{persona.goal}</span>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    "{persona.quote}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}