"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { HeatmapPoint, AIInsight } from '@/types'
import { MousePointer, Eye, ArrowDown, X, Info, Sparkles, TrendingUp, AlertCircle, Lightbulb, ChevronRight } from 'lucide-react'

interface HeatmapVisualizationProps {
  data: HeatmapPoint[]
  websiteScreenshot?: string
  onPointClick?: (point: HeatmapPoint) => void
  overlayMode?: 'clicks' | 'attention' | 'scroll'
  className?: string
}

type OverlayMode = 'clicks' | 'attention' | 'scroll'

interface NormalizedPoint extends HeatmapPoint {
  normalizedX: number
  normalizedY: number
  normalizedIntensity: number
}

// AI Analysis data for a heatmap point
interface PointAIAnalysis {
  insights: AIInsight[]
  recommendations: string[]
  relatedMetrics: {
    avgTimeOnElement: number
    bounceRate: number
    conversionImpact: number
  }
  userBehaviorPattern: string
}

// Generate mock AI analysis for a point
function generateAIAnalysis(point: NormalizedPoint): PointAIAnalysis {
  const intensityLevel = point.normalizedIntensity > 0.7 ? 'high' : point.normalizedIntensity > 0.4 ? 'medium' : 'low'
  const impactLevel = intensityLevel === 'high' ? 'high' : intensityLevel === 'medium' ? 'medium' : 'low'
  
  return {
    insights: [
      {
        id: `insight-${point.id}-1`,
        title: `${intensityLevel.charAt(0).toUpperCase() + intensityLevel.slice(1)} Interaction Area`,
        description: `This area shows ${intensityLevel} user engagement with ${(point.normalizedIntensity * 100).toFixed(0)}% intensity.`,
        priority: intensityLevel === 'high' ? 'high' : intensityLevel === 'medium' ? 'medium' : 'low',
        category: 'navigation',
        recommendation: `Optimize the ${point.label.toLowerCase()} for better user engagement and conversion.`,
        impact: {
          level: impactLevel as 'high' | 'medium' | 'low',
          estimatedImprovement: `+${Math.round(point.normalizedIntensity * 15)}% engagement improvement`,
          confidence: 0.75
        },
        evidence: [
          {
            type: 'heatmap',
            data: { x: point.x, y: point.y, intensity: point.normalizedIntensity, label: point.label },
            description: `Heatmap shows ${(point.normalizedIntensity * 100).toFixed(0)}% intensity on ${point.label}`
          }
        ],
        implementationStatus: 'pending',
        statusHistory: [{ status: 'pending', changedAt: new Date() }],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: `insight-${point.id}-2`,
        title: 'User Attention Pattern',
        description: `Users are ${point.type === 'emerald' ? 'positively engaging' : 'spending significant time'} with this element.`,
        priority: 'medium',
        category: 'content',
        recommendation: 'Consider A/B testing different content variations to optimize user engagement.',
        impact: {
          level: 'medium',
          estimatedImprovement: '+8% content engagement',
          confidence: 0.68
        },
        evidence: [
          {
            type: 'metric',
            data: { name: 'engagement', value: point.normalizedIntensity },
            description: `Engagement intensity of ${(point.normalizedIntensity * 100).toFixed(0)}% detected`
          }
        ],
        implementationStatus: 'pending',
        statusHistory: [{ status: 'pending', changedAt: new Date() }],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    recommendations: [
      `Consider optimizing the ${point.label.toLowerCase()} for better ${point.type === 'emerald' ? 'conversion' : 'engagement'}`,
      point.normalizedIntensity > 0.5 ? 'This area is performing well - maintain current design' : 'A/B test different variations to improve engagement',
      'Ensure mobile responsiveness for this interaction point'
    ],
    relatedMetrics: {
      avgTimeOnElement: Math.round(2 + point.normalizedIntensity * 10),
      bounceRate: Math.round(20 - point.normalizedIntensity * 15),
      conversionImpact: Math.round(point.normalizedIntensity * 100)
    },
    userBehaviorPattern: point.type === 'emerald' 
      ? 'Users are actively clicking and converting here' 
      : 'Users are exploring and considering options in this area'
  }
}

// Requirement 6.2: Ensure all coordinates are within screenshot boundaries
function normalizeCoordinates(points: HeatmapPoint[]): NormalizedPoint[] {
  return points.map((point) => ({
    ...point,
    // Clamp coordinates between 0 and 100%
    normalizedX: Math.max(0, Math.min(100, point.x)),
    normalizedY: Math.max(0, Math.min(100, point.y)),
    // Ensure intensity is between 0 and 1
    normalizedIntensity: Math.max(0, Math.min(1, point.intensity))
  }))
}

// Requirement 6.5: Normalize intensity values between 0 and 1 based on interaction frequency
function calculateIntensityScale(points: NormalizedPoint[]): number {
  if (points.length === 0) return 1
  
  const maxIntensity = Math.max(...points.map(p => p.normalizedIntensity))
  return maxIntensity > 0 ? maxIntensity : 1
}

function getIntensityColor(intensity: number, maxIntensity: number, mode: OverlayMode): string {
  const normalizedIntensity = intensity / maxIntensity
  
  switch (mode) {
    case 'clicks':
      // Warm colors for clicks (orange/red gradient)
      return `rgba(239, 68, 68, ${0.3 + normalizedIntensity * 0.7})`
    case 'attention':
      // Purple/pink for attention areas
      return `rgba(168, 85, 247, ${0.3 + normalizedIntensity * 0.7})`
    case 'scroll':
      // Blue/cyan for scroll depth
      return `rgba(6, 182, 212, ${0.3 + normalizedIntensity * 0.7})`
    default:
      return `rgba(16, 185, 129, ${0.3 + normalizedIntensity * 0.7})`
  }
}

function getPointColor(type: 'emerald' | 'cyan', intensity: number): string {
  const opacity = 0.4 + intensity * 0.6
  if (type === 'emerald') {
    return `rgba(16, 185, 129, ${opacity})`
  }
  return `rgba(6, 182, 212, ${opacity})`
}

export function HeatmapVisualization({
  data,
  websiteScreenshot,
  onPointClick,
  overlayMode: initialMode = 'clicks',
  className
}: HeatmapVisualizationProps) {
  const [selectedPoint, setSelectedPoint] = useState<NormalizedPoint | null>(null)
  const [hoveredPoint, setHoveredPoint] = useState<NormalizedPoint | null>(null)
  const [overlayMode, setOverlayMode] = useState<OverlayMode>(initialMode)
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 })
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Normalize all coordinates
  const normalizedPoints = useMemo(() => normalizeCoordinates(data), [data])
  
  // Calculate max intensity for scaling
  const maxIntensity = useMemo(() => calculateIntensityScale(normalizedPoints), [normalizedPoints])

  // Filter points by overlay mode
  const filteredPoints = useMemo(() => {
    switch (overlayMode) {
      case 'clicks':
        return normalizedPoints.filter(p => p.type === 'emerald')
      case 'attention':
        return normalizedPoints.filter(p => p.type === 'cyan')
      case 'scroll':
        return normalizedPoints
      default:
        return normalizedPoints
    }
  }, [normalizedPoints, overlayMode])

  // Handle container resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current
        setContainerDimensions({ width: clientWidth, height: clientHeight })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Requirement 6.4: Click handler with AI analysis display
  const handlePointClick = useCallback((point: NormalizedPoint) => {
    setSelectedPoint(point)
    onPointClick?.(point)
  }, [onPointClick])

  // Requirement 6.6: Hover effects with detailed information tooltips
  const handlePointHover = useCallback((point: NormalizedPoint | null) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
    }
    
    if (point) {
      tooltipTimeoutRef.current = setTimeout(() => {
        setHoveredPoint(point)
      }, 150) // Small delay to prevent flickering
    } else {
      setHoveredPoint(null)
    }
  }, [])

  const handleCloseTooltip = useCallback(() => {
    setSelectedPoint(null)
  }, [])

  // Requirement 6.7: Smooth transitions between different heatmap modes
  const handleModeChange = useCallback((newMode: OverlayMode) => {
    if (newMode !== overlayMode) {
      setIsTransitioning(true)
      setOverlayMode(newMode)
      setTimeout(() => setIsTransitioning(false), 300)
    }
  }, [overlayMode])

  // Keyboard navigation support
  const handleKeyDown = useCallback((event: React.KeyboardEvent, point: NormalizedPoint) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handlePointClick(point)
    } else if (event.key === 'Escape') {
      handleCloseTooltip()
    }
  }, [handlePointClick, handleCloseTooltip])

  // Get AI analysis for selected point
  const selectedPointAnalysis = useMemo(() => {
    if (!selectedPoint) return null
    return generateAIAnalysis(selectedPoint)
  }, [selectedPoint])

  // Generate heat map gradient for scroll mode
  const scrollGradient = useMemo(() => {
    if (overlayMode !== 'scroll') return null
    
    const sortedByY = [...normalizedPoints].sort((a, b) => a.normalizedY - b.normalizedY)
    if (sortedByY.length < 2) return null

    const topPoint = sortedByY[0]
    const bottomPoint = sortedByY[sortedByY.length - 1]
    
    return {
      start: getIntensityColor(topPoint.normalizedIntensity, maxIntensity, 'scroll'),
      end: getIntensityColor(bottomPoint.normalizedIntensity, maxIntensity, 'scroll')
    }
  }, [normalizedPoints, overlayMode, maxIntensity])

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MousePointer className="w-5 h-5 text-primary" />
            Interaction Heatmap
          </CardTitle>
          
          {/* Requirement 6.3: Different overlay modes for clicks, attention, and scroll */}
          {/* Requirement 6.7: Smooth transitions between different heatmap modes */}
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            <Button
              variant={overlayMode === 'clicks' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleModeChange('clicks')}
              className={cn(
                "gap-1.5 transition-all duration-300",
                overlayMode === 'clicks' ? 'bg-primary text-primary-foreground' : ''
              )}
            >
              <MousePointer className="w-3.5 h-3.5" />
              <span className="text-xs">Clicks</span>
            </Button>
            <Button
              variant={overlayMode === 'attention' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleModeChange('attention')}
              className={cn(
                "gap-1.5 transition-all duration-300",
                overlayMode === 'attention' ? 'bg-primary text-primary-foreground' : ''
              )}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-xs">Attention</span>
            </Button>
            <Button
              variant={overlayMode === 'scroll' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleModeChange('scroll')}
              className={cn(
                "gap-1.5 transition-all duration-300",
                overlayMode === 'scroll' ? 'bg-primary text-primary-foreground' : ''
              )}
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span className="text-xs">Scroll</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div 
          ref={containerRef}
          className="relative bg-card border border-border rounded-xl mx-6 mb-6 overflow-hidden"
          style={{ height: '400px' }}
        >
          {/* Website screenshot or mock UI */}
          {websiteScreenshot ? (
            <img 
              src={websiteScreenshot}
              alt="Website screenshot"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
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
            </>
          )}

          {/* Scroll depth gradient overlay */}
          {scrollGradient && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(to bottom, ${scrollGradient.start}, ${scrollGradient.end})`,
                opacity: 0.3
              }}
            />
          )}

          {/* Requirement 6.1: Overlay interaction data with normalized intensity values */}
          {filteredPoints.map((point) => (
            <button
              key={point.id}
              onClick={() => handlePointClick(point)}
              onMouseEnter={() => handlePointHover(point)}
              onMouseLeave={() => handlePointHover(null)}
              onKeyDown={(e) => handleKeyDown(e, point)}
              className={cn(
                "absolute rounded-full transition-all duration-300 cursor-pointer",
                "hover:scale-150 hover:z-10 focus:outline-none focus:ring-2 focus:ring-white",
                selectedPoint?.id === point.id ? 'scale-175 z-20 ring-2 ring-white' : '',
                isTransitioning ? 'opacity-50' : 'opacity-100'
              )}
              style={{ 
                left: `${point.normalizedX}%`, 
                top: `${point.normalizedY}%`,
                width: `${12 + point.normalizedIntensity * 24}px`,
                height: `${12 + point.normalizedIntensity * 24}px`,
                transform: 'translate(-50%, -50%)',
                background: getPointColor(point.type, point.normalizedIntensity),
                boxShadow: `0 0 ${8 + point.normalizedIntensity * 16}px ${getPointColor(point.type, point.normalizedIntensity)}`
              }}
              aria-label={`${point.label}: ${point.description}`}
              tabIndex={0}
              role="button"
              aria-pressed={selectedPoint?.id === point.id}
            />
          ))}

          {/* Requirement 6.6: Hover tooltip with detailed information */}
          {hoveredPoint && !selectedPoint && (
            <div 
              className="absolute z-30 bg-card/95 backdrop-blur border border-border rounded-lg px-3 py-2 shadow-lg animate-in fade-in duration-150"
              style={{ 
                left: `${hoveredPoint.normalizedX}%`, 
                top: `${hoveredPoint.normalizedY - 8}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground">{hoveredPoint.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {(hoveredPoint.normalizedIntensity * 100).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{hoveredPoint.description}</p>
            </div>
          )}

          {/* Requirement 6.4: AI Analysis Panel for selected point */}
          {selectedPoint && selectedPointAnalysis && (
            <div className="absolute inset-4 bg-card/98 backdrop-blur border border-border rounded-xl p-4 overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">AI Analysis</span>
                </div>
                <button 
                  onClick={handleCloseTooltip}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close analysis panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Point Info */}
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-border">
                <div 
                  className="w-4 h-4 rounded-full mt-1 shrink-0"
                  style={{ background: getPointColor(selectedPoint.type, selectedPoint.normalizedIntensity) }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{selectedPoint.label}</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {overlayMode}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{selectedPoint.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Intensity: {(selectedPoint.normalizedIntensity * 100).toFixed(0)}%</span>
                    <span>Position: {selectedPoint.normalizedX.toFixed(1)}%, {selectedPoint.normalizedY.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Key Insights
                </h4>
                <div className="space-y-2">
                  {selectedPointAnalysis.insights.map((insight) => (
                    <div key={insight.id} className="flex items-start gap-2 p-2 bg-secondary/50 rounded-lg">
                      <AlertCircle className={cn(
                        "w-4 h-4 mt-0.5 shrink-0",
                        insight.priority === 'high' ? 'text-red-500' : 
                        insight.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
                      )} />
                      <div>
                        <span className="text-sm font-medium text-foreground">{insight.title}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{insight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Metrics */}
              <div className="mb-4 pb-4 border-b border-border">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                  Related Metrics
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-secondary/50 rounded-lg text-center">
                    <div className="text-lg font-semibold text-foreground">{selectedPointAnalysis.relatedMetrics.avgTimeOnElement}s</div>
                    <div className="text-xs text-muted-foreground">Avg. Time</div>
                  </div>
                  <div className="p-2 bg-secondary/50 rounded-lg text-center">
                    <div className="text-lg font-semibold text-foreground">{selectedPointAnalysis.relatedMetrics.bounceRate}%</div>
                    <div className="text-xs text-muted-foreground">Bounce Rate</div>
                  </div>
                  <div className="p-2 bg-secondary/50 rounded-lg text-center">
                    <div className="text-lg font-semibold text-foreground">{selectedPointAnalysis.relatedMetrics.conversionImpact}%</div>
                    <div className="text-xs text-muted-foreground">Conversion Impact</div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-primary" />
                  Recommendations
                </h4>
                <ul className="space-y-1.5">
                  {selectedPointAnalysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-6 px-6 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-sm text-muted-foreground">Good Interaction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <span className="text-sm text-muted-foreground">Attention/Confusion</span>
          </div>
          <div className="flex items-center gap-2 ml-auto text-xs text-muted-foreground">
            <Info className="w-3.5 h-3.5" />
            <span>Click points to view details</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default HeatmapVisualization