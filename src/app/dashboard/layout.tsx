"use client"

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navbar } from '@/components/ui/navbar'
import { Sidebar } from '@/components/dashboard'
import { PersonaChat } from '@/components/dashboard/persona-chat'
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext'
import { cn } from '@/lib/utils'

function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed, chattingWithPersonaId, setChattingWithPersonaId, analysis } = useDashboard()
  
  const chattingPersona = analysis?.personas.find((p: any) => p.id === chattingWithPersonaId)

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <Navbar />
      <Sidebar />
      
      <main className={cn(
        "pt-16 min-h-screen relative z-10 transition-all duration-500 ease-in-out",
        isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
      )}>
        {children}
      </main>

      {/* Floating Persona Chat */}
      {chattingPersona && (
        <div className="fixed bottom-6 right-6 z-[100] w-full max-w-[400px] animate-in slide-in-from-right-10 duration-500">
             <PersonaChat 
                persona={chattingPersona} 
                onClose={() => setChattingWithPersonaId(null)}
             />
        </div>
      )}
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <DashboardProvider>
        <DashboardLayoutWrapper>
          {children}
        </DashboardLayoutWrapper>
      </DashboardProvider>
    </ProtectedRoute>
  )
}
