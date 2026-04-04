"use client"

import { useEffect, useState, useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus, Target, Zap, AlertTriangle, Eye, BarChart3, History, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { MetricsData, TimeRange } from '@/types'
import { TimeRangeSelector } from './time-range-selector'
import { Badge } from '@/components/ui/badge'

interface MetricsPanelProps {
  metrics: MetricsData
  previousMetrics?: MetricsData | null
  className?: string
  showBenchmarks?: boolean
  showTimeRange?: boolean
}

interface MetricCardProps {
  title: string
  value: number | string
  trend?: number | null
  icon: React.ElementType
  format: 'percentage' | 'score' | 'risk' | 'number'
  color: 'forest' | 'terracotta' | 'coffee' | 'sand'
  description?: string
  delay?: number
}

const formatValue = (value: number | string, format: MetricCardProps['format']): string => {
  if (typeof value === 'string') return value
  switch (format) {
    case 'percentage': return `${value.toFixed(1)}%`
    case 'score': return `${Math.round(value)}`
    case 'risk': return value.toFixed(1)
    default: return value.toFixed(1)
  }
}

const getRiskColor = (risk: MetricsData['dropOffRisk']): 'forest' | 'terracotta' => {
  return risk === 'low' ? 'forest' : 'terracotta'
}

const getRiskLabel = (risk: MetricsData['dropOffRisk']): string => {
  return risk === 'low' ? 'Nominal' : risk === 'medium' ? 'Elevated' : 'Critical'
}

const AnimatedCounter = ({ value, format }: { value: number, format: MetricCardProps['format'] }) => {
  const [displayValue, setDisplayValue] = useState(0)
  useEffect(() => {
    const duration = 1000
    const start = displayValue
    const end = value
    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 4)
      setDisplayValue(start + (end - start) * easeOut)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value])
  return <span>{formatValue(displayValue, format)}</span>
}

const TrendIndicator = ({ trend }: { trend: number | null | undefined }) => {
  if (trend === null || trend === undefined) return null
  const isPositive = trend > 0
  const isNeutral = trend === 0
  if (isNeutral) return <div className="text-[9px] font-black uppercase tracking-widest text-coffee/20 flex items-center gap-1"><Minus className="w-2.5 h-2.5" /> Stagnant</div>
  
  return (
    <div className={cn(
      "flex items-center gap-1 text-[9px] font-black uppercase tracking-widest",
      isPositive ? "text-forest" : "text-terracotta"
    )}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      <span>{Math.abs(trend).toFixed(1)}%</span>
    </div>
  )
}

const MetricCard = ({ title, value, trend, icon: Icon, format, color, delay = 0 }: MetricCardProps) => {
  const colors = {
    forest: "bg-forest/5 text-forest border-forest/10 shadow-forest/5",
    terracotta: "bg-terracotta/5 text-terracotta border-terracotta/10 shadow-terracotta/5",
    coffee: "bg-coffee/5 text-coffee border-sand shadow-coffee/5",
    sand: "bg-cream text-coffee/40 border-sand shadow-sm"
  }

  return (
    <Card className="metric-card bg-white h-auto border-sand group transition-all duration-700 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${delay}ms` }}>
      <CardContent className="p-5 flex flex-col justify-between relative z-10 transition-all">
        <div>
           <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl border transition-all duration-700 group-hover:scale-110 group-hover:shadow-lg", colors[color])}>
                 <Icon className="w-4 h-4" />
              </div>
              {trend !== undefined && <TrendIndicator trend={trend} />}
           </div>
           
           <div className="space-y-1.5">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-coffee/30 group-hover:text-coffee/50 transition-colors truncate">
                {title}
              </p>
              <div className="text-3xl font-bold text-coffee tracking-tighter tabular-nums leading-none">
                 {typeof value === 'number' ? <AnimatedCounter value={value} format={format} /> : value}
                 {format === 'percentage' && <span className="text-coffee/20 text-lg ml-0.5">%</span>}
                 {format === 'score' && <span className="text-coffee/20 text-lg ml-0.5">/100</span>}
              </div>
           </div>
        </div>
        
        {/* Subtle Horizontal Accent */}
        <div className="mt-5 h-[1px] w-8 bg-sand rounded-full group-hover:w-full group-hover:bg-coffee/10 transition-all duration-700" />
      </CardContent>
    </Card>
  )
}

export function MetricsPanel({ metrics, previousMetrics, className, showTimeRange = true }: MetricsPanelProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')

  const calculateTrend = (current: number, previous?: number | null): number | null => {
    if (!previous || previous === 0) return null
    return ((current - previous) / previous) * 100
  }

  const metricsConfig = [
    {
      title: 'Conversion Logic',
      value: metrics.conversionRate * 100,
      trend: calculateTrend(metrics.conversionRate, previousMetrics?.conversionRate),
      icon: Target,
      format: 'percentage' as const,
      color: 'forest' as const,
      delay: 100
    },
    {
      title: 'Architectural UX',
      value: metrics.uxScore,
      trend: calculateTrend(metrics.uxScore, previousMetrics?.uxScore),
      icon: Zap,
      format: 'score' as const,
      color: 'coffee' as const,
      delay: 150
    },
    {
      title: 'Structural Risk',
      value: getRiskLabel(metrics.dropOffRisk),
      icon: AlertTriangle,
      format: 'risk' as const,
      color: getRiskColor(metrics.dropOffRisk) as any,
      delay: 200
    },
    {
      title: 'Neural Pulse',
      value: metrics.engagement,
      trend: calculateTrend(metrics.engagement, previousMetrics?.engagement),
      icon: Eye,
      format: 'percentage' as const,
      color: 'sand' as const,
      delay: 250
    }
  ]

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
           <h2 className="text-xl font-bold text-coffee tracking-tighter">Diagnostic Pulse</h2>
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-coffee/20">Metadata</p>
        </div>
        <div className="flex items-center gap-4">
          {showTimeRange && (
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} showLabel={false} />
          )}
          <Badge variant="outline" className="bg-white border-sand text-coffee/30 px-3 py-1 rounded-full flex items-center gap-1.5">
             <div className="w-1 h-1 rounded-full bg-forest animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-widest">Live Audit</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {metricsConfig.map((config) => (
          <MetricCard key={config.title} {...config} />
        ))}
      </div>
    </div>
  )
}

export default MetricsPanel