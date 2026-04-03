import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  analyzeWebsite,
  generatePersonasFromAnalysis,
  generateMetricsFromAnalysis,
  generateHeatmapFromAnalysis,
  generateInsightsFromAnalysis,
  performFullAnalysis,
  type WebsiteAnalysisResult
} from './websiteAnalysisService'

describe('websiteAnalysisService', () => {
  // Mock progress callback
  const mockProgressCallback = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('analyzeWebsite', () => {
    it('should complete analysis within 30 seconds', async () => {
      const startTime = Date.now()
      const result = await analyzeWebsite('https://example.com')
      const duration = Date.now() - startTime

      expect(duration).toBeLessThan(30000)
      expect(result).toBeDefined()
    })

    it('should return valid WebsiteAnalysisResult structure', async () => {
      const result = await analyzeWebsite('https://example.com')

      expect(result.url).toBe('https://example.com')
      expect(result.title).toBeDefined()
      expect(result.description).toBeDefined()
      expect(result.structure).toBeDefined()
      expect(result.structure.pages).toBeInstanceOf(Array)
      expect(result.structure.forms).toBeInstanceOf(Array)
      expect(result.structure.navigation).toBeDefined()
      expect(result.content).toBeDefined()
      expect(result.content.topics).toBeInstanceOf(Array)
      expect(result.content.targetAudience).toBeDefined()
      expect(result.metadata.analyzedAt).toBeInstanceOf(Date)
      expect(result.metadata.processingTime).toBeGreaterThan(0)
    })

    it('should call progress callback with stages', async () => {
      await analyzeWebsite('https://example.com', mockProgressCallback)

      expect(mockProgressCallback).toHaveBeenCalled()
      const calls = mockProgressCallback.mock.calls
      
      // Check that progress stages were called
      expect(calls.some(call => call[0].includes('Validating'))).toBe(true)
      expect(calls.some(call => call[0].includes('Scraping'))).toBe(true)
      expect(calls.some(call => call[1] === 100)).toBe(true)
    })

    it('should generate pages with valid structure', async () => {
      const result = await analyzeWebsite('https://example.com')

      expect(result.structure.pages.length).toBeGreaterThan(0)
      result.structure.pages.forEach(page => {
        expect(page.url).toContain('example.com')
        expect(page.title).toBeDefined()
        expect(page.elements).toBeInstanceOf(Array)
        expect(page.loadTime).toBeGreaterThan(0)
      })
    })

    it('should generate forms with valid structure', async () => {
      const result = await analyzeWebsite('https://example.com')

      expect(result.structure.forms.length).toBeGreaterThan(0)
      result.structure.forms.forEach(form => {
        expect(form.id).toBeDefined()
        expect(['contact', 'signup', 'login', 'search', 'other']).toContain(form.type)
        expect(form.fields).toBeInstanceOf(Array)
        expect(typeof form.hasValidation).toBe('boolean')
      })
    })

    it('should infer correct target audience for developer-focused URLs', async () => {
      const result = await analyzeWebsite('https://devtools.io')

      expect(result.content.targetAudience.technicalLevel).toBe('developer')
      expect(result.content.targetAudience.primary).toBe('Software Developers')
    })

    it('should infer correct target audience for e-commerce URLs', async () => {
      const result = await analyzeWebsite('https://mystore.com')

      expect(result.content.targetAudience.industry).toBe('E-commerce')
    })

    it('should generate relevant topics based on URL', async () => {
      const result = await analyzeWebsite('https://myapp.com')

      expect(result.content.topics.length).toBeGreaterThan(0)
      result.content.topics.forEach(topic => {
        expect(typeof topic).toBe('string')
        expect(topic.length).toBeGreaterThan(0)
      })
    })
  })

  describe('generatePersonasFromAnalysis', () => {
    const mockAnalysis: WebsiteAnalysisResult = {
      url: 'https://example.com',
      title: 'Example',
      description: 'Test description',
      structure: {
        pages: [],
        forms: [],
        navigation: {
          mainLinks: ['Home', 'Features'],
          hasSearch: true,
          hasBreadcrumbs: false,
          depth: 2
        }
      },
      content: {
        topics: ['Features', 'Pricing', 'Integrations'],
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
    }

    it('should generate exactly 5 personas', () => {
      const personas = generatePersonasFromAnalysis(mockAnalysis)

      expect(personas.length).toBe(5)
    })

    it('should generate unique persona IDs', () => {
      const personas = generatePersonasFromAnalysis(mockAnalysis)
      const ids = personas.map(p => p.id)

      expect(new Set(ids).size).toBe(5)
    })

    it('should generate personas with all required fields', () => {
      const personas = generatePersonasFromAnalysis(mockAnalysis)

      personas.forEach(persona => {
        expect(persona.id).toBeDefined()
        expect(persona.name).toBeDefined()
        expect(persona.role).toBeDefined()
        expect(persona.goal).toBeDefined()
        expect(persona.painPoints).toBeInstanceOf(Array)
        expect(persona.motivations).toBeInstanceOf(Array)
        expect(persona.quote).toBeDefined()
        expect(persona.conversionLikelihood).toBeGreaterThanOrEqual(0)
        expect(persona.conversionLikelihood).toBeLessThanOrEqual(1)
        expect(['scanner', 'reader', 'explorer']).toContain(persona.behaviorPattern.browsingStyle)
        expect(['fast', 'moderate', 'deliberate']).toContain(persona.behaviorPattern.decisionSpeed)
        expect(persona.behaviorPattern.riskTolerance).toBeGreaterThanOrEqual(0)
        expect(persona.behaviorPattern.riskTolerance).toBeLessThanOrEqual(1)
        expect(persona.behaviorPattern.priceSensitivity).toBeGreaterThanOrEqual(0)
        expect(persona.behaviorPattern.priceSensitivity).toBeLessThanOrEqual(1)
        expect(persona.demographics.age).toBeGreaterThan(0)
        expect(persona.demographics.age).toBeLessThanOrEqual(100)
        expect(persona.demographics.gender).toBeDefined()
        expect(persona.demographics.location).toBeDefined()
        expect(persona.demographics.techSavviness).toBeGreaterThanOrEqual(0)
        expect(persona.demographics.techSavviness).toBeLessThanOrEqual(100)
      })
    })

    it('should use target audience in persona generation', () => {
      const personas = generatePersonasFromAnalysis(mockAnalysis)

      // Role should be derived from target audience
      expect(personas[0].role).toBeDefined()
      expect(typeof personas[0].role).toBe('string')
    })

    it('should generate diverse age distribution', () => {
      const personas = generatePersonasFromAnalysis(mockAnalysis)
      const ages = personas.map(p => p.demographics.age)

      // Check that ages span different ranges
      const ageRanges = ages.map(age => {
        if (age < 30) return 'young'
        if (age < 40) return 'middle'
        if (age < 50) return 'mature'
        return 'senior'
      })

      // Should have at least 2 different age ranges
      expect(new Set(ageRanges).size).toBeGreaterThanOrEqual(2)
    })

    it('should generate diverse gender distribution', () => {
      const personas = generatePersonasFromAnalysis(mockAnalysis)
      const genders = personas.map(p => p.demographics.gender)

      // Should have at least 2 different genders
      expect(new Set(genders).size).toBeGreaterThanOrEqual(2)
    })

    it('should generate diverse location distribution', () => {
      const personas = generatePersonasFromAnalysis(mockAnalysis)
      const locations = personas.map(p => p.demographics.location)

      // Should have at least 2 different locations
      expect(new Set(locations).size).toBeGreaterThanOrEqual(2)
    })

    it('should generate diverse tech savviness levels', () => {
      const personas = generatePersonasFromAnalysis(mockAnalysis)
      const techLevels = personas.map(p => p.demographics.techSavviness)

      // Should have at least 2 different tech savviness ranges
      const techRanges = techLevels.map(level => {
        if (level < 50) return 'low'
        if (level < 75) return 'medium'
        return 'high'
      })

      expect(new Set(techRanges).size).toBeGreaterThanOrEqual(2)
    })

    it('should generate diverse browsing styles', () => {
      const personas = generatePersonasFromAnalysis(mockAnalysis)
      const styles = personas.map(p => p.behaviorPattern.browsingStyle)

      // Should have at least 2 different browsing styles
      expect(new Set(styles).size).toBeGreaterThanOrEqual(2)
    })

    it('should generate diverse decision speeds', () => {
      const personas = generatePersonasFromAnalysis(mockAnalysis)
      const speeds = personas.map(p => p.behaviorPattern.decisionSpeed)

      // Should have at least 2 different decision speeds
      expect(new Set(speeds).size).toBeGreaterThanOrEqual(2)
    })

    it('should generate realistic conversion likelihood values', () => {
      const personas = generatePersonasFromAnalysis(mockAnalysis)

      personas.forEach(persona => {
        expect(persona.conversionLikelihood).toBeGreaterThanOrEqual(0.25)
        expect(persona.conversionLikelihood).toBeLessThanOrEqual(0.95)
      })
    })

    it('should include motivations for each persona', () => {
      const personas = generatePersonasFromAnalysis(mockAnalysis)

      personas.forEach(persona => {
        expect(persona.motivations.length).toBeGreaterThanOrEqual(2)
        expect(persona.motivations.length).toBeLessThanOrEqual(4)
        persona.motivations.forEach(motivation => {
          expect(typeof motivation).toBe('string')
          expect(motivation.length).toBeGreaterThan(0)
        })
      })
    })

    it('should include pain points for each persona', () => {
      const personas = generatePersonasFromAnalysis(mockAnalysis)

      personas.forEach(persona => {
        expect(persona.painPoints.length).toBeGreaterThanOrEqual(2)
        persona.painPoints.forEach(painPoint => {
          expect(typeof painPoint).toBe('string')
          expect(painPoint.length).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('generateMetricsFromAnalysis', () => {
    const mockAnalysis: WebsiteAnalysisResult = {
      url: 'https://example.com',
      title: 'Example',
      description: 'Test description',
      structure: {
        pages: [
          { url: 'https://example.com', title: 'Home', elements: [], loadTime: 1.0 },
          { url: 'https://example.com/pricing', title: 'Pricing', elements: [], loadTime: 1.5 }
        ],
        forms: [],
        navigation: {
          mainLinks: ['Home', 'Features', 'Pricing'],
          hasSearch: true,
          hasBreadcrumbs: false,
          depth: 2
        }
      },
      content: {
        topics: ['Features', 'Pricing'],
        targetAudience: {
          primary: 'Product Managers',
          secondary: [],
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
    }

    it('should generate valid metrics', () => {
      const metrics = generateMetricsFromAnalysis(mockAnalysis)

      expect(metrics.conversionRate).toBeGreaterThanOrEqual(0)
      expect(metrics.conversionRate).toBeLessThanOrEqual(1)
      expect(metrics.uxScore).toBeGreaterThanOrEqual(0)
      expect(metrics.uxScore).toBeLessThanOrEqual(100)
      expect(['low', 'medium', 'high']).toContain(metrics.dropOffRisk)
      expect(metrics.engagement).toBeGreaterThanOrEqual(0)
      expect(metrics.engagement).toBeLessThanOrEqual(100)
    })

    it('should include trend data', () => {
      const metrics = generateMetricsFromAnalysis(mockAnalysis)

      expect(metrics.trend).toBeDefined()
      expect(typeof metrics.trend.conversionRate).toBe('number')
      expect(typeof metrics.trend.uxScore).toBe('number')
      expect(typeof metrics.trend.engagement).toBe('number')
    })

    it('should calculate higher drop-off risk for slower pages', () => {
      const slowAnalysis: WebsiteAnalysisResult = {
        ...mockAnalysis,
        structure: {
          ...mockAnalysis.structure,
          pages: [
            { url: 'https://example.com', title: 'Home', elements: [], loadTime: 3.0 },
            { url: 'https://example.com/pricing', title: 'Pricing', elements: [], loadTime: 2.5 }
          ]
        }
      }

      const metrics = generateMetricsFromAnalysis(slowAnalysis)

      expect(metrics.dropOffRisk).toBe('high')
    })
  })

  describe('generateHeatmapFromAnalysis', () => {
    const mockAnalysis: WebsiteAnalysisResult = {
      url: 'https://example.com',
      title: 'Example',
      description: 'Test description',
      structure: {
        pages: [],
        forms: [],
        navigation: {
          mainLinks: [],
          hasSearch: true,
          hasBreadcrumbs: false,
          depth: 2
        }
      },
      content: {
        topics: ['Features'],
        targetAudience: {
          primary: 'Product Managers',
          secondary: [],
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
    }

    it('should generate heatmap points with valid coordinates', () => {
      const points = generateHeatmapFromAnalysis(mockAnalysis)

      expect(points.length).toBeGreaterThan(0)
      points.forEach(point => {
        expect(point.x).toBeGreaterThanOrEqual(0)
        expect(point.x).toBeLessThanOrEqual(100)
        expect(point.y).toBeGreaterThanOrEqual(0)
        expect(point.y).toBeLessThanOrEqual(100)
        expect(point.intensity).toBeGreaterThanOrEqual(0)
        expect(point.intensity).toBeLessThanOrEqual(1)
        expect(['emerald', 'cyan']).toContain(point.type)
      })
    })

    it('should include labels and descriptions', () => {
      const points = generateHeatmapFromAnalysis(mockAnalysis)

      points.forEach(point => {
        expect(point.label).toBeDefined()
        expect(point.description).toBeDefined()
      })
    })
  })

  describe('generateInsightsFromAnalysis', () => {
    const mockAnalysis: WebsiteAnalysisResult = {
      url: 'https://example.com',
      title: 'Example',
      description: 'Test description',
      structure: {
        pages: [],
        forms: [
          { id: 'form_1', type: 'contact', fields: ['name', 'email'], hasValidation: true },
          { id: 'form_2', type: 'signup', fields: ['email', 'password'], hasValidation: true }
        ],
        navigation: {
          mainLinks: ['Home', 'Features', 'Pricing', 'About', 'Contact'],
          hasSearch: true,
          hasBreadcrumbs: false,
          depth: 3
        }
      },
      content: {
        topics: ['Features', 'Pricing', 'Integrations'],
        targetAudience: {
          primary: 'Product Managers',
          secondary: [],
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
    }

    it('should generate insights with valid structure', () => {
      const insights = generateInsightsFromAnalysis(mockAnalysis)

      expect(insights.length).toBeGreaterThan(0)
      insights.forEach(insight => {
        expect(insight.id).toBeDefined()
        expect(insight.title).toBeDefined()
        expect(insight.description).toBeDefined()
        expect(['high', 'medium', 'low']).toContain(insight.priority)
        expect(['navigation', 'content', 'conversion', 'design']).toContain(insight.category)
        expect(['high', 'medium', 'low']).toContain(insight.impact)
      })
    })

    it('should include navigation insight with link count', () => {
      const insights = generateInsightsFromAnalysis(mockAnalysis)
      const navInsight = insights.find(i => i.category === 'navigation')

      expect(navInsight).toBeDefined()
      expect(navInsight?.description).toContain('5')
    })
  })

  describe('performFullAnalysis', () => {
    it('should return complete analysis data', async () => {
      const result = await performFullAnalysis('https://example.com')

      expect(result.analysis).toBeDefined()
      expect(result.personas).toBeInstanceOf(Array)
      expect(result.metrics).toBeDefined()
      expect(result.heatmapPoints).toBeInstanceOf(Array)
      expect(result.insights).toBeInstanceOf(Array)
    })

    it('should call progress callback during full analysis', async () => {
      await performFullAnalysis('https://example.com', mockProgressCallback)

      expect(mockProgressCallback).toHaveBeenCalled()
    })

    it('should complete within 30 seconds', async () => {
      const startTime = Date.now()
      await performFullAnalysis('https://example.com')
      const duration = Date.now() - startTime

      expect(duration).toBeLessThan(30000)
    })
  })
})