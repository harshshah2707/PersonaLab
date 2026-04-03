import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PersonaCards, type PersonaFilters } from './persona-cards'
import { PersonaCard } from './persona-card'
import type { PersonaProfile } from '@/types'

const mockPersonas: PersonaProfile[] = [
  {
    id: 'persona_1',
    name: 'Sarah Chen',
    role: 'Startup Founder',
    goal: 'Evaluate pricing plans quickly',
    painPoints: [
      'Pricing not immediately visible',
      'Feature comparison unclear',
      'No social proof on pricing page'
    ],
    motivations: ['Cost efficiency', 'Quick setup', 'Scalability'],
    quote: 'I just wanted to know how much it costs.',
    conversionLikelihood: 0.72,
    behaviorPattern: {
      browsingStyle: 'scanner',
      decisionSpeed: 'fast',
      riskTolerance: 0.6,
      priceSensitivity: 0.8
    },
    demographics: {
      age: 32,
      gender: 'female',
      location: 'San Francisco',
      techSavviness: 85
    }
  },
  {
    id: 'persona_2',
    name: 'Marcus Johnson',
    role: 'Product Manager',
    goal: 'Understand integration capabilities',
    painPoints: [
      'API documentation hard to find',
      'Integration steps not step-by-step'
    ],
    motivations: ['Integration ease', 'Developer experience'],
    quote: 'I need to show my engineering team the path.',
    conversionLikelihood: 0.65,
    behaviorPattern: {
      browsingStyle: 'reader',
      decisionSpeed: 'moderate',
      riskTolerance: 0.5,
      priceSensitivity: 0.6
    },
    demographics: {
      age: 38,
      gender: 'male',
      location: 'New York',
      techSavviness: 72
    }
  },
  {
    id: 'persona_3',
    name: 'Emily Rodriguez',
    role: 'Developer',
    goal: 'Check technical specifications',
    painPoints: [
      'No dark mode toggle',
      'Documentation search not working'
    ],
    motivations: ['Performance', 'Clean API'],
    quote: 'I tried searching but got zero results.',
    conversionLikelihood: 0.58,
    behaviorPattern: {
      browsingStyle: 'explorer',
      decisionSpeed: 'deliberate',
      riskTolerance: 0.7,
      priceSensitivity: 0.4
    },
    demographics: {
      age: 27,
      gender: 'female',
      location: 'Austin',
      techSavviness: 95
    }
  }
]

describe('PersonaCards', () => {
  const defaultProps = {
    personas: mockPersonas,
    selectedPersona: undefined as string | undefined,
    onPersonaSelect: vi.fn()
  }

  it('renders all personas in a grid layout', () => {
    render(<PersonaCards {...defaultProps} />)
    
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument()
    expect(screen.getByText('Marcus Johnson')).toBeInTheDocument()
    expect(screen.getByText('Emily Rodriguez')).toBeInTheDocument()
  })

  it('displays persona count badge', () => {
    render(<PersonaCards {...defaultProps} />)
    
    expect(screen.getByText('3/3')).toBeInTheDocument()
  })

  it('calls onPersonaSelect when a persona card is clicked', () => {
    const onPersonaSelect = vi.fn()
    render(<PersonaCards {...defaultProps} onPersonaSelect={onPersonaSelect} />)
    
    fireEvent.click(screen.getByText('Sarah Chen'))
    expect(onPersonaSelect).toHaveBeenCalledWith('persona_1')
  })

  it('highlights selected persona', () => {
    render(<PersonaCards {...defaultProps} selectedPersona="persona_1" />)
    
    const sarahCard = screen.getByText('Sarah Chen').closest('[class*="ring"]')
    expect(sarahCard).toHaveClass('ring-2', 'ring-primary', 'border-primary')
  })

  it('shows filter panel when filter button is clicked', () => {
    render(<PersonaCards {...defaultProps} />)
    
    const filterButton = screen.getByRole('button', { name: /filters/i })
    fireEvent.click(filterButton)
    
    expect(screen.getByText('Conversion Likelihood')).toBeInTheDocument()
    expect(screen.getByText('Browsing Style')).toBeInTheDocument()
    expect(screen.getByText('Decision Speed')).toBeInTheDocument()
  })

  it('filters by conversion likelihood - high', () => {
    const onFilterChange = vi.fn()
    render(<PersonaCards {...defaultProps} onFilterChange={onFilterChange} />)
    
    const filterButton = screen.getByRole('button', { name: /filters/i })
    fireEvent.click(filterButton)
    
    const highButton = screen.getByRole('button', { name: /high/i })
    fireEvent.click(highButton)
    
    expect(onFilterChange).toHaveBeenCalledWith({
      conversionLikelihood: 'high'
    })
  })

  it('filters by browsing style', () => {
    const onFilterChange = vi.fn()
    render(<PersonaCards {...defaultProps} onFilterChange={onFilterChange} />)
    
    const filterButton = screen.getByRole('button', { name: /filters/i })
    fireEvent.click(filterButton)
    
    const scannerButton = screen.getByRole('button', { name: /scanner/i })
    fireEvent.click(scannerButton)
    
    expect(onFilterChange).toHaveBeenCalledWith({
      browsingStyle: 'scanner'
    })
  })

  it('filters by decision speed', () => {
    const onFilterChange = vi.fn()
    render(<PersonaCards {...defaultProps} onFilterChange={onFilterChange} />)
    
    const filterButton = screen.getByRole('button', { name: /filters/i })
    fireEvent.click(filterButton)
    
    const fastButton = screen.getByRole('button', { name: /fast/i })
    fireEvent.click(fastButton)
    
    expect(onFilterChange).toHaveBeenCalledWith({
      decisionSpeed: 'fast'
    })
  })

  it('displays filtered count when filters are active', () => {
    render(
      <PersonaCards
        {...defaultProps}
        filters={{ browsingStyle: 'scanner' }}
      />
    )
    
    expect(screen.getByText('1/3')).toBeInTheDocument()
  })

  it('shows empty state when no personas match filters', () => {
    // Use a filter combination that returns no results
    // Sarah: scanner/fast, Marcus: reader/moderate, Emily: explorer/deliberate
    // scanner + moderate returns 0 results
    render(
      <PersonaCards
        {...defaultProps}
        filters={{ browsingStyle: 'scanner', decisionSpeed: 'moderate' }}
      />
    )
    
    expect(screen.getByText('No personas match the selected filters.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument()
  })

  it('displays persona demographics', () => {
    render(<PersonaCards {...defaultProps} />)
    
    expect(screen.getByText('32')).toBeInTheDocument()
    expect(screen.getByText('San Francisco')).toBeInTheDocument()
    expect(screen.getByText('85%')).toBeInTheDocument()
  })

  it('displays behavior pattern badges', () => {
    render(<PersonaCards {...defaultProps} />)
    
    expect(screen.getByText('Scanner')).toBeInTheDocument()
    expect(screen.getByText('Fast')).toBeInTheDocument()
    expect(screen.getByText('Reader')).toBeInTheDocument()
    expect(screen.getByText('Moderate')).toBeInTheDocument()
  })

  it('displays pain points', () => {
    render(<PersonaCards {...defaultProps} />)
    
    expect(screen.getByText('Pricing not immediately visible')).toBeInTheDocument()
    expect(screen.getByText('API documentation hard to find')).toBeInTheDocument()
  })

  it('displays motivations', () => {
    render(<PersonaCards {...defaultProps} />)
    
    expect(screen.getByText('Cost efficiency')).toBeInTheDocument()
    expect(screen.getByText('Integration ease')).toBeInTheDocument()
  })

  it('displays quotes', () => {
    render(<PersonaCards {...defaultProps} />)
    
    expect(screen.getByText(/I just wanted to know how much it costs/i)).toBeInTheDocument()
  })

  it('displays conversion likelihood badge', () => {
    render(<PersonaCards {...defaultProps} />)
    
    const badge = document.querySelector('[class*="bg-primary/20"]')
    expect(badge).toHaveTextContent('72%')
  })

  it('displays progress bars for risk tolerance and price sensitivity', () => {
    render(<PersonaCards {...defaultProps} />)
    
    const progressBars = document.querySelectorAll('[role="progressbar"]')
    expect(progressBars.length).toBeGreaterThan(0)
  })
})

describe('PersonaCard', () => {
  const defaultProps = {
    persona: mockPersonas[0],
    isSelected: false,
    onPersonaSelect: vi.fn()
  }

  it('renders persona name and role', () => {
    render(<PersonaCard {...defaultProps} />)
    
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument()
    expect(screen.getByText('Startup Founder')).toBeInTheDocument()
  })

  it('applies selected styling when isSelected is true', () => {
    render(<PersonaCard {...defaultProps} isSelected={true} />)
    
    const card = document.querySelector('[class*="rounded-2xl"]')
    expect(card).toHaveClass('ring-2', 'ring-primary', 'border-primary')
  })

  it('calls onPersonaSelect on click', () => {
    const onPersonaSelect = vi.fn()
    render(<PersonaCard {...defaultProps} onSelect={onPersonaSelect} />)
    
    const card = document.querySelector('[class*="rounded-2xl"]')
    fireEvent.click(card!)
    expect(onPersonaSelect).toHaveBeenCalledWith('persona_1')
  })

  it('displays goal', () => {
    render(<PersonaCard {...defaultProps} />)
    
    expect(screen.getByText('Evaluate pricing plans quickly')).toBeInTheDocument()
  })
})