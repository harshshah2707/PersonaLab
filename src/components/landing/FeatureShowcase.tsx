import { FeatureCard } from './FeatureCard'
import { Users, Target, Lightbulb, BarChart3, MousePointer, Shield } from 'lucide-react'

const features = [
  {
    title: 'Multi-Persona Synthesis',
    description: 'Generate 5+ diverse synthetic users with unique demographics, psychological profiles, and varied browsing intent.',
    icon: Users,
    delay: 100
  },
  {
    title: 'Continuous Behavioral Simulation',
    description: 'Our engine runs hundreds of parallel user paths through your UI to identify bottleneck sequences.',
    icon: Target,
    delay: 200
  },
  {
    title: 'Friction Point Detection',
    description: 'Get AI-prioritized lists of specific UX friction points with semantic reasoning for each issue.',
    icon: Lightbulb,
    delay: 300
  },
  {
    title: 'Conversion Likelihood Maps',
    description: 'Real-time heatmaps that predict exactly where users drop off based on their psychographic profiles.',
    icon: BarChart3,
    delay: 400
  },
  {
    title: 'Pre-launch Interaction Data',
    description: 'Visualize every click, scroll, and hover with interactive heatmaps before writing a single line of tracking code.',
    icon: MousePointer,
    delay: 500
  },
  {
    title: 'Zero-Knowledge Privacy',
    description: 'Perform enterprise-grade user research without collecting a single real user biometric or PII.',
    icon: Shield,
    delay: 600
  }
]

export function FeatureShowcase() {
  return (
    <section className="relative py-32 px-6">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-violet/5 blur-[160px] -z-10" />
      
      <div className="max-w-7xl mx-auto relative cursor-default">
        {/* Section header */}
        <div className="text-center mb-20 space-y-4">
          <Badge variant="emerald" className="px-4 py-1.5 uppercase font-bold tracking-[0.1em] text-[10px]">Capabilities</Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight premium-gradient-text leading-[1.1]">
            Everything you need for <br/> <span className="violet-gradient-text italic">surgical precision optimization.</span>
          </h2>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Stop guessing and start predicting. Use AI simulation to know exactly how your product will perform.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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

import { Badge } from '@/components/ui/badge'