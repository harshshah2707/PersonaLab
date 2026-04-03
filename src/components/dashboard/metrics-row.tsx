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
  color: 'emerald' | 'cyan' | 'red' | 'violet'
  format?: (v: number) => string
  isString?: boolean
}

const metricConfigs: MetricConfig[] = [
  { 
    key: 'conversionRate', 
    label: 'Conversion', 
    icon: Target, 
    color: 'emerald',
    format: (v: number) => `${v.toFixed(2)}%`
  },
  { 
    key: 'uxScore', 
    label: 'UX Score', 
    icon: Zap, 
    color: 'violet',
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
    format: (v: number) => `${v.toFixed(2)}%`
  },
]

export function MetricsRow({ metrics, isPersonaFiltered, personaName }: MetricsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
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
            color={config.color}
            isPersonaFiltered={isPersonaFiltered}
            rawValue={typeof value === 'number' ? value : 0}
            delay={index * 100}
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
  color: 'emerald' | 'cyan' | 'red' | 'violet'
  isPersonaFiltered?: boolean
  rawValue: number
  delay?: number
}

function MetricCard({ title, value, trend, icon: Icon, color, isPersonaFiltered, rawValue, delay = 0 }: MetricCardProps) {
  const isPositive = trend !== null && trend > 0
  
  return (
    <Card 
      className={cn(
        "glass-card border-white/5 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-500",
        isPersonaFiltered && "border-emerald/30 shadow-[0_0_30px_rgba(16,185,129,0.08)]"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-2.5 rounded-xl transition-all duration-500",
            color === 'emerald' && "bg-emerald/10 text-emerald group-hover:bg-emerald/20",
            color === 'violet' && "bg-violet/10 text-violet group-hover:bg-violet/20",
            color === 'red' && "bg-red-500/10 text-red-500 group-hover:bg-red-500/20",
            color === 'cyan' && "bg-cyan/10 text-cyan group-hover:bg-cyan/20"
          )}>
            <Icon className="w-5 h-5 transition-transform duration-500 group-hover:scale-110" />
          </div>
          {trend !== null && (
            <div className={cn(
              "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
              isPositive ? "bg-emerald/10 text-emerald" : "bg-red-500/10 text-red-500"
            )}>
              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60 group-hover:text-muted-foreground transition-colors truncate">
            {title}
          </p>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground group-hover:emerald-gradient-text transition-all duration-500">
            {value}
          </h3>
        </div>

        {/* Subtle Progress Bar for Engagement/Conversion */}
        {(title === 'Conversion' || title === 'Engagement') && (
           <div className="mt-4 h-1 w-full bg-white/5 dark:bg-white/5 bg-black/5 rounded-full overflow-hidden">
             <div 
               className={cn(
                 "h-full rounded-full transition-all duration-1000",
                 color === 'emerald' ? "bg-emerald" : "bg-cyan"
               )}
               style={{ width: `${Math.min(100, Math.max(0, rawValue))}%` }}
             />
           </div>
        )}
      </CardContent>
      
      {/* Hover Background Shine */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </Card>
  )
}