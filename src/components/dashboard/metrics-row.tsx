"use client"

import { TrendingUp, TrendingDown, Target, Zap, AlertTriangle, Eye, User, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { MetricsData } from '@/types'

interface MetricsRowProps {
  metrics: MetricsData
  isPersonaFiltered?: boolean
  personaName?: string | null
}

interface MetricConfig {
  key: keyof MetricsData | 'dropOffRisk'
  label: string
  icon: React.ElementType
  color: 'emerald' | 'cyan' | 'red' | 'terracotta'
  format?: (v: number) => string
  isString?: boolean
}

const metricConfigs: MetricConfig[] = [
  { 
    key: 'conversionRate', 
    label: 'Conversion', 
    icon: Target, 
    color: 'terracotta' as any,
    format: (v: number) => `${v.toFixed(1)}%`
  },
  { 
    key: 'uxScore', 
    label: 'UX Score', 
    icon: Zap, 
    color: 'cyan',
    format: (v: number) => `${Math.round(v)}/100`
  },
  { 
    key: 'dropOffRisk', 
    label: 'Churn Risk', 
    icon: AlertTriangle, 
    color: 'red',
    isString: true
  },
  { 
    key: 'engagement', 
    label: 'Engagement', 
    icon: Eye, 
    color: 'cyan',
    format: (v: number) => `${v.toFixed(1)}%`
  },
]

export function MetricsRow({ metrics, isPersonaFiltered, personaName }: MetricsRowProps) {
  return (
    <div className="layout-container py-4 md:py-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {metricConfigs.map((config, index) => {
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
              color={config.color as any}
              isPersonaFiltered={isPersonaFiltered}
              rawValue={typeof value === 'number' ? value : 0}
              delay={index * 100}
            />
          )
        })}
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  trend: number | null
  icon: React.ElementType
  color: 'emerald' | 'cyan' | 'red' | 'terracotta'
  isPersonaFiltered?: boolean
  rawValue: number
  delay?: number
}

function MetricCard({ title, value, trend, icon: Icon, color, isPersonaFiltered, rawValue, delay = 0 }: MetricCardProps) {
  const isPositive = trend !== null && trend > 0
  
  return (
    <Card 
      className={cn(
        "metric-card h-auto transition-all duration-700 group animate-in fade-in slide-in-from-bottom-4 bg-white border-sand",
        isPersonaFiltered && "ring-2 ring-forest/10 border-forest shadow-md"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-5 relative z-10 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              "p-2.5 rounded-xl transition-all duration-500",
              color === 'terracotta' && "bg-terracotta/5 text-terracotta group-hover:bg-terracotta group-hover:text-white group-hover:rotate-3",
              color === 'emerald' && "bg-forest/5 text-forest group-hover:bg-forest group-hover:text-white group-hover:rotate-3",
              color === 'red' && "bg-red-500/5 text-red-500 group-hover:bg-red-500 group-hover:text-white group-hover:rotate-3",
              color === 'cyan' && "bg-cream text-coffee/20 group-hover:bg-coffee group-hover:text-white group-hover:rotate-3"
            )}>
              <Icon className="w-4 h-4 transition-all duration-500" />
            </div>
            {trend !== null && (
                <div className={cn(
                  "flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                  isPositive ? "bg-forest/5 text-forest" : "bg-red-500/5 text-red-500"
                )}>
                  {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span>{Math.abs(trend).toFixed(1)}%</span>
                </div>
            )}
          </div>
          
          <div className="space-y-1.5">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-coffee/30 transition-colors truncate">
              {title}
            </p>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tighter text-coffee group-hover:text-foreground transition-all duration-500 leading-none">
              {value}
            </h3>
          </div>
        </div>

        {/* Subtle Progress Bar */}
        {(title === 'Conversion' || title === 'Engagement') && (
           <div className="mt-5 h-[1px] w-full bg-sand rounded-full overflow-hidden">
             <div 
               className={cn(
                 "h-full rounded-full transition-all duration-1000",
                 color === 'terracotta' ? "bg-terracotta" : "bg-coffee/30"
               )}
               style={{ width: `${Math.min(100, Math.max(0, rawValue))}%` }}
             />
           </div>
        )}
      </CardContent>
    </Card>
  )
}