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
    selectedPersona,
    selectedPersonaData,
    getPersonaSimulation,
    filteredMetrics,
    filteredHeatmapPoints,
    filteredInsights,
    filteredFrictionPoints
  } = useDashboard()

  const simulationResult = selectedPersona ? getPersonaSimulation(selectedPersona) : null

  return (
    <ErrorBoundary>
      <div className="layout-container py-6 md:py-8 animate-in fade-in duration-1000">
        <div className="mb-8">
          <DashboardHeader 
            title="SaaS Growth Analysis" 
            showPersonaBadge={!!selectedPersonaData}
            personaName={selectedPersonaData?.name}
          />
        </div>

        {isAnalyzing ? (
          <AnalysisLoadingSkeleton />
        ) : analysis ? (
          <div className="space-y-8">
            <MetricsRow 
              metrics={filteredMetrics || analysis.metrics} 
              isPersonaFiltered={!!selectedPersonaData}
              personaName={selectedPersonaData?.name}
            />
            
            {/* Main Content Grid - High Fidelity Distribution */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8 items-start">
              {/* Left Column - Qualitative Insights (Heatmap + Secondary context) */}
              <div className="xl:col-span-7 space-y-6 md:space-y-8">
                <HeatmapSection 
                  points={filteredHeatmapPoints}
                  screenshotUrl={analysis.screenshotUrl}
                  highlightedPersona={selectedPersonaData?.name}
                />
                
                {/* Secondary Diagnostics - Custom Stacking Order 🚀 🏁🌟 */}
                <div className="flex flex-col gap-6 md:gap-8">
                   <PersonasSection 
                     personas={analysis.personas}
                     selectedId={selectedPersona}
                     onSelect={() => {}}
                   />
                   <FrictionPointsPanel points={filteredFrictionPoints} />
                </div>
              </div>

              {/* Right Column - Simulation & AI Dynamics */}
              <div className="xl:col-span-5 space-y-6 md:space-y-8">
                {selectedPersonaData && simulationResult ? (
                  <PersonaJourneyPanel
                    persona={selectedPersonaData}
                    simulationResult={simulationResult}
                  />
                ) : (
                  <div className="p-8 rounded-3xl bg-secondary/10 border border-border border-dashed flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/40 flex items-center justify-center text-foreground/40">
                      <span className="text-xl font-bold">?</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em]">Identity Hub</p>
                      <h4 className="text-lg font-bold text-foreground">Select Research Profile</h4>
                      <p className="text-[11px] text-foreground/40 max-w-[28ch] mx-auto leading-relaxed italic">Choose an analytical archetype from the laboratory board to visualize their simulated path.</p>
                    </div>
                  </div>
                )}
                <AIInsightsPanel insights={filteredInsights} />
              </div>
            </div>
            
            {/* Laboratory Substrate */}
            <div className="layout-container max-w-4xl opacity-20 pt-10 border-t border-border/30 grayscale">
              <PipelineDiagnostics />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6">
             <div className="w-16 h-16 rounded-3xl bg-secondary/5 border border-border flex items-center justify-center text-foreground">
                <span className="text-2xl">☕</span>
             </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Environmental Scan Awaiting</h2>
                <p className="text-muted-foreground/60 max-w-sm text-sm">
                  The laboratory is ready. Enter a URL on the home base to start your behavioral simulation audit.
                </p>
             </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}