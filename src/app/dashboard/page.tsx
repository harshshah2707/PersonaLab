"use client"

import { cn } from '@/lib/utils'
import { 
  DashboardHeader, 
  MetricsRow, 
  HeatmapSection, 
  PersonasSection,
  AIInsightsPanel,
  FrictionPointsPanel,
  AnalysisLoadingSkeleton,
  PersonaJourneyPanel,
  PipelineDiagnostics
} from '@/components/dashboard'
import { useDashboard } from '@/contexts/DashboardContext'
import { ErrorBoundary } from '@/components/common/error-boundary'

export default function OverviewPage() {
  const { 
    analysis, 
    isAnalyzing, 
    selectedId,
    selectedPersonaData,
    getPersonaSimulation,
    filteredMetrics,
    filteredHeatmapPoints,
    filteredInsights,
    filteredFrictionPoints,
    isSidebarCollapsed
  } = useDashboard()

  const simulationResult = selectedId ? getPersonaSimulation(selectedId) : null

  return (
    <ErrorBoundary>
      <div className="w-full px-4 sm:px-8 lg:px-12 py-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
        <DashboardHeader 
          title="SaaS Growth Analysis" 
          subtitle="Interaction Cluster"
          showPersonaBadge={!!selectedPersonaData}
          personaName={selectedPersonaData?.name}
        />

        {isAnalyzing ? (
          <AnalysisLoadingSkeleton />
        ) : analysis ? (
          <div className="space-y-6">
            {/* Metrics Row */}
            <MetricsRow 
              metrics={filteredMetrics || analysis.metrics} 
              isPersonaFiltered={!!selectedPersonaData}
              personaName={selectedPersonaData?.name}
            />
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Heatmap and Personas (2 cols) */}
              <div className="lg:col-span-2 space-y-6 text-foreground">
                <HeatmapSection 
                  points={filteredHeatmapPoints}
                  highlightedPersona={selectedPersonaData?.name}
                />
                <PersonasSection 
                  personas={analysis.personas}
                  selectedId={selectedId}
                  onSelect={(id) => {
                     // The selection is now managed globally in DashboardContext
                  }}
                />
              </div>

              {/* Right Column - Insights and Journey (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                {selectedPersonaData && simulationResult ? (
                  <PersonaJourneyPanel
                    persona={selectedPersonaData}
                    simulationResult={simulationResult}
                  />
                ) : null}
                <AIInsightsPanel insights={filteredInsights} />
                <FrictionPointsPanel points={filteredFrictionPoints} />
              </div>
            </div>
            
            <PipelineDiagnostics />
          </div>
        ) : (
          <div className="flex items-center justify-center h-[50vh] text-muted-foreground opacity-50">
             Enter a URL on the landing page to begin your analysis.
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}