"use client"

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  MapPin, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Clock,
  Target,
  Zap,
  ArrowRight,
  User,
  Fingerprint
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PersonaProfile, SimulationResult, Interaction } from '@/types'

interface PersonaJourneyPanelProps {
  persona: PersonaProfile | null
  simulationResult: SimulationResult | null
  className?: string
}

interface JourneyStep {
  page: string
  action: string
  timestamp: number
  type: 'navigation' | 'interaction' | 'conversion' | 'drop-off'
  details?: string
}

const getActionIcon = (type: Interaction['type']) => {
  switch (type) {
    case 'click': return '👆'
    case 'hover': return '👁'
    case 'scroll': return '📜'
    case 'navigation': return '🧭'
    case 'form': return '📝'
    default: return '•'
  }
}

const getStepIcon = (type: JourneyStep['type']) => {
  switch (type) {
    case 'conversion': return <CheckCircle2 className="w-4 h-4 text-emerald" />
    case 'drop-off': return <XCircle className="w-4 h-4 text-red-500" />
    case 'navigation': return <ArrowRight className="w-4 h-4 text-cyan" />
    default: return <MapPin className="w-4 h-4 text-muted-foreground/40" />
  }
}

export function PersonaJourneyPanel({ 
  persona, 
  simulationResult,
  className 
}: PersonaJourneyPanelProps) {
  const journeySteps = useMemo((): JourneyStep[] => {
    if (!simulationResult) return []

    return simulationResult.interactions.map((interaction, index) => ({
      page: interaction.page,
      action: `${getActionIcon(interaction.type)} ${interaction.element}`,
      timestamp: interaction.timestamp,
      type: index === simulationResult.interactions.length - 1 
        ? (simulationResult.converted ? 'conversion' : 'drop-off')
        : 'interaction' as const
    }))
  }, [simulationResult])

  if (!persona || !simulationResult) return null

  return (
    <Card className={cn("glass-card border-white/5 overflow-hidden group", className)}>
      <CardHeader className="pb-6 border-b border-white/5 bg-emerald-500/[0.01]">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald/10 text-emerald">
                <Fingerprint className="w-4 h-4" />
              </div>
              Simulated User Journey
            </CardTitle>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Sequence Extraction</p>
          </div>
          <Badge className={cn(
            "px-2 py-0.5 font-bold text-[9px] uppercase tracking-tighter",
            simulationResult.converted ? "bg-emerald/10 text-emerald border-emerald/20" : "bg-red-500/10 text-red-500 border-red-500/20"
          )}>
            {simulationResult.converted ? 'Path Converted' : 'Path Abandoned'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="p-6 space-y-8">
            {/* Header Persona Meta */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald/20 to-cyan/20 flex items-center justify-center border border-white/10">
                <span className="text-xl font-black text-foreground/80">{persona.name.charAt(0)}</span>
              </div>
              <div>
                <h4 className="font-bold text-foreground/90 tracking-tight leading-none mb-1">{persona.name}</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{persona.role}</p>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <JourneyMetric label="Conv. Probability" value={`${Math.round(persona.conversionLikelihood * 100)}%`} icon={Target} color="emerald" />
              <JourneyMetric label="Engagement" value={simulationResult.engagementScore.toString()} icon={Zap} color="violet" />
              <JourneyMetric label="Time on Site" value={`${Math.round(simulationResult.totalDuration / 1000)}s`} icon={Clock} color="cyan" />
              <JourneyMetric label="Nodes Explored" value={simulationResult.pagesVisited.length.toString()} icon={MapPin} color="amber" />
            </div>

            {/* Timeline View */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Journey Timeline</h5>
                <div className="h-px bg-white/5 flex-1 mx-4" />
              </div>
              
              <div className="relative pl-6 border-l border-white/5 space-y-6 ml-2">
                {journeySteps.map((step, index) => (
                  <div key={index} className="relative group/step">
                    <div className="absolute -left-[33px] top-1 p-1 rounded-full bg-background border border-white/5 shadow-2xl group-hover/step:scale-110 transition-transform">
                      {getStepIcon(step.type)}
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground/80 tracking-tight leading-none group-hover/step:text-foreground transition-colors">{step.page}</p>
                        <p className="text-[11px] text-muted-foreground/60 font-medium">{step.action}</p>
                      </div>
                      <span className="text-[10px] font-bold tabular-nums text-muted-foreground/30">{Math.round(step.timestamp / 1000)}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Retention Risk / Drop-off */}
            {simulationResult.dropOffPoint && !simulationResult.converted && (
              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500">
                   <AlertCircle className="w-3 h-3" />
                   <span>Critical Termination Point</span>
                </div>
                <p className="text-xs text-foreground/70 font-medium leading-relaxed italic">
                  &ldquo;Process terminated at {simulationResult.dropOffPoint} due to identified friction node.&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function JourneyMetric({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
  const colors = {
    emerald: "text-emerald bg-emerald/10 border-emerald/20",
    violet: "text-violet bg-violet/10 border-violet/20",
    cyan: "text-cyan bg-cyan/10 border-cyan/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20"
  }
  
  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 group/metric hover:bg-white/[0.04] transition-colors">
      <div className="flex items-center gap-2">
        <div className={cn("p-1.5 rounded-lg border", colors[color as keyof typeof colors])}>
           <Icon className="w-3 h-3" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground/60 group-hover/metric:text-muted-foreground/80 transition-colors">{label}</span>
      </div>
      <div className="text-xl font-black tabular-nums tracking-tighter text-foreground/90">{value}</div>
    </div>
  )
}

export default PersonaJourneyPanel