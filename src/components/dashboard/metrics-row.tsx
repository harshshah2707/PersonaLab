"use client"

import { TrendingUp, TrendingDown, Target, Zap, AlertTriangle, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { MetricsData } from '@/types'

interface MetricsRowProps {
  metrics: MetricsData
}

interface MetricConfig {
  key: keyof MetricsData | 'dropOffRisk'
  label: string
  icon: React.ElementType
  color: 'emerald' | 'cyan' | 'red' | 'yellow'
  format?: (v: number) => string
  isString?: boolean
}

const metricConfigs: MetricConfig[] = [
  { 
    key: 'conversionRate', 
    label: 'Conversion Rate', 
    icon: Target, 
    color: 'emerald',
    format: (v: number) => `${v}%`
  },
  { 
    key: 'uxScore', 
    label: 'UX Score', 
    icon: Zap, 
    color: 'cyan',
    format: (v: number) => `${v}/100`
  },
  { 
    key: 'dropOffRisk', 
    label: 'Drop-off Risk', 
    icon: AlertTriangle, 
    color: 'red',
    isString: true
  },
  { 
    key: 'engagement', 
    label: 'Engagement', 
    icon: Eye, 
    color: 'cyan',
    format: (v: number) => `${v}%`
  },
]

export function MetricsRow({ metrics }: MetricsRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metricConfigs.map((config) => {
        const value = metrics[config.key as keyof MetricsData] as number | string
        const trend = metrics.trend[config.key as keyof typeof metrics.trend] as number | null
        const formattedValue = config.format && typeof value === 'number' 
          ? config.format(value) 
          : String(value)
        
        return (
          <MetricCard
            key={config.key}
            title={config.label}
            value={formattedValue}
            trend={trend}
            icon={config.icon}
            color={config.color}
          />
        )
      })}
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  trend: number | null
  icon: React.ElementType
  color: 'emerald' | 'cyan' | 'red' | 'yellow'
}

function MetricCard({ title, value, trend, icon: Icon, color }: MetricCardProps) {
  const isPositive = trend !== null && trend > 0
  
  return (
    <Card className="metric-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-sm text-muted-foreground font-medium">{title}</span>
          <div className={cn(
            "p-2 rounded-lg",
            color === 'emerald' && "bg-primary/10 text-primary",
            color === 'cyan' && "bg-accent/10 text-accent",
            color === 'red' && "bg-red-500/10 text-red-500",
            color === 'yellow' && "bg-yellow-500/10 text-yellow-500"
          )}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="metric-value text-foreground mb-1">{value}</div>
        {trend !== null && (
          <div className={cn(
            "flex items-center gap-1 text-sm",
            isPositive ? "text-primary" : "text-destructive"
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(trend)}%</span>
            <span className="text-muted-foreground">vs last run</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}