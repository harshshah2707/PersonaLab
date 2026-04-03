"use client"

import { 
  DashboardHeader, 
  PersonasSection,
  PersonaJourneyPanel,
  AnalysisLoadingSkeleton
} from '@/components/dashboard'
import { useDashboard } from '@/contexts/DashboardContext'

export default function PersonasPage() {
  const { 
    analysis, 
    isAnalyzing, 
    selectedPersona,
    selectedPersonaData,
    getPersonaSimulation
  } = useDashboard()

  const simulationResult = selectedPersona ? getPersonaSimulation(selectedPersona) : null

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <DashboardHeader 
        title="User Personas" 
        subtitle="Synthetic Behavioral Archetypes"
        showPersonaBadge={!!selectedPersonaData}
        personaName={selectedPersonaData?.name}
      />

      {isAnalyzing ? (
        <AnalysisLoadingSkeleton />
      ) : analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
                <PersonasSection 
                    personas={analysis.personas}
                    selectedId={selectedPersona}
                    onSelect={() => {}} // Controlled globally
                />
            </div>
            
            <div className="lg:col-span-8">
                {selectedPersonaData && simulationResult ? (
                    <PersonaJourneyPanel
                        persona={selectedPersonaData}
                        simulationResult={simulationResult}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12 border border-white/5 bg-card/20 rounded-3xl text-center space-y-4">
                         <div className="w-16 h-16 rounded-full bg-emerald/10 border border-emerald/20 flex items-center justify-center animate-pulse">
                             <span className="text-emerald text-2xl font-black">?</span>
                         </div>
                         <div className="space-y-1">
                             <h3 className="text-lg font-bold">Select a Persona</h3>
                             <p className="text-sm text-muted-foreground/60">Choose an archetype from the left to explore their journey</p>
                         </div>
                    </div>
                )}
            </div>
        </div>
      ) : null}
    </div>
  )
}
