"use client"

import React, { useMemo } from 'react'
import { Terminal, Globe, MousePointer2, Fingerprint, Search, Cpu, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/contexts/DashboardContext'
import { Badge } from '@/components/ui/badge'

interface LogEntry {
  id: string
  action: string
  target: string
  status: 'complete' | 'active' | 'pending'
  timestamp: string
  type: 'navigation' | 'interaction' | 'analysis' | 'network'
}

export function BrowserAutomationLog() {
  const { isAnalyzing, analysisUrl, analysis } = useDashboard()

  const logs: LogEntry[] = useMemo(() => {
    if (isAnalyzing) {
      return [
        { id: '1', action: 'INITIATING', target: 'Headless-Chromium-v121', status: 'complete', timestamp: '0.0s', type: 'network' },
        { id: '2', action: 'RESOLVING', target: analysisUrl || 'Target Node', status: 'complete', timestamp: '0.4s', type: 'navigation' },
        { id: '3', action: 'NAVIGATING', target: 'Initial Viewport (1280x800)', status: 'active', timestamp: '1.2s', type: 'navigation' },
        { id: '4', action: 'SCRAPING', target: 'DOM Tree Extraction', status: 'pending', timestamp: '--', type: 'analysis' },
        { id: '5', action: 'IDENTIFYING', target: 'Interactive Selectors', status: 'pending', timestamp: '--', type: 'interaction' },
      ]
    }

    if (analysis) {
       return [
        { id: '1', action: 'RESOLVED', target: analysis.url, status: 'complete', timestamp: '0.4s', type: 'navigation' },
        { id: '2', action: 'EXTRACTED', target: '64 DOM Nodes', status: 'complete', timestamp: '1.8s', type: 'analysis' },
        { id: '3', action: 'MAPPED', target: '12 Interactive Clusters', status: 'complete', timestamp: '2.5s', type: 'interaction' },
        { id: '4', action: 'SNAPSHOT', target: 'High-Res Viewport Captured', status: 'complete', timestamp: '3.1s', type: 'analysis' },
        { id: '5', action: 'NEURAL-INIT', target: 'Ready for Persona Seeding', status: 'complete', timestamp: '3.8s', type: 'network' },
      ]
    }

    return []
  }, [isAnalyzing, analysisUrl, analysis])

  return (
    <div className="space-y-4 px-4 py-4 border-t border-border/40 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 flex items-center gap-2">
          <Terminal className="w-3 h-3 text-accent" />
          Browser Control
        </h4>
        <Badge variant="outline" className="text-[8px] h-4 leading-none opacity-40 rounded-full">LIVE LOG</Badge>
      </div>

      <div className="space-y-2 font-mono text-[9px] max-h-[200px] overflow-y-auto scrollbar-neutral transition-all">
        {logs.length > 0 ? (
          logs.map((log) => (
            <div key={log.id} className="group flex items-start gap-4 transition-all hover:bg-secondary/20 p-2 rounded-lg border border-transparent hover:border-border/10">
               <span className="text-foreground/20 w-8 tabular-nums shrink-0">{log.timestamp}</span>
               
               <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md",
                      log.status === 'complete' ? "text-emerald-500 bg-emerald-500/5" : 
                      log.status === 'active' ? "text-accent bg-accent/5 animate-pulse" : 
                      "text-foreground/10"
                    )}>
                      {log.action}
                    </span>
                    <span className="text-foreground/40 font-bold truncate">» {log.target}</span>
                  </div>
                  
                  {log.status === 'active' && (
                    <div className="w-full h-[1px] bg-secondary rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-accent w-1/2 animate-shimmer" />
                    </div>
                  )}
               </div>

               <div className="shrink-0 flex items-center gap-1.5 opacity-20 group-hover:opacity-100 transition-opacity">
                  {log.type === 'navigation' && <Globe className="w-3 h-3" />}
                  {log.type === 'interaction' && <MousePointer2 className="w-3 h-3" />}
                  {log.type === 'analysis' && <Cpu className="w-3 h-3" />}
                  {log.status === 'complete' ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : log.status === 'active' && <Loader2 className="w-3 h-3 animate-spin" />}
               </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center border border-dashed border-border rounded-3xl bg-secondary/10">
             <p className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/10 italic">Awaiting Link...</p>
          </div>
        )}
      </div>
      
      {/* Simulation Meta Substrate */}
      <div className="p-3 rounded-2xl bg-secondary/30 border border-border flex items-center justify-between gap-4">
         <div className="flex items-center gap-2">
            <Fingerprint className="w-3.5 h-3.5 text-foreground/40" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40">Entropy Check</span>
         </div>
         <span className="text-[9px] font-mono text-emerald-500">OAT_SECURE_VAL</span>
      </div>
    </div>
  )
}
