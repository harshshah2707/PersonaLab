"use client"

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navbar } from '@/components/ui/navbar'
import { Sidebar } from '@/components/dashboard'
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext'
import { cn } from '@/lib/utils'

function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useDashboard()
  
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
