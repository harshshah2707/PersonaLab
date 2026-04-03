"use client"

import { useState } from 'react'

export function PipelineDiagnostics() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])

  const runDiagnostics = async () => {
    setStatus('running')
    setLogs([])
    addLog('Starting PersonaLab AI Pipeline Diagnostics...')
    
    try {
      addLog('Verifying API connectivity...')
      const start = Date.now()
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: 'https://example.com',
          user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          project_id: '123e4567-e89b-12d3-a456-426614174000',
          mock_mode: false
        })
      })
      
      if (!response.ok) {
        throw new Error(`API failed with status ${response.status}: ${response.statusText}`)
      }

      const duration = ((Date.now() - start) / 1000).toFixed(2)
      addLog(`Pipeline returned success in ${duration}s`)
      
      const data = await response.json()
      
      if (data.personas && data.personas.length > 0) {
        addLog(`Verified AI Output: Found ${data.personas.length} synthetic personas`)
        addLog(`Verified Analysis: Engagement Score ${data.engagement_score}%`)
        setStatus('success')
      } else {
        throw new Error('Pipeline returned successfully but contained no AI results')
      }
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`)
      setStatus('error')
    }
  }

  return (
    <div className="mt-8 p-6 glass-card border-red-500/20 bg-red-500/5 rounded-3xl space-y-4">
      <div className="flex items-center justify-between">
         <div>
            <h3 className="text-lg font-black uppercase tracking-tight">AI Engine Diagnostics</h3>
            <p className="text-sm text-muted-foreground">Verify the full Playwright + Gemini + Supabase stack</p>
         </div>
         <button 
           onClick={runDiagnostics}
           disabled={status === 'running'}
           className="px-6 py-2 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
         >
           {status === 'running' ? 'Running...' : 'Run Verification'}
         </button>
      </div>

      <div className="bg-black/20 rounded-2xl p-4 font-mono text-[10px] space-y-1 max-h-[300px] overflow-y-auto border border-white/5">
        {logs.length === 0 && <span className="text-muted-foreground/40 italic">Waiting for verification blast...</span>}
        {logs.map((log, i) => (
          <div key={i} className={cn(
            log.includes('ERROR') ? 'text-red-400' : 
            log.includes('success') ? 'text-emerald-400' : 'text-foreground/80'
          )}>
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
