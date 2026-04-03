"use client"

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PersonaCard } from './persona-card'
import { Users, Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PersonaProfile } from '@/types'

export interface PersonaFilters {
  conversionLikelihood?: 'high' | 'medium' | 'low'
  browsingStyle?: 'scanner' | 'reader' | 'explorer'
  decisionSpeed?: 'fast' | 'moderate' | 'deliberate'
}

interface PersonaCardsProps {
  personas: PersonaProfile[]
  selectedPersona?: string
  onPersonaSelect: (id: string) => void
  filters?: PersonaFilters
  onFilterChange?: (filters: PersonaFilters) => void
}

const conversionLikelihoodLabels: Record<'high' | 'medium' | 'low', string> = {
  high: 'High (≥70%)',
  medium: 'Medium (50-70%)',
  low: 'Low (<50%)'
}

const browsingStyleLabels: Record<'scanner' | 'reader' | 'explorer', string> = {
  scanner: 'Scanner',
  reader: 'Reader',
  explorer: 'Explorer'
}

const decisionSpeedLabels: Record<'fast' | 'moderate' | 'deliberate', string> = {
  fast: 'Fast',
  moderate: 'Moderate',
  deliberate: 'Deliberate'
}

export function PersonaCards({
  personas,
  selectedPersona,
  onPersonaSelect,
  filters = {},
  onFilterChange
}: PersonaCardsProps) {
  const [showFilters, setShowFilters] = useState(false)

  const filteredPersonas = useMemo(() => {
    return personas.filter(persona => {
      if (filters.conversionLikelihood) {
        const likelihood = persona.conversionLikelihood
        if (filters.conversionLikelihood === 'high' && likelihood < 0.7) return false
        if (filters.conversionLikelihood === 'medium' && (likelihood < 0.5 || likelihood >= 0.7)) return false
        if (filters.conversionLikelihood === 'low' && likelihood >= 0.5) return false
      }
      if (filters.browsingStyle && persona.behaviorPattern.browsingStyle !== filters.browsingStyle) {
        return false
      }
      if (filters.decisionSpeed && persona.behaviorPattern.decisionSpeed !== filters.decisionSpeed) {
        return false
      }
      return true
    })
  }, [personas, filters])

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const updateFilter = <K extends keyof PersonaFilters>(key: K, value: PersonaFilters[K]) => {
    onFilterChange?.({
      ...filters,
      [key]: value === '' ? undefined : value
    })
  }

  const clearFilters = () => {
    onFilterChange?.({})
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Synthetic Personas
            <Badge variant="secondary" className="ml-1">
              {filteredPersonas.length}/{personas.length}
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && "bg-secondary")}
          >
            <Filter className="w-4 h-4 mr-1" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="emerald" className="ml-1 h-5 min-w-5">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <CardContent className="pt-4 pb-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Conversion Likelihood Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Conversion Likelihood</label>
                <div className="flex flex-wrap gap-1">
                  {(['high', 'medium', 'low'] as const).map(value => (
                    <Button
                      key={value}
                      variant={filters.conversionLikelihood === value ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => updateFilter('conversionLikelihood', 
                        filters.conversionLikelihood === value ? undefined : value
                      )}
                    >
                      {conversionLikelihoodLabels[value]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Browsing Style Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Browsing Style</label>
                <div className="flex flex-wrap gap-1">
                  {(['scanner', 'reader', 'explorer'] as const).map(value => (
                    <Button
                      key={value}
                      variant={filters.browsingStyle === value ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => updateFilter('browsingStyle',
                        filters.browsingStyle === value ? undefined : value
                      )}
                    >
                      {browsingStyleLabels[value]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Decision Speed Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Decision Speed</label>
                <div className="flex flex-wrap gap-1">
                  {(['fast', 'moderate', 'deliberate'] as const).map(value => (
                    <Button
                      key={value}
                      variant={filters.decisionSpeed === value ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => updateFilter('decisionSpeed',
                        filters.decisionSpeed === value ? undefined : value
                      )}
                    >
                      {decisionSpeedLabels[value]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </CardHeader>

      <CardContent>
        {filteredPersonas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No personas match the selected filters.</p>
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPersonas.map(persona => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                isSelected={selectedPersona === persona.id}
                onSelect={onPersonaSelect}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}