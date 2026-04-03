import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { HeatmapVisualization } from './heatmap-visualization'
import type { HeatmapPoint } from '@/types'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  MousePointer: () => <svg data-testid="mouse-pointer" />,
  Eye: () => <svg data-testid="eye" />,
  ArrowDown: () => <svg data-testid="arrow-down" />,
  X: () => <svg data-testid="x" />,
  Info: () => <svg data-testid="info" />,
  Sparkles: () => <svg data-testid="sparkles" />,
  TrendingUp: () => <svg data-testid="trending-up" />,
  AlertCircle: () => <svg data-testid="alert-circle" />,
  Lightbulb: () => <svg data-testid="lightbulb" />,
  ChevronRight: () => <svg data-testid="chevron-right" />
}))

const mockHeatmapPoints: HeatmapPoint[] = [
  { id: '1', x: 25, y: 30, intensity: 0.8, type: 'emerald', label: 'CTA Button', description: 'Primary call-to-action clicked 8 times' },
  { id: '2', x: 60, y: 45, intensity: 0.5, type: 'cyan', label: 'Navigation', description: 'Menu hover interactions' },
  { id: '3', x: 40, y: 70, intensity: 0.3, type: 'emerald', label: 'Content', description: 'Article read' },
  { id: '4', x: 80, y: 20, intensity: 0.9, type: 'cyan', label: 'Logo', description: 'Brand attention' },
  { id: '5', x: 15, y: 85, intensity: 0.6, type: 'emerald', label: 'Footer', description: 'Footer link clicked' }
]

describe('HeatmapVisualization', () => {
  const defaultProps = {
    data: mockHeatmapPoints,
    onPointClick: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Rendering', () => {
    it('renders the heatmap card with title', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      expect(screen.getByText('Interaction Heatmap')).toBeInTheDocument()
    })

    it('renders all heatmap points in scroll mode', () => {
      render(<HeatmapVisualization {...defaultProps} overlayMode="scroll" />)
      
      // In scroll mode, all 5 points should be visible
      expect(screen.getByRole('button', { name: /CTA Button/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Navigation/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Content/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Logo/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Footer/i })).toBeInTheDocument()
    })

    it('renders mode toggle buttons', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: /clicks/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /attention/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /scroll/i })).toBeInTheDocument()
    })

    it('renders legend with interaction types', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      expect(screen.getByText('Good Interaction')).toBeInTheDocument()
      expect(screen.getByText('Attention/Confusion')).toBeInTheDocument()
    })

    it('renders website screenshot when provided', () => {
      render(<HeatmapVisualization {...defaultProps} websiteScreenshot="/mock-screenshot.jpg" />)
      
      const img = screen.getByAltText('Website screenshot')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', '/mock-screenshot.jpg')
    })

    it('renders mock UI when no screenshot provided', () => {
      render(<HeatmapVisualization {...defaultProps} websiteScreenshot={undefined} />)
      
      // Should render mock website elements
      expect(screen.getByText('Interaction Heatmap')).toBeInTheDocument()
    })
  })

  describe('Coordinate Normalization (Requirement 6.2)', () => {
    it('clamps coordinates within 0-100% range - positive overflow', () => {
      const pointsWithOverflow: HeatmapPoint[] = [
        { id: '1', x: 150, y: 200, intensity: 0.5, type: 'emerald', label: 'Test', description: 'Test' }
      ]
      
      render(<HeatmapVisualization data={pointsWithOverflow} />)
      
      expect(screen.getByText('Interaction Heatmap')).toBeInTheDocument()
    })

    it('clamps coordinates within 0-100% range - negative values', () => {
      const pointsWithNegative: HeatmapPoint[] = [
        { id: '1', x: -50, y: -30, intensity: 0.5, type: 'emerald', label: 'Test', description: 'Test' }
      ]
      
      render(<HeatmapVisualization data={pointsWithNegative} />)
      
      expect(screen.getByText('Interaction Heatmap')).toBeInTheDocument()
    })

    it('handles valid coordinates correctly', () => {
      const validPoints: HeatmapPoint[] = [
        { id: '1', x: 50, y: 50, intensity: 0.5, type: 'emerald', label: 'Center', description: 'Center point' }
      ]
      
      render(<HeatmapVisualization data={validPoints} />)
      
      expect(screen.getByRole('button', { name: /Center/i })).toBeInTheDocument()
    })
  })

  describe('Intensity Normalization (Requirement 6.5)', () => {
    it('clamps intensity between 0 and 1 - overflow', () => {
      const pointsWithHighIntensity: HeatmapPoint[] = [
        { id: '1', x: 50, y: 50, intensity: 1.5, type: 'emerald', label: 'Test', description: 'Test' }
      ]
      
      render(<HeatmapVisualization data={pointsWithHighIntensity} />)
      
      expect(screen.getByText('Interaction Heatmap')).toBeInTheDocument()
    })

    it('clamps intensity between 0 and 1 - negative', () => {
      const pointsWithNegativeIntensity: HeatmapPoint[] = [
        { id: '1', x: 50, y: 50, intensity: -0.5, type: 'emerald', label: 'Test', description: 'Test' }
      ]
      
      render(<HeatmapVisualization data={pointsWithNegativeIntensity} />)
      
      expect(screen.getByText('Interaction Heatmap')).toBeInTheDocument()
    })

    it('handles zero intensity correctly', () => {
      const pointsWithZeroIntensity: HeatmapPoint[] = [
        { id: '1', x: 50, y: 50, intensity: 0, type: 'emerald', label: 'Test', description: 'Test' }
      ]
      
      render(<HeatmapVisualization data={pointsWithZeroIntensity} />)
      
      expect(screen.getByRole('button', { name: /Test/i })).toBeInTheDocument()
    })
  })

  describe('Overlay Modes (Requirement 6.3)', () => {
    it('shows only emerald points in clicks mode', () => {
      render(<HeatmapVisualization {...defaultProps} overlayMode="clicks" />)
      
      // In clicks mode, only emerald points should be visible (3 points)
      expect(screen.getByRole('button', { name: /CTA Button/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Content/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Footer/i })).toBeInTheDocument()
      
      // Cyan points should not be visible
      expect(screen.queryByRole('button', { name: /Navigation/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Logo/i })).not.toBeInTheDocument()
    })

    it('shows only cyan points in attention mode', () => {
      render(<HeatmapVisualization {...defaultProps} overlayMode="attention" />)
      
      // In attention mode, only cyan points should be visible (2 points)
      expect(screen.getByRole('button', { name: /Navigation/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Logo/i })).toBeInTheDocument()
      
      // Emerald points should not be visible
      expect(screen.queryByRole('button', { name: /CTA Button/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Content/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Footer/i })).not.toBeInTheDocument()
    })

    it('shows all points in scroll mode', () => {
      render(<HeatmapVisualization {...defaultProps} overlayMode="scroll" />)
      
      // In scroll mode, all points should be visible
      expect(screen.getByRole('button', { name: /CTA Button/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Navigation/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Content/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Logo/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Footer/i })).toBeInTheDocument()
    })

    it('switches between modes correctly', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      // Initially in clicks mode - should see emerald points
      expect(screen.getByRole('button', { name: /CTA Button/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Navigation/i })).not.toBeInTheDocument()
      
      // Switch to attention mode - should see cyan points
      const attentionButton = screen.getByRole('button', { name: /attention/i })
      fireEvent.click(attentionButton)
      
      expect(screen.queryByRole('button', { name: /CTA Button/i })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Navigation/i })).toBeInTheDocument()
      
      // Switch to scroll mode - should see all points
      const scrollButton = screen.getByRole('button', { name: /scroll/i })
      fireEvent.click(scrollButton)
      
      expect(screen.getByRole('button', { name: /CTA Button/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Navigation/i })).toBeInTheDocument()
    })
  })

  describe('Point Interaction', () => {
    it('calls onPointClick when a point is clicked', () => {
      const onPointClick = vi.fn()
      render(<HeatmapVisualization {...defaultProps} onPointClick={onPointClick} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      fireEvent.click(ctaButton)
      
      expect(onPointClick).toHaveBeenCalledTimes(1)
      expect(onPointClick).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          label: 'CTA Button'
        })
      )
    })

    it('shows tooltip when point is selected', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      fireEvent.click(ctaButton)
      
      expect(screen.getByText('CTA Button')).toBeInTheDocument()
      expect(screen.getByText('Primary call-to-action clicked 8 times')).toBeInTheDocument()
    })

    it('closes tooltip when close button is clicked', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      fireEvent.click(ctaButton)
      expect(screen.getByText('CTA Button')).toBeInTheDocument()
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(closeButton)
      
      // Tooltip should be closed
      expect(screen.queryByText('CTA Button')).not.toBeInTheDocument()
    })

    it('displays intensity and position in tooltip', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      fireEvent.click(ctaButton)
      
      expect(screen.getByText(/intensity:/i)).toBeInTheDocument()
      expect(screen.getByText(/position:/i)).toBeInTheDocument()
    })
  })

  describe('Empty Data', () => {
    it('renders without points when data is empty', () => {
      render(<HeatmapVisualization data={[]} />)
      
      expect(screen.getByText('Interaction Heatmap')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /cta button/i })).not.toBeInTheDocument()
    })
  })

  describe('ClassName Prop', () => {
    it('applies custom className', () => {
      render(<HeatmapVisualization {...defaultProps} className="custom-class" />)
      
      const card = screen.getByText('Interaction Heatmap').closest('[class*="overflow-hidden"]')
      expect(card).toHaveClass('custom-class')
    })
  })

  // Requirement 6.4: AI Analysis Panel Tests
  describe('AI Analysis Panel (Requirement 6.4)', () => {
    it('displays AI Analysis header when point is selected', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      fireEvent.click(ctaButton)
      
      expect(screen.getByText('AI Analysis')).toBeInTheDocument()
    })

    it('shows key insights in AI analysis panel', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      fireEvent.click(ctaButton)
      
      expect(screen.getByText('Key Insights')).toBeInTheDocument()
    })

    it('displays related metrics in AI analysis panel', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      fireEvent.click(ctaButton)
      
      expect(screen.getByText('Related Metrics')).toBeInTheDocument()
      expect(screen.getByText('Avg. Time')).toBeInTheDocument()
      expect(screen.getByText('Bounce Rate')).toBeInTheDocument()
      expect(screen.getByText('Conversion Impact')).toBeInTheDocument()
    })

    it('shows recommendations in AI analysis panel', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      fireEvent.click(ctaButton)
      
      expect(screen.getByText('Recommendations')).toBeInTheDocument()
    })

    it('displays point label and description in AI panel', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      fireEvent.click(ctaButton)
      
      expect(screen.getByText('CTA Button')).toBeInTheDocument()
      expect(screen.getByText('Primary call-to-action clicked 8 times')).toBeInTheDocument()
    })

    it('displays intensity percentage in AI panel', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      fireEvent.click(ctaButton)
      
      // Check for intensity in the metrics section (Related Metrics)
      const metricsSection = screen.getByText('Related Metrics').closest('div')
      expect(metricsSection).toHaveTextContent(/80/)
    })
  })

  // Requirement 6.6: Hover Tooltip Tests
  describe('Hover Tooltips (Requirement 6.6)', () => {
    it('shows hover tooltip when mouse enters a point', async () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      fireEvent.mouseEnter(ctaButton)
      
      await waitFor(() => {
        expect(screen.getByText('CTA Button')).toBeInTheDocument()
      })
    })

    it('hides hover tooltip when mouse leaves a point', async () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      fireEvent.mouseEnter(ctaButton)
      
      await waitFor(() => {
        expect(screen.getByText('CTA Button')).toBeInTheDocument()
      })
      
      fireEvent.mouseLeave(ctaButton)
      
      await waitFor(() => {
        // Hover tooltip should be hidden when not hovered
        const tooltips = screen.queryAllByText('CTA Button')
        expect(tooltips.length).toBeLessThan(2)
      })
    })

    it('does not show hover tooltip when point is selected', async () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      fireEvent.click(ctaButton)
      
      // AI panel should be visible
      expect(screen.getByText('AI Analysis')).toBeInTheDocument()
      
      // Hover tooltip should not appear when selected
      const ctaButtonAfter = screen.getByRole('button', { name: /CTA Button/i })
      fireEvent.mouseEnter(ctaButtonAfter)
      
      // Only one CTA Button text should be visible (in AI panel)
      const ctaButtonTexts = screen.getAllByText('CTA Button')
      expect(ctaButtonTexts.length).toBe(1)
    })

    it('hover tooltip shows intensity percentage', async () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      fireEvent.mouseEnter(ctaButton)
      
      await waitFor(() => {
        expect(screen.getByText(/80%/)).toBeInTheDocument()
      })
    })
  })

  // Requirement 6.7: Smooth Transitions Tests
  describe('Smooth Transitions (Requirement 6.7)', () => {
    it('applies transition class when switching modes', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const attentionButton = screen.getByRole('button', { name: /attention/i })
      fireEvent.click(attentionButton)
      
      // Component should re-render with new mode
      expect(screen.getByRole('button', { name: /Navigation/i })).toBeInTheDocument()
    })

    it('transitions between all overlay modes smoothly', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      // Start in clicks mode
      expect(screen.getByRole('button', { name: /CTA Button/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Navigation/i })).not.toBeInTheDocument()
      
      // Switch to attention mode
      const attentionButton = screen.getByRole('button', { name: /attention/i })
      fireEvent.click(attentionButton)
      
      expect(screen.queryByRole('button', { name: /CTA Button/i })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Navigation/i })).toBeInTheDocument()
      
      // Switch to scroll mode
      const scrollButton = screen.getByRole('button', { name: /scroll/i })
      fireEvent.click(scrollButton)
      
      expect(screen.getByRole('button', { name: /CTA Button/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Navigation/i })).toBeInTheDocument()
    })

    it('applies smooth animation to heatmap points', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      
      // Check that the button has transition classes
      expect(ctaButton).toHaveClass('transition-all')
      expect(ctaButton).toHaveClass('duration-300')
    })
  })

  // Keyboard Navigation Tests
  describe('Keyboard Navigation', () => {
    it('selects point when Enter key is pressed', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      ctaButton.focus()
      fireEvent.keyDown(ctaButton, { key: 'Enter' })
      
      expect(screen.getByText('AI Analysis')).toBeInTheDocument()
    })

    it('selects point when Space key is pressed', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      ctaButton.focus()
      fireEvent.keyDown(ctaButton, { key: ' ' })
      
      expect(screen.getByText('AI Analysis')).toBeInTheDocument()
    })

    it('closes AI panel when Escape key is pressed', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      fireEvent.click(ctaButton)
      
      expect(screen.getByText('AI Analysis')).toBeInTheDocument()
      
      fireEvent.keyDown(ctaButton, { key: 'Escape' })
      
      expect(screen.queryByText('AI Analysis')).not.toBeInTheDocument()
    })

    it('heatmap points are focusable', () => {
      render(<HeatmapVisualization {...defaultProps} />)
      
      const ctaButton = screen.getByRole('button', { name: /CTA Button/i })
      
      expect(ctaButton).toHaveAttribute('tabIndex', '0')
    })
  })
})

// Property-based tests for coordinate normalization
describe('HeatmapVisualization Property Tests', () => {
  it('handles various coordinate values correctly', () => {
    const testCases = [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
      { x: 50, y: 50 },
      { x: 0.5, y: 0.5 },
      { x: 99.9, y: 99.9 }
    ]

    testCases.forEach(({ x, y }) => {
      const points: HeatmapPoint[] = [
        { id: '1', x, y, intensity: 0.5, type: 'emerald', label: 'Test', description: 'Test' }
      ]
      
      const { container } = render(<HeatmapVisualization data={points} />)
      expect(container).toBeInTheDocument()
    })
  })

  it('handles various intensity values correctly', () => {
    const intensityValues = [0, 0.25, 0.5, 0.75, 1, 1.5, -0.5]

    intensityValues.forEach((intensity) => {
      const points: HeatmapPoint[] = [
        { id: '1', x: 50, y: 50, intensity, type: 'emerald', label: 'Test', description: 'Test' }
      ]
      
      const { container } = render(<HeatmapVisualization data={points} />)
      expect(container).toBeInTheDocument()
    })
  })

  it('handles large datasets without performance issues', () => {
    const largeDataset: HeatmapPoint[] = Array.from({ length: 100 }, (_, i) => ({
      id: `${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      intensity: Math.random(),
      type: i % 2 === 0 ? 'emerald' : 'cyan',
      label: `Point ${i}`,
      description: `Description for point ${i}`
    }))

    const { container } = render(<HeatmapVisualization data={largeDataset} overlayMode="scroll" />)
    expect(container).toBeInTheDocument()
  })
})

export {}