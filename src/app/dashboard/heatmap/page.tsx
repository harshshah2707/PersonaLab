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
    <div className="w-full px-4 sm:px-8 lg:px-12 py-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <DashboardHeader 
        title="Interaction Map" 
        subtitle="Visual Friction Hotspots"
        showPersonaBadge={!!selectedPersonaData}
        personaName={selectedPersonaData?.name}
      />

      {isAnalyzing ? (
        <AnalysisLoadingSkeleton />
      ) : analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
                <HeatmapSection 
                    points={filteredHeatmapPoints}
                    screenshotUrl={analysis.screenshotUrl}
                    highlightedPersona={selectedPersonaData?.name}
                />
            </div>
            
            <div className="lg:col-span-4">
                <FrictionPointsPanel points={filteredFrictionPoints} />
            </div>
        </div>
      ) : null}
    </div>
  )
}
