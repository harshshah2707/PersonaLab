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
    <div className="w-full px-4 sm:px-8 lg:px-12 py-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <DashboardHeader 
        title="Strategic Insights" 
        subtitle="AI-Powered Optimization Recommendations"
        showPersonaBadge={!!selectedPersonaData}
        personaName={selectedPersonaData?.name}
      />

      {isAnalyzing ? (
        <AnalysisLoadingSkeleton />
      ) : analysis ? (
        <div className="space-y-8">
            <MetricsRow 
                metrics={filteredMetrics || analysis.metrics} 
                isPersonaFiltered={!!selectedPersonaData}
                personaName={selectedPersonaData?.name}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <AIInsightsPanel insights={filteredInsights} />
            </div>
        </div>
      ) : null}
    </div>
  )
}
