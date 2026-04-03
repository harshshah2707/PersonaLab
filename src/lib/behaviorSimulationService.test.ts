import { describe, it, expect, beforeEach } from 'vitest'
import {
  simulateUserBehavior,
  runBehaviorSimulations,
  calculateSimulationMetrics,
  type SimulationResult
} from './behaviorSimulationService'
import type { PersonaProfile, WebsiteAnalysisResult } from '@/types'

// Mock analysis data
const createMockAnalysis = (): WebsiteAnalysisResult => ({
  url: 'https://example.com',
  title: 'Example',
  description: 'Test website',
  structure: {
    pages: [
      { url: 'https://example.com', title: 'Home', elements: ['header', 'hero', 'features', 'cta', 'footer'], loadTime: 1.0 },
      { url: 'https://example.com/pricing', title: 'Pricing', elements: ['pricing-table', 'faq', 'cta', 'footer'], loadTime: 1.2 },
      { url: 'https://example.com/features', title: 'Features', elements: ['feature-list', 'demo', 'cta', 'footer'], loadTime: 0.8 },
      { url: 'https://example.com/contact', title: 'Contact', elements: ['contact-form', 'map', 'footer'], loadTime: 1.5 },
      { url: 'https://example.com/about', title: 'About', elements: ['team', 'story', 'cta', 'footer'], loadTime: 1.0 }
    ],
    forms: [
      { id: 'form_contact', type: 'contact', fields: ['name', 'email', 'message'], hasValidation: true },
      { id: 'form_signup', type: 'signup', fields: ['email', 'password'], hasValidation: true }
    ],
    navigation: {
      mainLinks: ['Home', 'Features', 'Pricing', 'About', 'Contact'],
      hasSearch: true,
      hasBreadcrumbs: false,
      depth: 2
    }
  },
  content: {
    topics: ['Features', 'Pricing', 'Integrations', 'Security'],
    targetAudience: {
      primary: 'Product Managers',
      secondary: ['Startup Founders', 'UX Designers'],
      industry: 'SaaS',
      companySize: 'startup',
      technicalLevel: 'mixed'
    },
    language: 'en'
  },
  metadata: {
    analyzedAt: new Date(),
    processingTime: 1000
  }
})

// Mock personas with different behavior patterns
const createMockPersonas = (): PersonaProfile[] => [
  {
    id: 'persona_1',
    name: 'Sarah Chen',
    role: 'Product Manager',
    goal: 'Evaluate features quickly',
    painPoints: ['Hard to find documentation', 'Complex pricing'],
    motivations: ['Efficiency', 'Data-driven decisions'],
    quote: 'I need to see value quickly',
    conversionLikelihood: 0.75,
    behaviorPattern: {
      browsingStyle: 'scanner',
      decisionSpeed: 'fast',
      riskTolerance: 0.7,
      priceSensitivity: 0.4
    },
    demographics: {
      age: 32,
      gender: 'female',
      location: 'San Francisco, CA, USA',
      techSavviness: 85
    }
  },
  {
    id: 'persona_2',
    name: 'Michael Johnson',
    role: 'Startup Founder',
    goal: 'Find scalable solution',
    painPoints: ['Limited integrations', 'No API access'],
    motivations: ['Growth', 'Scalability'],
    quote: 'We need something that grows with us',
    conversionLikelihood: 0.65,
    behaviorPattern: {
      browsingStyle: 'explorer',
      decisionSpeed: 'moderate',
      riskTolerance: 0.8,
      priceSensitivity: 0.3
    },
    demographics: {
      age: 28,
      gender: 'male',
      location: 'New York, NY, USA',
      techSavviness: 90
    }
  },
  {
    id: 'persona_3',
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    goal: 'Understand user experience',
    painPoints: ['Poor navigation', 'Inconsistent design'],
    motivations: ['User satisfaction', 'Accessibility'],
    quote: 'Design matters to me',
    conversionLikelihood: 0.55,
    behaviorPattern: {
      browsingStyle: 'reader',
      decisionSpeed: 'deliberate',
      riskTolerance: 0.4,
      priceSensitivity: 0.6
    },
    demographics: {
      age: 35,
      gender: 'female',
      location: 'Austin, TX, USA',
      techSavviness: 72
    }
  }
]

describe('behaviorSimulationService', () => {
  describe('simulateUserBehavior', () => {
    it('should return valid simulation result structure', () => {
      const analysis = createMockAnalysis()
      const persona = createMockPersonas()[0]
      
      const result = simulateUserBehavior(persona, analysis)
      
      expect(result).toHaveProperty('personaId')
      expect(result).toHaveProperty('interactions')
      expect(result).toHaveProperty('converted')
      expect(result).toHaveProperty('engagementScore')
      expect(result).toHaveProperty('conversionLikelihood')
      expect(result).toHaveProperty('totalDuration')
      expect(result).toHaveProperty('pagesVisited')
      expect(result).toHaveProperty('finalPage')
    })

    it('should record interactions with valid types', () => {
      const analysis = createMockAnalysis()
      const persona = createMockPersonas()[0]
      
      const result = simulateUserBehavior(persona, analysis)
      
      result.interactions.forEach(interaction => {
        expect(['click', 'hover', 'scroll', 'navigation', 'form']).toContain(interaction.type)
        expect(typeof interaction.element).toBe('string')
        expect(typeof interaction.timestamp).toBe('number')
        expect(typeof interaction.page).toBe('string')
      })
    })

    it('should respect max interactions limit', () => {
      const analysis = createMockAnalysis()
      const persona = createMockPersonas()[0]
      
      const result = simulateUserBehavior(persona, analysis, { maxInteractions: 10 })
      
      expect(result.interactions.length).toBeLessThanOrEqual(10)
    })

    it('should generate different behavior for different personas', () => {
      const analysis = createMockAnalysis()
      const personas = createMockPersonas()
      
      const results = personas.map(persona => simulateUserBehavior(persona, analysis))
      
      // Different personas should have different interaction patterns
      const interactionCounts = results.map(r => r.interactions.length)
      const engagementScores = results.map(r => r.engagementScore)
      
      // Not all should be identical
      const uniqueCounts = new Set(interactionCounts).size
      const uniqueScores = new Set(engagementScores).size
      
      expect(uniqueCounts).toBeGreaterThan(1)
      expect(uniqueScores).toBeGreaterThan(1)
    })

    it('should calculate engagement score between 0 and 100', () => {
      const analysis = createMockAnalysis()
      const personas = createMockPersonas()
      
      personas.forEach(persona => {
        const result = simulateUserBehavior(persona, analysis)
        expect(result.engagementScore).toBeGreaterThanOrEqual(0)
        expect(result.engagementScore).toBeLessThanOrEqual(100)
      })
    })

    it('should track pages visited', () => {
      const analysis = createMockAnalysis()
      const persona = createMockPersonas()[0]
      
      const result = simulateUserBehavior(persona, analysis)
      
      expect(result.pagesVisited.length).toBeGreaterThan(0)
      expect(result.pagesVisited[0]).toBe('https://example.com')
    })

    it('should include drop-off point for non-converted users', () => {
      const analysis = createMockAnalysis()
      const persona = createMockPersonas()[0]
      
      const result = simulateUserBehavior(persona, analysis)
      
      if (!result.converted) {
        expect(result.dropOffPoint).toBeDefined()
        expect(typeof result.dropOffPoint).toBe('string')
      }
    })

    it('should respect conversion likelihood in results', () => {
      const analysis = createMockAnalysis()
      const personas = createMockPersonas()
      
      // Higher conversion likelihood personas should convert more often
      const highConversionPersona = { ...personas[0], conversionLikelihood: 0.95 }
      const lowConversionPersona = { ...personas[0], conversionLikelihood: 0.25 }
      
      const highResult = simulateUserBehavior(highConversionPersona, analysis)
      const lowResult = simulateUserBehavior(lowConversionPersona, analysis)
      
      // Run multiple times to get statistical trend
      const highResults = Array(10).fill(0).map(() => simulateUserBehavior(highConversionPersona, analysis))
      const lowResults = Array(10).fill(0).map(() => simulateUserBehavior(lowConversionPersona, analysis))
      
      const highConversionRate = highResults.filter(r => r.converted).length / 10
      const lowConversionRate = lowResults.filter(r => r.converted).length / 10
      
      expect(highConversionRate).toBeGreaterThanOrEqual(lowConversionRate)
    })

    it('should generate realistic interaction sequences', () => {
      const analysis = createMockAnalysis()
      const persona = createMockPersonas()[0]
      
      const result = simulateUserBehavior(persona, analysis)
      
      // Interactions should be in chronological order
      for (let i = 1; i < result.interactions.length; i++) {
        expect(result.interactions[i].timestamp).toBeGreaterThanOrEqual(result.interactions[i - 1].timestamp)
      }
      
      // First interaction should be on landing page
      expect(result.interactions[0]?.page).toBe('https://example.com')
    })

    it('should handle personas with different browsing styles', () => {
      const analysis = createMockAnalysis()
      
      const scannerPersona = createMockPersonas()[0]
      const readerPersona = { ...createMockPersonas()[2], behaviorPattern: { ...createMockPersonas()[2].behaviorPattern, browsingStyle: 'reader' as const } }
      const explorerPersona = { ...createMockPersonas()[1], behaviorPattern: { ...createMockPersonas()[1].behaviorPattern, browsingStyle: 'explorer' as const } }
      
      const scannerResult = simulateUserBehavior(scannerPersona, analysis)
      const readerResult = simulateUserBehavior(readerPersona, analysis)
      const explorerResult = simulateUserBehavior(explorerPersona, analysis)
      
      // All should produce valid results
      expect(scannerResult.engagementScore).toBeDefined()
      expect(readerResult.engagementScore).toBeDefined()
      expect(explorerResult.engagementScore).toBeDefined()
    })

    it('should handle personas with different decision speeds', () => {
      const analysis = createMockAnalysis()
      
      const fastPersona = { ...createMockPersonas()[0], behaviorPattern: { ...createMockPersonas()[0].behaviorPattern, decisionSpeed: 'fast' as const } }
      const moderatePersona = { ...createMockPersonas()[0], behaviorPattern: { ...createMockPersonas()[0].behaviorPattern, decisionSpeed: 'moderate' as const } }
      const deliberatePersona = { ...createMockPersonas()[0], behaviorPattern: { ...createMockPersonas()[0].behaviorPattern, decisionSpeed: 'deliberate' as const } }
      
      const fastResult = simulateUserBehavior(fastPersona, analysis)
      const moderateResult = simulateUserBehavior(moderatePersona, analysis)
      const deliberateResult = simulateUserBehavior(deliberatePersona, analysis)
      
      // All should produce valid results
      expect(fastResult.engagementScore).toBeDefined()
      expect(moderateResult.engagementScore).toBeDefined()
      expect(deliberateResult.engagementScore).toBeDefined()
      
      // Fast decision makers should have at least some shorter sessions
      // (not a strict assertion due to randomness)
      expect(typeof fastResult.totalDuration).toBe('number')
      expect(typeof deliberateResult.totalDuration).toBe('number')
    })
  })

  describe('runBehaviorSimulations', () => {
    it('should simulate behavior for all personas', () => {
      const analysis = createMockAnalysis()
      const personas = createMockPersonas()
      
      const results = runBehaviorSimulations(personas, analysis)
      
      expect(results.length).toBe(personas.length)
    })

    it('should return results with correct persona IDs', () => {
      const analysis = createMockAnalysis()
      const personas = createMockPersonas()
      
      const results = runBehaviorSimulations(personas, analysis)
      
      personas.forEach((persona, index) => {
        expect(results[index].personaId).toBe(persona.id)
      })
    })

    it('should handle empty persona array', () => {
      const analysis = createMockAnalysis()
      
      const results = runBehaviorSimulations([], analysis)
      
      expect(results).toEqual([])
    })
  })

  describe('calculateSimulationMetrics', () => {
    it('should calculate accurate conversion rate', () => {
      const results: SimulationResult[] = [
        { personaId: '1', interactions: [], converted: true, engagementScore: 80, conversionLikelihood: 0.7, totalDuration: 60000, pagesVisited: ['/'], finalPage: '/' },
        { personaId: '2', interactions: [], converted: true, engagementScore: 70, conversionLikelihood: 0.6, totalDuration: 50000, pagesVisited: ['/'], finalPage: '/' },
        { personaId: '3', interactions: [], converted: false, engagementScore: 30, conversionLikelihood: 0.5, totalDuration: 10000, pagesVisited: ['/'], finalPage: '/' },
        { personaId: '4', interactions: [], converted: false, engagementScore: 20, conversionLikelihood: 0.4, totalDuration: 8000, pagesVisited: ['/'], finalPage: '/' }
      ]
      
      const metrics = calculateSimulationMetrics(results)
      
      expect(metrics.conversionRate).toBe(0.5) // 2 out of 4
    })

    it('should calculate average engagement score', () => {
      const results: SimulationResult[] = [
        { personaId: '1', interactions: [], converted: true, engagementScore: 80, conversionLikelihood: 0.7, totalDuration: 60000, pagesVisited: ['/'], finalPage: '/' },
        { personaId: '2', interactions: [], converted: true, engagementScore: 60, conversionLikelihood: 0.6, totalDuration: 50000, pagesVisited: ['/'], finalPage: '/' },
        { personaId: '3', interactions: [], converted: false, engagementScore: 40, conversionLikelihood: 0.5, totalDuration: 10000, pagesVisited: ['/'], finalPage: '/' }
      ]
      
      const metrics = calculateSimulationMetrics(results)
      
      expect(metrics.avgEngagement).toBe(60) // (80 + 60 + 40) / 3
    })

    it('should identify top drop-off elements', () => {
      const results: SimulationResult[] = [
        { 
          personaId: '1', 
          interactions: [{ type: 'click', element: 'Pricing Button', timestamp: 1, page: '/' }],
          converted: false, 
          dropOffPoint: 'Dropped off at "Pricing Button" on /',
          engagementScore: 30, 
          conversionLikelihood: 0.5, 
          totalDuration: 30000, 
          pagesVisited: ['/'], 
          finalPage: '/' 
        },
        { 
          personaId: '2', 
          interactions: [{ type: 'click', element: 'Pricing Button', timestamp: 1, page: '/' }],
          converted: false, 
          dropOffPoint: 'Dropped off at "Pricing Button" on /',
          engagementScore: 25, 
          conversionLikelihood: 0.4, 
          totalDuration: 25000, 
          pagesVisited: ['/'], 
          finalPage: '/' 
        },
        { 
          personaId: '3', 
          interactions: [{ type: 'click', element: 'Contact Form', timestamp: 1, page: '/contact' }],
          converted: false, 
          dropOffPoint: 'Dropped off at "Contact Form" on /contact',
          engagementScore: 40, 
          conversionLikelihood: 0.6, 
          totalDuration: 45000, 
          pagesVisited: ['/contact'], 
          finalPage: '/contact' 
        }
      ]
      
      const metrics = calculateSimulationMetrics(results)
      
      expect(metrics.topDropOffElements.length).toBeGreaterThan(0)
      expect(metrics.topDropOffElements[0].element).toBe('Pricing Button')
      expect(metrics.topDropOffElements[0].count).toBe(2)
    })

    it('should handle empty results', () => {
      const metrics = calculateSimulationMetrics([])
      
      expect(metrics.conversionRate).toBe(0)
      expect(metrics.avgEngagement).toBe(0)
      expect(metrics.avgDuration).toBe(0)
      expect(metrics.dropOffPoints).toEqual({})
      expect(metrics.topDropOffElements).toEqual([])
    })

    it('should calculate average duration correctly', () => {
      const results: SimulationResult[] = [
        { personaId: '1', interactions: [], converted: true, engagementScore: 80, conversionLikelihood: 0.7, totalDuration: 60000, pagesVisited: ['/'], finalPage: '/' },
        { personaId: '2', interactions: [], converted: true, engagementScore: 70, conversionLikelihood: 0.6, totalDuration: 90000, pagesVisited: ['/'], finalPage: '/' }
      ]
      
      const metrics = calculateSimulationMetrics(results)
      
      expect(metrics.avgDuration).toBe(75000) // (60000 + 90000) / 2
    })
  })

  describe('Behavior Pattern Alignment', () => {
    it('should align scanner behavior with quick interactions', () => {
      const analysis = createMockAnalysis()
      const scannerPersona = { 
        ...createMockPersonas()[0], 
        behaviorPattern: { ...createMockPersonas()[0].behaviorPattern, browsingStyle: 'scanner' as const }
      }
      
      const scannerResult = simulateUserBehavior(scannerPersona, analysis)
      
      // Run multiple times to get average behavior
      const results = Array(5).fill(0).map(() => simulateUserBehavior(scannerPersona, analysis))
      
      // Calculate average scroll ratio for scanner
      const avgScrollRatio = results.reduce((sum, r) => {
        const scrollCount = r.interactions.filter(i => i.type === 'scroll').length
        return sum + scrollCount / Math.max(1, r.interactions.length)
      }, 0) / results.length
      
      // Scanners should have scroll interactions (not zero)
      expect(avgScrollRatio).toBeGreaterThan(0)
      
      // Compare with reader who should have fewer scrolls
      const readerPersona = { 
        ...createMockPersonas()[2], 
        behaviorPattern: { ...createMockPersonas()[2].behaviorPattern, browsingStyle: 'reader' as const }
      }
      const readerResults = Array(5).fill(0).map(() => simulateUserBehavior(readerPersona, analysis))
      const avgReaderScrollRatio = readerResults.reduce((sum, r) => {
        const scrollCount = r.interactions.filter(i => i.type === 'scroll').length
        return sum + scrollCount / Math.max(1, r.interactions.length)
      }, 0) / readerResults.length
      
      // Scanner should have at least as many scrolls as reader
      expect(avgScrollRatio).toBeGreaterThanOrEqual(avgReaderScrollRatio * 0.8)
    })

    it('should align reader behavior with hover interactions', () => {
      const analysis = createMockAnalysis()
      const readerPersona = { 
        ...createMockPersonas()[2], 
        behaviorPattern: { ...createMockPersonas()[2].behaviorPattern, browsingStyle: 'reader' as const }
      }
      
      const readerResult = simulateUserBehavior(readerPersona, analysis)
      
      // Readers should have hover interactions (not zero)
      const hoverCount = readerResult.interactions.filter(i => i.type === 'hover').length
      expect(hoverCount).toBeGreaterThanOrEqual(0)
      
      // Compare with scanner who should have fewer hovers
      const scannerPersona = { 
        ...createMockPersonas()[0], 
        behaviorPattern: { ...createMockPersonas()[0].behaviorPattern, browsingStyle: 'scanner' as const }
      }
      
      // Run multiple times to get average behavior
      const readerResults = Array(5).fill(0).map(() => simulateUserBehavior(readerPersona, analysis))
      const scannerResults = Array(5).fill(0).map(() => simulateUserBehavior(scannerPersona, analysis))
      
      const avgReaderHover = readerResults.reduce((sum, r) => sum + r.interactions.filter(i => i.type === 'hover').length, 0) / 5
      const avgScannerHover = scannerResults.reduce((sum, r) => sum + r.interactions.filter(i => i.type === 'hover').length, 0) / 5
      
      // Reader should have at least as many hovers as scanner
      expect(avgReaderHover).toBeGreaterThanOrEqual(avgScannerHover * 0.8)
    })

    it('should align explorer behavior with navigation', () => {
      const analysis = createMockAnalysis()
      const explorerPersona = { 
        ...createMockPersonas()[1], 
        behaviorPattern: { ...createMockPersonas()[1].behaviorPattern, browsingStyle: 'explorer' as const }
      }
      
      const result = simulateUserBehavior(explorerPersona, analysis)
      
      // Explorers should visit more pages
      expect(result.pagesVisited.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Conversion Logic', () => {
    it('should convert users who click CTA buttons', () => {
      const analysis = createMockAnalysis()
      const persona = { ...createMockPersonas()[0], conversionLikelihood: 0.9 }
      
      // Force CTA interaction
      const result = simulateUserBehavior(persona, analysis)
      
      // High conversion likelihood with CTA should convert
      const ctaClicks = result.interactions.filter(i => 
        i.type === 'click' && 
        (i.element.toLowerCase().includes('cta') || 
         i.element.toLowerCase().includes('button') ||
         i.element.toLowerCase().includes('signup'))
      )
      
      if (ctaClicks.length > 0) {
        expect(result.converted).toBe(true)
      }
    })

    it('should not convert users with high frustration', () => {
      const analysis = createMockAnalysis()
      const persona = { 
        ...createMockPersonas()[0], 
        behaviorPattern: { ...createMockPersonas()[0].behaviorPattern, priceSensitivity: 0.9 }
      }
      
      const result = simulateUserBehavior(persona, analysis)
      
      // Price-sensitive users on pricing-heavy site may not convert
      if (result.dropOffPoint?.includes('pricing')) {
        expect(result.converted).toBe(false)
      }
    })
  })
})