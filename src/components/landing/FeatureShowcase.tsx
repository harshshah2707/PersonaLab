import { FeatureCard } from './FeatureCard'
import { Users, Target, Lightbulb, BarChart3, MousePointer, Shield } from 'lucide-react'

const features = [
  {
    title: 'AI Personas',
    description: 'Generate 5 diverse synthetic users based on your target audience demographics and behavior patterns.',
    icon: Users,
    gradient: 'bg-gradient-to-br from-primary to-emerald-600'
  },
  {
    title: 'Behavior Simulation',
    description: 'Watch simulated users navigate your product, identifying friction points and conversion barriers.',
    icon: Target,
    gradient: 'bg-gradient-to-br from-accent to-cyan-600'
  },
  {
    title: 'Actionable Insights',
    description: 'Get specific, prioritized recommendations to improve your UX and conversion rates.',
    icon: Lightbulb,
    gradient: 'bg-gradient-to-br from-yellow-500 to-orange-500'
  },
  {
    title: 'Conversion Metrics',
    description: 'Track predicted conversion rates, engagement scores, and drop-off risks across all personas.',
    icon: BarChart3,
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500'
  },
  {
    title: 'Interactive Heatmaps',
    description: 'Visualize where synthetic users click, hover, and scroll to identify optimization opportunities.',
    icon: MousePointer,
    gradient: 'bg-gradient-to-br from-primary to-accent'
  },
  {
    title: 'Privacy First',
    description: 'No real user data required. Test and optimize without compromising user privacy.',
    icon: Shield,
    gradient: 'bg-gradient-to-br from-slate-500 to-slate-700'
  }
]

export function FeatureShowcase() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to optimize UX
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful AI-driven tools to understand user behavior and improve your product
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              gradient={feature.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  )
}