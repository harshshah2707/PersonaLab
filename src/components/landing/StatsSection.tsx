'use client'

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface Stat {
  value: string
  label: string
  suffix: string
}

const stats: Stat[] = [
  { value: '5', label: 'AI Personas', suffix: '' },
  { value: '30', label: 'Analysis Time', suffix: 's' },
  { value: '98', label: 'Sim Accuracy', suffix: '%' },
  { value: '24', label: 'Global Reach', suffix: '/7' }
] as const

function AnimatedCounter({ value, suffix }: { value: string; suffix: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const target = parseInt(value)
  const countRef = useRef<HTMLSpanElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    
    if (countRef.current) {
      observer.observe(countRef.current)
    }
    
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    
    const duration = 2000
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
  }, [target, isVisible])
  
  return (
    <span ref={countRef} className="text-4xl md:text-6xl font-bold tracking-tighter tabular-nums emerald-gradient-text block mb-1">
      {count}{suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Subtle Noise/Gradient Background */}
      <div className="absolute inset-0 bg-secondary/10 -z-10" />
      
      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={cn(
                "group relative text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-700",
                index === 1 && "delay-100",
                index === 2 && "delay-200",
                index === 3 && "delay-300"
              )}
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <div className="h-px w-8 bg-emerald/30 mb-4 mx-auto md:mx-0 group-hover:w-16 transition-all duration-500" />
              <p className="text-xs md:text-sm text-muted-foreground font-bold uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}