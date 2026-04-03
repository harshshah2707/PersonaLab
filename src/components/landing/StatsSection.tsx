'use client'

import { useEffect, useState } from 'react'

interface Stat {
  value: string
  label: string
  suffix: string
}

const stats: Stat[] = [
  { value: '5', label: 'AI Personas Generated', suffix: '' },
  { value: '30', label: 'Second Analysis Time', suffix: 's' },
  { value: '100', label: 'UX Score Range', suffix: '%' },
  { value: '24', label: 'Data Refresh Rate', suffix: 'h' }
] as const

function AnimatedCounter({ value, suffix }: { value: string; suffix: string }) {
  const [count, setCount] = useState(0)
  const target = parseInt(value)
  
  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = target / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [target])
  
  return (
    <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
      {count}{suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="py-16 px-6 border-y border-border/50 bg-secondary/20">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}