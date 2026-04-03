"use client"

import { useState, useCallback } from 'react'
import { Calendar, Clock, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TIME_RANGES } from '@/types'
import type { TimeRange, TimeRangeOption } from '@/types'

interface TimeRangeSelectorProps {
  value: TimeRange
  onChange: (value: TimeRange) => void
  className?: string
  showLabel?: boolean
}

const TIME_RANGE_CONFIG: Record<TimeRange, { icon: React.ElementType; description: string }> = {
  '24h': { icon: Clock, description: 'Last 24 hours' },
  '7d': { icon: Calendar, description: 'Last 7 days' },
  '30d': { icon: Calendar, description: 'Last 30 days' },
  'all': { icon: Calendar, description: 'All time data' }
}

export function TimeRangeSelector({ 
  value, 
  onChange, 
  className,
  showLabel = true 
}: TimeRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = useCallback((range: TimeRange) => {
    onChange(range)
    setIsOpen(false)
  }, [onChange])

  const currentConfig = TIME_RANGE_CONFIG[value]
  const CurrentIcon = currentConfig.icon

  return (
    <div className={cn("relative", className)}>
      {showLabel && (
        <label className="block text-sm font-medium text-muted-foreground mb-1.5">
          Time Range
        </label>
      )}
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg",
            "bg-background border border-border",
            "hover:bg-accent hover:border-primary/50",
            "transition-all duration-200",
            "text-sm text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/20"
          )}
        >
          <CurrentIcon className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{TIME_RANGES.find(r => r.value === value)?.label}</span>
          <ChevronDown className={cn(
            "w-4 h-4 text-muted-foreground ml-auto transition-transform",
            isOpen && "rotate-180"
          )} />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className={cn(
              "absolute top-full left-0 mt-1 z-20",
              "w-48 rounded-lg",
              "bg-background border border-border",
              "shadow-lg shadow-black/20",
              "overflow-hidden"
            )}>
              {TIME_RANGES.map((option) => {
                const config = TIME_RANGE_CONFIG[option.value]
                const OptionIcon = config.icon
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5",
                      "text-left text-sm transition-colors",
                      "hover:bg-accent",
                      value === option.value && "bg-accent text-primary font-medium",
                      "first:rounded-t-lg last:rounded-b-lg"
                    )}
                  >
                    <OptionIcon className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div>{option.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {config.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TimeRangeSelector