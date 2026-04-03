"use client"

import { useEffect, useState, useCallback, useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus, Target, Zap, AlertTriangle, Eye, BarChart3, History } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { MetricsData, TimeRange } from '@/types'
import { TimeRangeSelector } from './time-range-selector'
import { 
  generateHistoricalMetrics, 
  calculatePerformanceComparison,
  validateAllMetrics,
  clampConversionRate,
  clampUxScore,
  clampEngagement
} from '@/lib/metricsCalculations'

interface MetricsPanelProps {
  metrics: MetricsData
  previousMetrics?: MetricsData | null
  className?: string
  showBenchmarks?: boolean
  showTimeRange?: boolean
  historicalData?: MetricsData[]
}

interface MetricCardProps {
  title: string
  value: number | string
  trend?: number | null
  benchmark?: number
  icon: React.ElementType
  format: 'percentage' | 'score' | 'risk' | 'number'
  color: 'emerald' | 'cyan' | 'red' | 'yellow' | 'blue'
  description?: string
}

const formatValue = (value: number | string, format: MetricCardProps['format']): string => {
  if (typeof value === 'string') return value
  switch (format) {
    case 'percentage':
      return `${value.toFixed(1)}%`
    case 'score':
      return `${Math.round(value)}`
    case 'risk':
      return value.toFixed(1)
    default:
      return value.toFixed(1)
  }
}

const getRiskColor = (risk: MetricsData['dropOffRisk']): 'emerald' | 'yellow' | 'red' => {
  switch (risk) {
    case 'low':
      return 'emerald'
    case 'medium':
      return 'yellow'
    case 'high':
      return 'red'
  }
}

const getRiskLabel = (risk: MetricsData['dropOffRisk']): string => {
  switch (risk) {
    case 'low':
      return 'Low Risk'
    case 'medium':
      return 'Medium Risk'
    case 'high':
      return 'High Risk'
  }
}

const AnimatedCounter = ({ 
  value, 
  format,
  duration = 600 
}: { 
  value: number 
  format: MetricCardProps['format']
  duration?: number
}) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const start = displayValue
    const end = value
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = start + (end - start) * easeOut
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return <span>{formatValue(displayValue, format)}</span>
}

const TrendIndicator = ({ 
  trend, 
  size = 'sm' 
}: { 
  trend: number | null | undefined
  size?: 'sm' | 'md'
}) => {
  if (trend === null || trend === undefined) return null

  const isPositive = trend > 0
  const isNeutral = trend === 0

  if (isNeutral) {
    return (
      <div className={cn(
        "flex items-center gap-1",
        size === 'md' ? "text-sm" : "text-xs"
      )}>
        <Minus className={cn("w-3 h-3", size === 'md' && "w-4 h-4")} />
        <span>No change</span>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex items-center gap-1",
      isPositive ? "text-emerald-500" : "text-red-500",
      size === 'md' ? "text-sm" : "text-xs"
    )}>
      {isPositive ? (
        <TrendingUp className={cn("w-3 h-3", size === 'md' && "w-4 h-4")} />
      ) : (
        <TrendingDown className={cn("w-3 h-3", size === 'md' && "w-4 h-4")} />
      )}
      <span className="font-medium">{Math.abs(trend).toFixed(1)}%</span>
      <span className="text-muted-foreground">vs benchmark</span>
    </div>
  )
}

const BenchmarkComparison = ({ 
  value, 
  benchmark,
  format
}: { 
  value: number
  benchmark: number
  format: MetricCardProps['format']
}) => {
  const diff = value - benchmark
  const isAbove = diff > 0
  const isEqual = diff === 0

  if (isEqual) {
    return (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <span>Matches benchmark</span>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex items-center gap-1 text-sm",
      isAbove ? "text-emerald-500" : "text-yellow-500"
    )}>
      {isAbove ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      <span>{isAbove ? '+' : ''}{diff.toFixed(1)}% vs benchmark</span>
    </div>
  )
}

const MetricCard = ({ 
  title, 
  value, 
  trend, 
  benchmark,
  icon: Icon, 
  format, 
  color,
  description 
}: MetricCardProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const colorClasses = {
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      border: "border-emerald-500/20",
      gradient: "from-emerald-500/20"
    },
    cyan: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-500",
      border: "border-cyan-500/20",
      gradient: "from-cyan-500/20"
    },
    red: {
      bg: "bg-red-500/10",
      text: "text-red-500",
      border: "border-red-500/20",
      gradient: "from-red-500/20"
    },
    yellow: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-500",
      border: "border-yellow-500/20",
      gradient: "from-yellow-500/20"
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      border: "border-blue-500/20",
      gradient: "from-blue-500/20"
    }
  }

  const styles = colorClasses[color]

  return (
    <Card 
      className={cn(
        "metric-card relative overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:shadow-primary/5",
        "border border-border/50",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50",
        styles.gradient,
        "transition-opacity duration-300"
      )} />
      
      <CardContent className="p-5 relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">{title}</span>
            {description && (
              <span className="text-xs text-muted-foreground/70" title={description}>
                <BarChart3 className="w-3 h-3" />
              </span>
            )}
          </div>
          <div className={cn(
            "p-2 rounded-lg transition-transform duration-200",
            "hover:scale-110",
            styles.bg
          )}>
            <Icon className={cn("w-4 h-4", styles.text)} />
          </div>
        </div>

        <div className="metric-value-container mb-2">
          {typeof value === 'number' ? (
            <AnimatedCounter value={value} format={format} />
          ) : (
            <span className="text-foreground">{value}</span>
          )}
          {format === 'percentage' && <span className="text-muted-foreground ml-1">%</span>}
          {format === 'score' && <span className="text-muted-foreground ml-1">/100</span>}
        </div>

        {trend !== undefined && trend !== null && (
          <TrendIndicator trend={trend} size="sm" />
        )}

        {benchmark !== undefined && benchmark !== null && (
          <BenchmarkComparison 
            value={typeof value === 'number' ? value : 0} 
            benchmark={benchmark}
            format={format}
          />
        )}
      </CardContent>
    </Card>
  )
}

const RiskMeter = ({ risk }: { risk: MetricsData['dropOffRisk'] }) => {
  const riskLevels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high']
  const currentIndex = riskLevels.indexOf(risk)

  return (
    <div className="flex items-center gap-1 mt-2">
      {riskLevels.map((level, index) => (
        <div
          key={level}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            index <= currentIndex
              ? level === 'low' ? "bg-emerald-500 w-6" 
                : level === 'medium' ? "bg-yellow-500 w-6" 
                : "bg-red-500 w-6"
              : "bg-muted w-3"
          )}
        />
      ))}
    </div>
  )
}

export function MetricsPanel({ 
  metrics, 
  previousMetrics,
  className,
  showBenchmarks = true,
  showTimeRange = true,
  historicalData
}: MetricsPanelProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Validate metrics bounds on mount and when metrics change
  useEffect(() => {
    const validation = validateAllMetrics(metrics)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
    } else {
      setValidationErrors([])
    }
  }, [metrics])

  // Generate historical metrics when time range changes
  const historicalMetrics = useMemo(() => {
    return generateHistoricalMetrics(metrics, timeRange)
  }, [metrics, timeRange])

  // Calculate performance comparison
  const performanceComparison = useMemo(() => {
    return calculatePerformanceComparison(metrics, previousMetrics)
  }, [metrics, previousMetrics])

  const calculateTrend = useCallback((
    current: number, 
    previous?: number | null
  ): number | null => {
    if (!previous || previous === 0) return null
    return ((current - previous) / previous) * 100
  }, [])

  // Clamp metric values to ensure they stay within bounds
  const clampedMetrics = useMemo(() => ({
    conversionRate: clampConversionRate(metrics.conversionRate),
    uxScore: clampUxScore(metrics.uxScore),
    engagement: clampEngagement(metrics.engagement)
  }), [metrics.conversionRate, metrics.uxScore, metrics.engagement])

  const metricsConfig = [
    {
      title: 'Conversion Rate',
      value: clampedMetrics.conversionRate * 100,
      trend: calculateTrend(clampedMetrics.conversionRate, previousMetrics?.conversionRate),
      benchmark: 2.5,
      icon: Target,
      format: 'percentage' as const,
      color: 'emerald' as const,
      description: 'Percentage of simulated users who completed desired actions'
    },
    {
      title: 'UX Score',
      value: clampedMetrics.uxScore,
      trend: calculateTrend(clampedMetrics.uxScore, previousMetrics?.uxScore),
      benchmark: 70,
      icon: Zap,
      format: 'score' as const,
      color: 'cyan' as const,
      description: 'Overall user experience quality score (0-100)'
    },
    {
      title: 'Drop-off Risk',
      value: getRiskLabel(metrics.dropOffRisk),
      trend: null,
      icon: AlertTriangle,
      format: 'risk' as const,
      color: getRiskColor(metrics.dropOffRisk),
      description: 'Likelihood of user abandonment during journey'
    },
    {
      title: 'Engagement',
      value: clampedMetrics.engagement,
      trend: calculateTrend(clampedMetrics.engagement, previousMetrics?.engagement),
      benchmark: 50,
      icon: Eye,
      format: 'percentage' as const,
      color: 'blue' as const,
      description: 'Level of user interaction and content engagement'
    }
  ]

  // Get trend icon and color based on performance
  const getTrendIcon = () => {
    switch (performanceComparison.overallTrend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getTrendColor = () => {
    switch (performanceComparison.overallTrend) {
      case 'improving':
        return 'text-emerald-500'
      case 'declining':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Key Metrics</h2>
        <div className="flex items-center gap-4">
          {showTimeRange && (
            <TimeRangeSelector 
              value={timeRange} 
              onChange={setTimeRange}
              showLabel={false}
            />
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className={cn(
              "w-2 h-2 rounded-full",
              isLoaded ? "bg-emerald-500 animate-pulse" : "bg-muted"
            )} />
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* Validation errors display */}
      {validationErrors.length > 0 && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-500 font-medium">Metric Validation Errors:</p>
          <ul className="text-sm text-red-400 mt-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Performance trend summary */}
      {previousMetrics && (
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-lg",
          "bg-accent/50 border border-border",
          "transition-all duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}>
          <History className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Performance vs Previous Period
            </p>
            <p className={cn("text-sm font-medium", getTrendColor())}>
              {performanceComparison.overallTrend === 'improving' && 'Showing improvement across key metrics'}
              {performanceComparison.overallTrend === 'declining' && 'Some metrics showing decline vs previous period'}
              {performanceComparison.overallTrend === 'stable' && 'Metrics stable compared to previous period'}
            </p>
          </div>
          {getTrendIcon()}
        </div>
      )}

      <div className={cn(
        "grid gap-4 transition-all duration-500",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        isLoaded ? "opacity-100" : "opacity-0"
      )}>
        {metricsConfig.map((config, index) => (
          <div
            key={config.title}
            className="transition-all duration-300"
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <MetricCard {...config} />
            {config.title === 'Drop-off Risk' && (
              <RiskMeter risk={metrics.dropOffRisk} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MetricsPanel