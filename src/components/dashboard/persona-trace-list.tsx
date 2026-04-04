"use client"

import { useDashboard } from '@/contexts/DashboardContext'
import { Activity, MousePointer2, Scroll, CheckCircle2, AlertCircle, Fingerprint, Search, Cpu } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function PersonaTraceList({ isCollapsed }: { isCollapsed: boolean }) {
  const { analysis, selectedPersona, simulationResults } = useDashboard()

  if (!analysis) return null

  const selectedPersonaData = analysis.personas.find(p => p.id === selectedPersona)
  const simulation = selectedPersona ? simulationResults.get(selectedPersona) : null
  
  // High-fidelity step mapping for neural traces 🏁🌟
  const steps = simulation?.interactions.map(i => ({
    type: i.type,
    label: i.element.toLowerCase().replace(/\s+/g, ' '),
    status: 'complete' as const,
    timestamp: `${(Math.random() * 2 + 1).toFixed(1)}s`
  })) || []

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 border-t border-border/10">
        <div className="w-8 h-8 rounded-xl bg-accent/5 border border-accent/15 flex items-center justify-center animate-pulse">
           <Activity className="w-4 h-4 text-accent" />
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8 border-t border-border/10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex items-center justify-between mb-8 px-1">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20 flex items-center gap-2">
          <Fingerprint className="w-3.5 h-3.5 text-accent" />
          Neural Trace
        </h4>
        {selectedPersonaData && (
          <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[8px] h-4 leading-none uppercase font-black px-2 py-0.5 tracking-tighter rounded-full">
             SYNCHRONIZED
          </Badge>
        )}
      </div>

      <div className="space-y-6">
        {selectedPersonaData ? (
          <div className="space-y-6">
             <div className="flex items-center gap-3 px-2 py-2 rounded-2xl bg-secondary/30 border border-border shadow-inner">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="text-[12px] font-bold text-foreground/60 truncate tracking-tight">{selectedPersonaData.name} Pulse</span>
             </div>

             <div className="space-y-4 max-h-[180px] overflow-y-auto pr-2 scrollbar-neutral transition-all">
                {steps.length > 0 ? (
                  steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4 animate-in slide-in-from-left-2 duration-300 group/step relative" style={{ animationDelay: `${idx * 150}ms` }}>
                       {/* Neural Connector Line */}
                       {idx < steps.length - 1 && (
                         <div className="absolute left-[7px] top-6 w-[2px] h-6 bg-border/20 group-hover/step:bg-accent/10 transition-colors" />
                       )}
                       
                       <div className={cn(
                         "p-1.5 rounded-lg border transition-all duration-500 shadow-sm shrink-0",
                         step.type === 'scroll' ? "bg-secondary text-foreground/30 border-border group-hover:border-accent/40" :
                         step.type === 'click' ? "bg-accent/5 text-accent border-accent/10 animate-pulse" :
                         "bg-secondary/40 text-foreground/10 border-border"
                       )}>
                          {step.type === 'scroll' ? <Scroll className="w-3 h-3" /> :
                           step.type === 'click' ? <MousePointer2 className="w-3 h-3" /> :
                           <Activity className="w-3 h-3" />}
                       </div>
                       
                       <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-[10px] font-bold text-foreground/40 lowercase tracking-[-0.01em] tabular-nums leading-none truncate group-hover:text-foreground transition-colors">
                               {step.type} {step.label}
                            </p>
                            <span className="text-[9px] font-mono text-foreground/10 group-hover:text-foreground/30">{step.timestamp}</span>
                          </div>
                          
                          <div className="w-full h-[1px] bg-secondary rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-accent/20 animate-shimmer" 
                               style={{ width: `${Math.random() * 40 + 60}%` }}
                             />
                          </div>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center border border-dashed border-border rounded-3xl bg-secondary/5">
                     <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/10 italic">Awaiting Log...</p>
                  </div>
                )}
             </div>
             
             {simulation?.converted ? (
               <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between shadow-sm group">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">Path Converted</span>
                  </div>
                  <Cpu className="w-3.5 h-3.5 text-emerald-500/20 group-hover:rotate-12 transition-transform" />
               </div>
             ) : simulation ? (
               <div className="p-3.5 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-between shadow-sm group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AlertCircle className="w-4 h-4 text-accent shrink-0" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent truncate">Friction Conflict</span>
                  </div>
                  <Search className="w-3.5 h-3.5 text-accent/20 group-hover:rotate-12 transition-transform shrink-0" />
               </div>
             ) : null}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-10 h-10 rounded-2xl bg-secondary/20 border border-border flex items-center justify-center mx-auto mb-4 opacity-20">
               <Fingerprint className="w-5 h-5 text-foreground" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/10 italic leading-relaxed">Identity Stream <br/> Offline</p>
          </div>
        )}
      </div>
    </div>
  )
}
