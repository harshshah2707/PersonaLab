import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  className?: string
  delay?: number
}

export function FeatureCard({ title, description, icon: Icon, className, delay = 0 }: FeatureCardProps) {
  return (
    <Card className={cn(
      "metric-card bg-white group relative h-full border-sand overflow-hidden transition-all duration-700 animate-in fade-in slide-in-from-bottom-8",
      className
    )}
    style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-10 relative z-10 space-y-6">
        <div className="flex">
           <div className="p-4 rounded-2xl bg-cream text-coffee border border-sand group-hover:bg-coffee group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-sm">
             <Icon className="w-6 h-6" />
           </div>
        </div>
        <div className="space-y-3 min-w-0">
          <h3 className="text-xl font-bold text-coffee tracking-tighter leading-snug group-hover:text-terracotta transition-colors">
            {title}
          </h3>
          <p className="text-[13px] text-coffee/50 leading-relaxed font-medium transition-colors line-clamp-3">
            {description}
          </p>
        </div>
      </CardContent>
      
      {/* Editorial Shadow Accent */}
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-coffee/5 via-terracotta/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </Card>
  )
}