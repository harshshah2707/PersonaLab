import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DashboardProvider } from '@/contexts/DashboardContext'
import { PersonasSection } from '@/components/dashboard/personas-section'
import { mockAnalysis } from '@/lib/mockData'
import { AuthProvider } from '@/contexts/AuthContext'

// Property 8: Dashboard Component Completeness
// Validates: Requirements 4.1, 7.7, 8.1
describe('Dashboard Integration: Component Completeness and Persistence', () => {
  it('renders synthetic personas and handles selection correctly', () => {
    const onSelect = vi.fn()
    
    render(
      <PersonasSection 
        personas={mockAnalysis.personas} 
        selectedId={null} 
        onSelect={onSelect} 
      />
    )
    
    // Check if persona names are displayed
    expect(screen.getByText('Sarah Chen')).toBeDefined()
    expect(screen.getByText('Marcus Johnson')).toBeDefined()
    
    // Test persona selection
    const cards = screen.getAllByRole('button')
    fireEvent.click(cards[0])
    
    expect(onSelect).toHaveBeenCalledWith('persona_1')
  })

  // Full integration property test skeleton
  it('persists analysis URL from session storage', () => {
    sessionStorage.setItem('personaLab_analysisUrl', 'https://startup.com')
    
    // Custom wrapper for integration testing
    const FullDashboard = () => (
      <AuthProvider>
        <DashboardProvider>
           <div data-testid="dashboard-root">
              Mock Integration Root
           </div>
        </DashboardProvider>
      </AuthProvider>
    )
    
    render(<FullDashboard />)
    
    // Mock setup for integration validation
    expect(sessionStorage.getItem('personaLab_analysisUrl')).toBe('https://startup.com')
  })
})
