"use client"

import { RefreshCw, Download, Globe, Share2, Calendar, AlertCircle } from 'lucide-react'
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

export function DashboardHeader({ title, showPersonaBadge, personaName }: DashboardHeaderProps) {
  const { refreshAnalysis, isAnalyzing, isRefreshing, analysisUrl, lastUpdated } = useDashboard()

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never'
    const now = new Date()
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return `${Math.floor(diff / 3600)}h ago`
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-sand/40">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
           <div className="p-2 rounded-xl bg-coffee/5 border border-sand hidden sm:block">
             <Globe className="w-4 h-4 text-coffee/20" />
           </div>
           <div className="space-y-0.5">
             <div className="flex items-center gap-2.5 flex-wrap">
               <h1 className="text-xl md:text-2xl font-bold tracking-tight text-coffee">{title}</h1>
               {showPersonaBadge && personaName && (
                 <Badge variant="outline" className="bg-terracotta/5 text-terracotta border-terracotta/10 px-2 py-0 h-5 gap-1 animate-in zoom-in-95">
                   <div className="w-1 h-1 rounded-full bg-current" />
                   <span className="text-[9px] font-black uppercase tracking-wider">{personaName} Mode</span>
                 </Badge>
               )}
             </div>
             {analysisUrl && (
                <div className="flex items-center gap-2 text-[10px] font-bold text-coffee/30 overflow-hidden">
                  <span className="uppercase tracking-[0.2em] shrink-0">Node:</span>
                  <span className="hover:text-terracotta cursor-pointer transition-all truncate max-w-[200px] sm:max-w-md font-medium">{analysisUrl}</span>
                </div>
              )}
           </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-coffee/10 px-4 py-1.5 border border-sand/40 rounded-full bg-cream/20">
          <Calendar className="w-3 h-3" />
          <span>Synced {formatLastUpdated()}</span>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshAnalysis}
            disabled={isAnalyzing || isRefreshing}
            className="h-9 px-4 rounded-xl border-sand bg-white text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-cream"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
            {isRefreshing ? 'Syncing...' : 'Re-run'}
          </Button>

          <Button size="sm" className="h-9 px-5 rounded-xl bg-coffee text-white hover:bg-coffee/90 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-coffee/10 gap-2">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}