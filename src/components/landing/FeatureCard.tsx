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
      "glass-card group relative h-full animate-in fade-in slide-in-from-bottom-2 duration-700",
      className
    )}
    style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-8 relative z-10">
        <div className="mb-6 flex">
           <div className="p-3 rounded-2xl bg-emerald/10 border border-emerald/20 text-emerald group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
             <Icon className="w-6 h-6" />
           </div>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:translate-x-1 transition-transform duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors">
          {description}
        </p>
      </CardContent>
      {/* Decorative gradient corner on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </Card>
  )
}