"use client"

import { RefreshCw, Download, Filter, Calendar, AlertCircle, User, Globe, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDashboard } from '@/contexts/DashboardContext'
import { cn } from '@/lib/utils'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  showPersonaBadge?: boolean
  personaName?: string | null
}

export function DashboardHeader({ title, subtitle, showPersonaBadge, personaName }: DashboardHeaderProps) {
  const { refreshAnalysis, isAnalyzing, isRefreshing, analysisUrl, lastUpdated, isDataStale, updateError, clearError } = useDashboard()

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never'
    const now = new Date()
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return `${Math.floor(diff / 3600)}h ago`
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 pb-8 border-b border-white/5">
      <div className="space-y-4 overflow-hidden">
        <div className="flex items-center gap-3">
           <div className="p-2.5 rounded-xl bg-violet/10 border border-violet/20 hidden sm:block shadow-lg shadow-violet/5">
             <Globe className="w-5 h-5 text-violet" />
           </div>
           <div className="space-y-1 overflow-hidden">
             <div className="flex items-center gap-3 flex-wrap">
               <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
               {showPersonaBadge && personaName && (
                 <Badge variant="outline" className="bg-emerald/10 text-emerald border-emerald/20 px-3 py-0.5 gap-1.5 animate-in zoom-in-95">
                   <User className="h-3 w-3" />
                   <span className="text-[10px] font-black uppercase tracking-wider">{personaName} View</span>
                 </Badge>
               )}
             </div>
             {analysisUrl && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground overflow-hidden">
                  <span className="font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest shrink-0">Active URL</span>
                  <span className="text-emerald hover:underline cursor-pointer transition-all truncate max-w-[150px] sm:max-w-md font-medium">{analysisUrl}</span>
                </div>
              )}
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2 text-muted-foreground/40">
            <Calendar className="w-3.5 h-3.5" />
            <span>Updated {formatLastUpdated()}</span>
          </div>
          {isDataStale && (
            <div className="flex items-center gap-2 text-amber-500 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Stale Detection</span>
            </div>
          )}
          {updateError && (
             <button onClick={clearError} className="flex items-center gap-2 text-red-500 hover:scale-105 transition-transform active:scale-95">
               <AlertCircle className="w-3.5 h-3.5" />
               <span>Sync Error — Click to Reset</span>
             </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex p-1 rounded-xl bg-white/[0.03] border border-white/5 shadow-inner">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={refreshAnalysis}
            disabled={isAnalyzing || isRefreshing}
            className="h-9 px-4 rounded-lg hover:bg-white/5 text-[10px] font-black uppercase tracking-wider gap-2 transition-all active:scale-95"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
            {isRefreshing ? 'Syncing...' : 'Re-run Analysis'}
          </Button>
          
          <div className="w-px h-4 bg-white/10 self-center mx-1" />

          <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg hover:bg-white/5 text-[10px] font-black uppercase tracking-wider gap-2 transition-all active:scale-95">
            <Download className="h-3.5 w-3.5" />
            Report
          </Button>
        </div>

        <Button size="sm" className="h-11 px-6 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-black text-xs uppercase tracking-widest shadow-2xl shadow-white/5 gap-2 transition-all active:scale-95">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  )
}