"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navbar } from '@/components/ui/navbar'
import { 
  Sidebar, 
  DashboardHeader, 
  MetricsRow, 
  HeatmapSection, 
  PersonasSection,
  InsightsPanel,
  FrictionPointsPanel,
  AnalysisLoadingSkeleton
} from '@/components/dashboard'
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext'

function DashboardContent() {
  const { user } = useAuth()
  const { analysis, isAnalyzing, selectedPersona, setSelectedPersona, analysisUrl } = useDashboard()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="pl-0 lg:pl-64 pt-14 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <DashboardHeader 
            title="Dashboard" 
            subtitle="Analysis of"
          />

          {isAnalyzing ? (
            <AnalysisLoadingSkeleton />
          ) : analysis ? (
            <>
              <MetricsRow metrics={analysis.metrics} />
              
              <div className="grid lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2 space-y-6">
                  <HeatmapSection points={analysis.heatmapPoints} />
                  <PersonasSection 
                    personas={analysis.personas}
                    selectedId={selectedPersona}
                    onSelect={setSelectedPersona}
                  />
                </div>

                <div className="space-y-6">
                  <InsightsPanel insights={analysis.insights} />
                  <FrictionPointsPanel points={analysis.frictionPoints} />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>
    </ProtectedRoute>
  )
}