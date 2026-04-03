"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, ChevronRight } from 'lucide-react'

interface FrictionPointsPanelProps {
  points: string[]
}

export function FrictionPointsPanel({ points }: FrictionPointsPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Friction Points
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {points.map((point, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <ChevronRight className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">{point}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}