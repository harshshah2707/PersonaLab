"use client"

import { FeatureCard } from './FeatureCard'
import { Users, Target, Lightbulb, BarChart3, MousePointer, Shield, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    title: 'Multi-Persona Synthesis',
    description: 'Construct 5+ diverse synthetic entities with localized psychographic profiles and varied browsing intent.',
    icon: Users,
    delay: 100
  },
  {
    title: 'Continuous Simulation',
    description: 'Neural engines execute hundreds of parallel user paths to identify bottleneck sequences at scale.',
    icon: Target,
    delay: 200
  },
  {
    title: 'Friction Cluster Detection',
    description: 'Prioritize strategic UX fixes with AI-reasoned observations for every identified friction cluster.',
    icon: Lightbulb,
    delay: 300
  },
  {
    title: 'Interaction Spectrum',
    description: 'Predictive thermal maps that visualize esattamente where user intuition deviates from intended paths.',
    icon: BarChart3,
    delay: 400
  },
  {
    title: 'Pre-Audit Visuals',
    description: 'Audit every click, scroll, and hover with interactive heatmaps before deploying a single tracker.',
    icon: MousePointer,
    delay: 500
  },
  {
    title: 'Sovereign Privacy',
    description: 'Execute high-fidelity behavioral research without infringing on real customer biometric data or PII.',
    icon: Shield,
    delay: 600
  }
]

export function FeatureShowcase() {
  return (
    <section className="relative py-24 px-6 bg-oat/30 border-t border-sand">
      {/* Refined Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-coffee/5 blur-[160px] -z-10" />
      
      <div className="layout-container relative cursor-default">
        {/* Editorial Section Header */}
        <div className="text-center mb-16 space-y-6 animate-in fade-in slide-in-from-bottom-8">
          <Badge variant="outline" className="bg-white px-4 py-1 uppercase font-black tracking-[0.3em] text-[10px] text-coffee/30 border-sand shadow-sm rounded-full inline-flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-terracotta" />
            Capabilities
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-coffee leading-[1.1] max-w-3xl mx-auto">
            Laboratory-grade insight for <br/> <span className="text-terracotta italic font-normal">surgical architectural precision.</span>
          </h2>
          <p className="text-lg text-coffee/40 max-w-xl mx-auto leading-relaxed">
            Stop guessing and start predicting. Use behavior-grade simulation to diagnose exactly where your product studio deviates.
          </p>
        </div>

        {/* Features Grid - Balanced Gap */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  )
}