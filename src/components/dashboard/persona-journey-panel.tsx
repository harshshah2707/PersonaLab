"use client"

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Clock,
  Target,
  Zap,
  ArrowRight,
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
  type: 'navigation' | 'interaction' | 'conversion' | 'drop-off' | 'interaction'
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
    case 'conversion': return <CheckCircle2 className="w-4 h-4 text-forest" />
    case 'drop-off': return <XCircle className="w-4 h-4 text-terracotta" />
    case 'navigation': return <ArrowRight className="w-4 h-4 text-coffee" />
    default: return <MapPin className="w-4 h-4 text-coffee/20" />
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
    <Card className={cn("metric-card overflow-hidden group bg-white border-sand", className)}>
      <CardHeader className="pb-8 border-b border-sand bg-cream/30">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <CardTitle className="text-xl font-bold tracking-tighter flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-coffee text-white shadow-lg shadow-coffee/10">
                <Fingerprint className="w-5 h-5" />
              </div>
              <span className="truncate">Neural Path Trace</span>
            </CardTitle>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee/30 truncate">Sequence Diagnostics</p>
          </div>
          <Badge className={cn(
            "px-4 py-1.5 font-black text-[10px] uppercase tracking-widest rounded-full shrink-0 border-2",
            simulationResult.converted ? "bg-forest/10 text-forest border-forest/20" : "bg-terracotta/10 text-terracotta border-terracotta/20"
          )}>
            {simulationResult.converted ? 'Verified' : 'Terminated'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[800px] overflow-y-auto scrollbar-neutral transition-all">
          <div className="p-8 space-y-12">
            {/* Header Persona Meta - Premium Identity Block */}
            <div className="flex items-center gap-5 p-6 rounded-[2rem] bg-cream/40 border border-sand shadow-sm group/identity hover:bg-white transition-all duration-700">
              <div className="w-14 h-14 rounded-2xl bg-coffee flex items-center justify-center border-4 border-white shadow-xl rotate-3 group-hover/identity:rotate-0 transition-all duration-500">
                <span className="text-2xl font-black text-white">{persona.name.charAt(0)}</span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-lg text-coffee tracking-tighter leading-none mb-2 truncate">{persona.name}</h4>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee/30 truncate">{persona.role}</p>
              </div>
            </div>

            {/* Core Metrics Grid - High-Fidelity Poise */}
            <div className="grid grid-cols-2 gap-4">
              <JourneyMetric label="Conv. Probability" value={`${Math.round(persona.conversionLikelihood * 100)}%`} icon={Target} color="terracotta" />
              <JourneyMetric label="Pulse Score" value={simulationResult.engagementScore.toString()} icon={Zap} color="coffee" />
              <JourneyMetric label="Neural Duration" value={`${Math.round(simulationResult.totalDuration / 1000)}s`} icon={Clock} color="coffee" />
              <JourneyMetric label="Nodes" value={simulationResult.pagesVisited.length.toString()} icon={MapPin} color="coffee" />
            </div>

            {/* Timeline View - Editorial Integrity */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-coffee/20">Extraction Log</h5>
                <div className="h-[1px] bg-sand flex-1 mx-6" />
              </div>
              
              <div className="relative pl-8 border-l-2 border-sand space-y-10 ml-3">
                {journeySteps.map((step, index) => (
                  <div key={index} className="relative group/step animate-in slide-in-from-left-4" style={{ animationDelay: `${index * 150}ms` }}>
                    <div className="absolute -left-[43px] top-0 p-2 rounded-2xl bg-white border-2 border-sand shadow-sm group-hover/step:scale-110 group-hover/step:border-coffee/20 transition-all duration-500">
                      {getStepIcon(step.type as any)}
                    </div>
                    <div className="flex items-start justify-between gap-6 min-w-0">
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <p className="text-[13px] font-bold text-coffee tracking-tight leading-none group-hover/step:text-terracotta transition-colors truncate">{step.page}</p>
                        <p className="text-[11px] text-coffee/40 font-black uppercase tracking-widest truncate">{step.action}</p>
                      </div>
                      <span className="text-[10px] font-black tabular-nums text-coffee/20 shrink-0 self-center">{Math.round(step.timestamp / 1000)}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Termination Logic Block */}
            {simulationResult.dropOffPoint && !simulationResult.converted && (
              <div className="p-6 rounded-[2rem] bg-terracotta/5 border border-terracotta/10 space-y-4 animate-in zoom-in-95 duration-700">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-terracotta">
                   <AlertCircle className="w-4 h-4" />
                   <span>Neural Termination</span>
                </div>
                <p className="text-[13px] text-coffee/70 font-bold leading-relaxed italic pr-4">
                  &ldquo;Extraction halted at node {simulationResult.dropOffPoint} following identified friction clusters.&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function JourneyMetric({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: 'terracotta' | 'coffee' | 'forest' }) {
  const colors = {
    terracotta: "text-terracotta bg-terracotta/5 border-terracotta/10",
    coffee: "text-coffee bg-coffee/5 border-sand",
    forest: "text-forest bg-forest/5 border-forest/10"
  }
  
  return (
    <div className="p-5 rounded-[1.5rem] bg-white border border-sand space-y-4 group/metric hover:border-coffee/20 hover:shadow-lg transition-all duration-500">
      <div className="flex items-center gap-3">
        <div className={cn("p-2.5 rounded-2xl border transition-all duration-500 group-hover/metric:scale-110", colors[color])}>
           <Icon className="w-4 h-4" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-coffee/30 group-hover/metric:text-coffee/50 transition-colors truncate">{label}</span>
      </div>
      <div className="text-3xl font-bold tabular-nums tracking-tighter text-coffee">{value}</div>
    </div>
  )
}

export default PersonaJourneyPanel