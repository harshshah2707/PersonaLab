"use client"

import { 
  DashboardHeader, 
  AIInsightsPanel,
  AnalysisLoadingSkeleton,
  MetricsRow
} from '@/components/dashboard'
import { useDashboard } from '@/contexts/DashboardContext'

export default function InsightsPage() {
  const { 
    analysis, 
    isAnalyzing, 
    selectedPersonaData,
    filteredInsights,
    filteredMetrics
  } = useDashboard()

  return (
    <div className="layout-container py-12 animate-in fade-in duration-1000">
      <DashboardHeader 
        title="Strategic Insights" 
        showPersonaBadge={!!selectedPersonaData}
        personaName={selectedPersonaData?.name}
      />

      {isAnalyzing ? (
        <AnalysisLoadingSkeleton />
      ) : analysis ? (
        <div className="space-y-12">
            <MetricsRow 
                metrics={filteredMetrics || analysis.metrics} 
                isPersonaFiltered={!!selectedPersonaData}
                personaName={selectedPersonaData?.name}
            />
            
            <div className="grid grid-cols-1 gap-12">
                <AIInsightsPanel insights={filteredInsights} />
            </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6">
           <div className="w-16 h-16 rounded-[2rem] bg-coffee/5 border border-sand flex items-center justify-center text-coffee">
              <span className="text-2xl">💡</span>
           </div>
           <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">No Insights Available</h2>
              <p className="text-muted-foreground max-w-sm">Enter a URL on the home page to start your neural audit and generate strategic insights.</p>
           </div>
        </div>
      )}
    </div>
  )
}
