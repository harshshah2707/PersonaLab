"use client"

import { useState, useEffect } from 'react'
import { useDashboard } from '@/contexts/DashboardContext'
import { cn } from '@/lib/utils'
import { Activity, MousePointer2, Scroll, CheckCircle2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function PersonaTraceList({ isCollapsed }: { isCollapsed: boolean }) {
  const { analysis, selectedPersona, simulationResults } = useDashboard()
  const [activeLogs, setActiveLogs] = useState<Record<string, number>>({})

  // If no analysis, show nothing
  if (!analysis) return null

  const selectedPersonaData = analysis.personas.find(p => p.id === selectedPersona)
  const simulation = selectedPersona ? simulationResults.get(selectedPersona) : null
  
  // Use the interaction trace from metadata if available, otherwise fallback to simulation interactions
  const trace = simulation?.interactions.map(i => `${i.type}_${i.element.toLowerCase().replace(/\s+/g, '_')}`) || []

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 border-t border-white/5">
        <div className="w-8 h-8 rounded-full bg-emerald/10 border border-emerald/20 flex items-center justify-center animate-pulse">
           <Activity className="w-4 h-4 text-emerald" />
        </div>
      </div>
    )
  }

  return (
    <div className="px-3 py-4 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex items-center justify-between mb-4 px-1">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-emerald" />
          Live Identity Trace
        </h4>
        {selectedPersonaData && (
          <Badge variant="outline" className="bg-emerald/5 text-emerald border-emerald/20 text-[8px] h-4 leading-none uppercase font-black px-1.5">
             Active
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {selectedPersonaData ? (
          <div className="space-y-3">
             <div className="flex items-center gap-3 px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-ping" />
                <span className="text-[11px] font-bold text-foreground truncate">{selectedPersonaData.name}</span>
             </div>

             <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2 scrollbar-hide">
                {trace.length > 0 ? (
                  trace.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 150}ms` }}>
                       <div className="mt-1">
                          {step.includes('scroll') ? <Scroll className="w-3 h-3 text-cyan" /> :
                           step.includes('click') ? <MousePointer2 className="w-3 h-3 text-emerald" /> :
                           <Activity className="w-3 h-3 text-muted-foreground/40" />}
                       </div>
                       <div className="flex-1 space-y-0.5">
                          <p className="text-[10px] font-bold text-muted-foreground/80 lowercase tracking-tighter tabular-nums leading-none">
                             {step.replace(/_/g, ' ')}
                          </p>
                          <div className="w-full h-0.5 bg-white/[0.02] rounded-full overflow-hidden">
                             <div className="h-full bg-emerald/20 w-full animate-shimmer" />
                          </div>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center bg-white/[0.02] rounded-xl border border-dashed border-white/5">
                     <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">Awaiting Interaction...</p>
                  </div>
                )}
             </div>
             
             {simulation?.converted && (
               <div className="p-2.5 rounded-xl bg-emerald/5 border border-emerald/10 flex items-center gap-2.5 animate-in zoom-in-95">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald">Conversion Success</span>
               </div>
             )}
             
             {simulation && !simulation.converted && (
               <div className="p-2.5 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center gap-2.5 animate-in zoom-in-95">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-red-500">Drop-off: {simulation.dropOffPoint || 'Navigation'}</span>
               </div>
             )}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 italic">Select a persona to monitor control</p>
          </div>
        )}
      </div>
    </div>
  )
}
