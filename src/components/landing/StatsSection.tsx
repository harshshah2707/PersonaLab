'use client'

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface Stat {
  value: string
  label: string
  suffix: string
}

const stats: Stat[] = [
  { value: '5', label: 'Neural Entities', suffix: '' },
  { value: '25', label: 'Extraction', suffix: 's' },
  { value: '99', label: 'Simulation Accuracy', suffix: '%' },
  { value: '24', label: 'Continuous Audit', suffix: '/7' }
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
    <span ref={countRef} className="text-4xl md:text-6xl font-black tracking-tighter tabular-nums text-coffee block mb-2 group-hover:scale-105 transition-transform duration-700">
      {count}{suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="relative py-16 px-6 overflow-hidden bg-white border-y border-sand">
      {/* Subtle Ambient Grain */}
      <div className="absolute inset-0 bg-cream/10 -z-10" />
      
      <div className="layout-container max-w-5xl mx-auto relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={cn(
                "group relative text-center md:text-left animate-in fade-in slide-in-from-bottom-8 duration-700",
                index === 1 && "delay-100",
                index === 2 && "delay-200",
                index === 3 && "delay-300"
              )}
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <div className="h-1 w-8 bg-terracotta/20 rounded-full mb-4 mx-auto md:mx-0 group-hover:w-16 group-hover:bg-terracotta transition-all duration-700" />
              <div className="space-y-1">
                <p className="text-[9px] md:text-[10px] text-coffee/30 font-black uppercase tracking-[0.3em] group-hover:text-coffee/50 transition-colors">
                  {stat.label}
                </p>
                <div className="hidden md:block h-[1px] w-full bg-sand/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}