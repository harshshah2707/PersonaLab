import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AIInsightsPanel } from './insights-panel'
import type { AIInsight } from '@/types'

const mockInsights: AIInsight[] = [
  {
    id: 'insight_1',
    title: 'CTA lacks visual hierarchy',
    description: 'Primary call-to-action blends with secondary actions',
    priority: 'high',
    category: 'design',
    recommendation: 'Use contrasting colors for primary CTA.',
    impact: {
      level: 'high',
      estimatedImprovement: '+23% CTR improvement',
      confidence: 0.85
    },
    evidence: [
      {
        type: 'heatmap',
        data: { x: 45, y: 35, intensity: 0.9 },
        description: 'Heatmap shows 90% intensity on CTA area'
      }
    ],
    implementationStatus: 'pending',
    statusHistory: [{ status: 'pending', changedAt: new Date() }],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'insight_2',
    title: 'Navigation creates decision fatigue',
    description: 'Users encounter 7 navigation options before reaching pricing',
    priority: 'high',
    category: 'navigation',
    recommendation: 'Reduce main navigation to 5 items or less.',
    impact: {
      level: 'high',
      estimatedImprovement: '+15% reduction in bounce rate',
      confidence: 0.78
    },
    evidence: [
      {
        type: 'metric',
        data: { name: 'dropOffRisk', value: 'high' },
        description: 'Drop-off risk is high due to navigation complexity'
      }
    ],
    implementationStatus: 'pending',
    statusHistory: [{ status: 'pending', changedAt: new Date() }],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'insight_3',
    title: 'Pricing visibility is delayed',
    description: 'Users must scroll past 3 sections before seeing pricing',
    priority: 'medium',
    category: 'conversion',
    recommendation: 'Add pricing link to main navigation.',
    impact: {
      level: 'medium',
      estimatedImprovement: '+18% pricing page visits',
      confidence: 0.72
    },
    evidence: [
      {
        type: 'metric',
        data: { name: 'engagement', value: 65 },
        description: 'Current engagement score suggests pricing discoverability issues'
      }
    ],
    implementationStatus: 'pending',
    statusHistory: [{ status: 'pending', changedAt: new Date() }],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'insight_4',
    title: 'Hero section unclear value proposition',
    description: 'Headline does not communicate core benefit',
    priority: 'medium',
    category: 'content',
    recommendation: 'Craft a clear, benefit-focused headline.',
    impact: {
      level: 'medium',
      estimatedImprovement: '+12% engagement improvement',
      confidence: 0.68
    },
    evidence: [
      {
        type: 'heatmap',
        data: { x: 50, y: 25, intensity: 0.4 },
        description: 'Low 40% intensity on hero section indicates disengagement'
      }
    ],
    implementationStatus: 'pending',
    statusHistory: [{ status: 'pending', changedAt: new Date() }],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'insight_5',
    title: 'Color contrast issues on footer',
    description: 'Footer text has insufficient contrast ratio',
    priority: 'low',
    category: 'design',
    recommendation: 'Increase text contrast in footer section.',
    impact: {
      level: 'low',
      estimatedImprovement: '+5% accessibility improvement',
      confidence: 0.65
    },
    evidence: [
      {
        type: 'metric',
        data: { name: 'uxScore', value: 72 },
        description: 'UX score indicates accessibility could be improved'
      }
    ],
    implementationStatus: 'pending',
    statusHistory: [{ status: 'pending', changedAt: new Date() }],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

describe('AIInsightsPanel', () => {
  it('renders all insights by default', () => {
    render(<AIInsightsPanel insights={mockInsights} />)
    
    expect(screen.getByText('AI Insights')).toBeInTheDocument()
    expect(screen.getByText('CTA lacks visual hierarchy')).toBeInTheDocument()
    expect(screen.getByText('Navigation creates decision fatigue')).toBeInTheDocument()
    expect(screen.getByText('Pricing visibility is delayed')).toBeInTheDocument()
    expect(screen.getByText('Hero section unclear value proposition')).toBeInTheDocument()
    expect(screen.getByText('Color contrast issues on footer')).toBeInTheDocument()
  })

  it('filters insights by priority', () => {
    render(<AIInsightsPanel insights={mockInsights} initialPriority="high" />)
    
    expect(screen.getByText('CTA lacks visual hierarchy')).toBeInTheDocument()
    expect(screen.getByText('Navigation creates decision fatigue')).toBeInTheDocument()
    expect(screen.queryByText('Pricing visibility is delayed')).not.toBeInTheDocument()
  })

  it('filters insights by category', () => {
    render(<AIInsightsPanel insights={mockInsights} initialCategory="design" />)
    
    expect(screen.getByText('CTA lacks visual hierarchy')).toBeInTheDocument()
    expect(screen.getByText('Color contrast issues on footer')).toBeInTheDocument()
    expect(screen.queryByText('Navigation creates decision fatigue')).not.toBeInTheDocument()
  })

  it('expands insight on click', () => {
    render(<AIInsightsPanel insights={mockInsights} />)
    
    // Click on the first insight card header
    const firstInsightHeader = screen.getByText('CTA lacks visual hierarchy').closest('div')?.parentElement
    fireEvent.click(firstInsightHeader!)
    
    expect(screen.getByText('Actionable Next Steps')).toBeInTheDocument()
    expect(screen.getByText(/Implement/)).toBeInTheDocument()
  })

  it('calls onPriorityFilter when priority changes', () => {
    const onPriorityFilter = vi.fn()
    render(<AIInsightsPanel insights={mockInsights} onPriorityFilter={onPriorityFilter} />)
    
    const mediumButton = screen.getByRole('button', { name: /Medium/i })
    fireEvent.click(mediumButton)
    
    expect(onPriorityFilter).toHaveBeenCalledWith('medium')
  })

  it('calls onCategoryFilter when category changes', () => {
    const onCategoryFilter = vi.fn()
    render(<AIInsightsPanel insights={mockInsights} onCategoryFilter={onCategoryFilter} />)
    
    const contentButton = screen.getByRole('button', { name: /Content/i })
    fireEvent.click(contentButton)
    
    expect(onCategoryFilter).toHaveBeenCalledWith('content')
  })

  it('calls onInsightAction when action button is clicked', () => {
    const onInsightAction = vi.fn()
    render(<AIInsightsPanel insights={mockInsights} onInsightAction={onInsightAction} />)
    
    // Expand the first insight
    const firstInsightHeader = screen.getByText('CTA lacks visual hierarchy').closest('div')?.parentElement
    fireEvent.click(firstInsightHeader!)
    
    // Click implement button
    const implementButton = screen.getByRole('button', { name: /Implement/i })
    fireEvent.click(implementButton)
    
    expect(onInsightAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'insight_1' }),
      'implement'
    )
  })

  it('shows empty state when no insights match filters', () => {
    const filteredInsights = mockInsights.filter(i => i.priority === 'high' && i.category === 'content')
    render(<AIInsightsPanel insights={filteredInsights} initialPriority="high" initialCategory="content" />)
    
    expect(screen.getByText('No insights match the current filters')).toBeInTheDocument()
  })

  it('displays priority badges with correct styling', () => {
    render(<AIInsightsPanel insights={mockInsights} />)
    
    const highBadges = screen.getAllByText('high')
    expect(highBadges).toHaveLength(2)
    
    const mediumBadges = screen.getAllByText('medium')
    expect(mediumBadges).toHaveLength(2)
    
    const lowBadges = screen.getAllByText('low')
    expect(lowBadges).toHaveLength(1)
  })

  it('displays category badges with correct labels', () => {
    render(<AIInsightsPanel insights={mockInsights} />)
    
    // Use getAllBy for category badges since they appear multiple times
    const designBadges = screen.getAllByText('Design')
    expect(designBadges.length).toBeGreaterThanOrEqual(1)
    
    const navigationBadges = screen.getAllByText('Navigation')
    expect(navigationBadges.length).toBeGreaterThanOrEqual(1)
    
    const conversionBadges = screen.getAllByText('Conversion')
    expect(conversionBadges.length).toBeGreaterThanOrEqual(1)
    
    const contentBadges = screen.getAllByText('Content')
    expect(contentBadges.length).toBeGreaterThanOrEqual(1)
  })

  it('shows impact indicator for each insight', () => {
    render(<AIInsightsPanel insights={mockInsights} />)
    
    // Use getAllBy for impact indicators since they appear for each insight
    const impactIndicators = screen.getAllByText('Impact:')
    expect(impactIndicators.length).toBe(mockInsights.length)
  })

  it('collapses insight when clicking expanded item', () => {
    render(<AIInsightsPanel insights={mockInsights} />)
    
    // Click to expand
    const firstInsightHeader = screen.getByText('CTA lacks visual hierarchy').closest('div')?.parentElement
    fireEvent.click(firstInsightHeader!)
    
    expect(screen.getByText('Actionable Next Steps')).toBeInTheDocument()
    
    // Click again to collapse
    fireEvent.click(firstInsightHeader!)
    expect(screen.queryByText('Actionable Next Steps')).not.toBeInTheDocument()
  })

  it('displays high priority insights with red styling', () => {
    render(<AIInsightsPanel insights={mockInsights} />)
    
    // High priority insights should have red-related styling (verified by border-l-red-500 class)
    const highPriorityInsight = screen.getByText('CTA lacks visual hierarchy').closest('[class*="rounded-lg"]')
    expect(highPriorityInsight).toHaveClass('border-red-500')
  })

  it('displays medium priority insights with yellow styling', () => {
    render(<AIInsightsPanel insights={mockInsights} />)
    
    // Medium priority insights should have yellow-related styling
    const mediumPriorityInsight = screen.getByText('Pricing visibility is delayed').closest('[class*="rounded-lg"]')
    expect(mediumPriorityInsight).toHaveClass('border-yellow-500')
  })

  it('displays low priority insights with muted styling', () => {
    render(<AIInsightsPanel insights={mockInsights} />)
    
    // Low priority insights should have muted styling
    const lowPriorityInsight = screen.getByText('Color contrast issues on footer').closest('[class*="rounded-lg"]')
    expect(lowPriorityInsight).toHaveClass('border-muted')
  })

  it('shows actionable steps for navigation category', () => {
    render(<AIInsightsPanel insights={mockInsights} />)
    
    // Expand navigation insight
    const navHeader = screen.getByText('Navigation creates decision fatigue').closest('div')?.parentElement
    fireEvent.click(navHeader!)
    
    expect(screen.getByText('Audit current navigation structure')).toBeInTheDocument()
  })

  it('shows actionable steps for conversion category', () => {
    render(<AIInsightsPanel insights={mockInsights} />)
    
    // Expand conversion insight
    const convHeader = screen.getByText('Pricing visibility is delayed').closest('div')?.parentElement
    fireEvent.click(convHeader!)
    
    expect(screen.getByText('Identify friction points in funnel')).toBeInTheDocument()
  })
})