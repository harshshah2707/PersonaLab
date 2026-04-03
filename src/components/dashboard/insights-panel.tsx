"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb } from 'lucide-react'
import type { AIInsight } from '@/types'
import { cn } from '@/lib/utils'

interface InsightsPanelProps {
  insights: AIInsight[]
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-accent" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className={cn(
              "insight-item",
              insight.priority === 'high' && "border-l-red-500",
              insight.priority === 'medium' && "border-l-yellow-500",
              insight.priority === 'low' && "border-l-muted"
            )}
          >
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-medium text-foreground text-sm">{insight.title}</h4>
              <Badge 
                variant={insight.priority === 'high' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {insight.priority}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{insight.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}