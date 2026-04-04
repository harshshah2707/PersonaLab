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
    <div className="layout-container py-12 animate-in fade-in duration-1000">
      <DashboardHeader 
        title="Analytical Personas" 
        showPersonaBadge={!!selectedPersonaData}
        personaName={selectedPersonaData?.name}
      />

      {isAnalyzing ? (
        <AnalysisLoadingSkeleton />
      ) : analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
                <PersonasSection 
                    personas={analysis.personas}
                    selectedId={selectedPersona}
                    onSelect={() => {}} // Globally state controlled
                />
            </div>
            
            <div className="lg:col-span-8">
                {selectedPersonaData && simulationResult ? (
                    <PersonaJourneyPanel
                        persona={selectedPersonaData}
                        simulationResult={simulationResult}
                    />
                ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 paper-panel border-dashed bg-cream/30 text-center space-y-6">
                         <div className="w-16 h-16 rounded-[2rem] bg-white border border-sand flex items-center justify-center text-coffee shadow-sm">
                             <span className="text-xl font-bold">?</span>
                         </div>
                         <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee/30">Laboratory Identity Needed</p>
                             <h3 className="text-2xl font-bold tracking-tighter text-coffee">Select a Persona Profile</h3>
                             <p className="text-[13px] text-coffee/40 max-w-xs mx-auto leading-relaxed">Choose an archetype from the laboratory team to explore their high-fidelity journey neural trace.</p>
                         </div>
                    </div>
                )}
            </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6">
           <div className="w-16 h-16 rounded-[2rem] bg-coffee/5 border border-sand flex items-center justify-center text-coffee">
              <span className="text-2xl">👥</span>
           </div>
           <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">No Profiling Data</h2>
              <p className="text-muted-foreground max-w-sm">Simulate your product to observe your behavioral archetypes in action.</p>
           </div>
        </div>
      )}
    </div>
  )
}
