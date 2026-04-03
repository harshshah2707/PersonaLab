"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MousePointer } from 'lucide-react'
import type { HeatmapPoint } from '@/types'
import { cn } from '@/lib/utils'

interface HeatmapSectionProps {
  points: HeatmapPoint[]
}

export function HeatmapSection({ points }: HeatmapSectionProps) {
  const [selectedPoint, setSelectedPoint] = useState<HeatmapPoint | null>(null)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <MousePointer className="w-5 h-5 text-primary" />
          AI Interaction Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          className="relative bg-card border border-border rounded-xl mx-6 mb-6 overflow-hidden"
          style={{ height: '400px' }}
        >
          {/* Mock website UI elements */}
          <div className="absolute top-4 left-4 right-4 h-12 bg-secondary rounded-lg flex items-center px-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-muted" />
              <div className="w-3 h-3 rounded-full bg-muted" />
              <div className="w-20 h-3 rounded bg-muted/50" />
            </div>
          </div>
          
          <div className="absolute top-24 left-6 right-6 h-8 bg-secondary/50 rounded-lg" />
          <div className="absolute top-40 left-6 w-1/3 h-32 bg-secondary/30 rounded-lg" />
          <div className="absolute top-40 right-6 w-1/2 h-32 bg-secondary/30 rounded-lg" />
          <div className="absolute top-80 left-6 right-6 h-16 bg-secondary/50 rounded-lg" />
          
          {/* Heatmap points */}
          {points.map((point) => (
            <button
              key={point.id}
              onClick={() => setSelectedPoint(point)}
              className={cn(
                "absolute w-4 h-4 rounded-full transition-all duration-300 cursor-pointer",
                point.type === 'emerald' 
                  ? 'bg-primary shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)]' 
                  : 'bg-accent shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)]',
                selectedPoint?.id === point.id ? 'scale-150' : 'hover:scale-125'
              )}
              style={{ 
                left: `${point.x}%`, 
                top: `${point.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              aria-label={`${point.label}: ${point.description}`}
            />
          ))}
          
          {/* Selected point tooltip */}
          {selectedPoint && (
            <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur border border-border rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      selectedPoint.type === 'emerald' ? 'bg-primary' : 'bg-accent'
                    )} />
                    <span className="font-medium text-foreground">{selectedPoint.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedPoint.description}</p>
                </div>
                <button 
                  onClick={() => setSelectedPoint(null)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close tooltip"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-6 px-6 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-sm text-muted-foreground">Good Interaction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <span className="text-sm text-muted-foreground">Attention/Confusion</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}