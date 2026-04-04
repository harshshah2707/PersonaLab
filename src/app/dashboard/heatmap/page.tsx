"use client"

import { 
  DashboardHeader, 
  HeatmapSection,
  FrictionPointsPanel,
  AnalysisLoadingSkeleton
} from '@/components/dashboard'
import { useDashboard } from '@/contexts/DashboardContext'

export default function HeatmapPage() {
  const { 
    analysis, 
    isAnalyzing, 
    selectedPersonaData,
    filteredHeatmapPoints,
    filteredFrictionPoints
  } = useDashboard()

  return (
    <div className="layout-container py-12 animate-in fade-in duration-1000">
      <DashboardHeader 
        title="Interaction Map" 
        showPersonaBadge={!!selectedPersonaData}
        personaName={selectedPersonaData?.name}
      />

      {isAnalyzing ? (
        <AnalysisLoadingSkeleton />
      ) : analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
                <HeatmapSection 
                    points={filteredHeatmapPoints}
                    highlightedPersona={selectedPersonaData?.name}
                />
            </div>
            
            <div className="lg:col-span-4">
                <FrictionPointsPanel points={filteredFrictionPoints} />
            </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6">
           <div className="w-16 h-16 rounded-[2rem] bg-coffee/5 border border-sand flex items-center justify-center text-coffee">
              <span className="text-2xl">🔥</span>
           </div>
           <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">No Interaction Map</h2>
              <p className="text-muted-foreground max-w-sm">Simulate your product's behavior to generate high-fidelity friction hotspots.</p>
           </div>
        </div>
      )}
    </div>
  )
}
