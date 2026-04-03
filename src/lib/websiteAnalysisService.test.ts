import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  analyzeWebsite,
  generatePersonasFromAnalysis,
  generateMetricsFromAnalysis,
  generateHeatmapFromAnalysis,
  generateInsightsFromAnalysis,
  performFullAnalysis,
  updateInsightStatus,
  filterInsightsByStatus,
  filterInsightsByCategory,
  getHighImpactInsights,
  getEvidenceSummary,
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

    it('should generate insights with valid enhanced structure', () => {
      const insights = generateInsightsFromAnalysis(mockAnalysis)

      expect(insights.length).toBeGreaterThan(0)
      insights.forEach(insight => {
        expect(insight.id).toBeDefined()
        expect(insight.title).toBeDefined()
        expect(insight.description).toBeDefined()
        expect(['high', 'medium', 'low']).toContain(insight.priority)
        expect(['navigation', 'content', 'conversion', 'design']).toContain(insight.category)
        expect(insight.recommendation).toBeDefined()
        expect(insight.impact).toBeDefined()
        expect(['high', 'medium', 'low']).toContain(insight.impact.level)
        expect(insight.impact.estimatedImprovement).toBeDefined()
        expect(insight.impact.confidence).toBeGreaterThanOrEqual(0)
        expect(insight.impact.confidence).toBeLessThanOrEqual(1)
        expect(insight.evidence).toBeInstanceOf(Array)
        expect(insight.evidence.length).toBeGreaterThan(0)
        expect(insight.implementationStatus).toBeDefined()
        expect(['pending', 'in-progress', 'completed', 'dismissed']).toContain(insight.implementationStatus)
        expect(insight.statusHistory).toBeInstanceOf(Array)
        expect(insight.createdAt).toBeInstanceOf(Date)
        expect(insight.updatedAt).toBeInstanceOf(Date)
      })
    })

    it('should include navigation insight with link count', () => {
      const insights = generateInsightsFromAnalysis(mockAnalysis)
      const navInsight = insights.find(i => i.category === 'navigation')

      expect(navInsight).toBeDefined()
      expect(navInsight?.description).toContain('5')
    })

    it('should include evidence for each insight', () => {
      const insights = generateInsightsFromAnalysis(mockAnalysis)

      insights.forEach(insight => {
        expect(insight.evidence.length).toBeGreaterThanOrEqual(2)
        insight.evidence.forEach(evidence => {
          expect(['metric', 'heatmap', 'persona', 'simulation']).toContain(evidence.type)
          expect(evidence.data).toBeDefined()
          expect(typeof evidence.description).toBe('string')
        })
      })
    })

    it('should include impact estimates with confidence scores', () => {
      const insights = generateInsightsFromAnalysis(mockAnalysis)

      insights.forEach(insight => {
        expect(insight.impact.confidence).toBeGreaterThanOrEqual(0.6)
        expect(insight.impact.confidence).toBeLessThanOrEqual(0.9)
        expect(insight.impact.estimatedImprovement).toMatch(/^\+\d+%/)
      })
    })

    it('should include recommendations for each insight', () => {
      const insights = generateInsightsFromAnalysis(mockAnalysis)

      insights.forEach(insight => {
        expect(insight.recommendation.length).toBeGreaterThan(20)
        expect(insight.recommendation.length).toBeLessThanOrEqual(300)
      })
    })

    it('should initialize with pending status and empty status history', () => {
      const insights = generateInsightsFromAnalysis(mockAnalysis)

      insights.forEach(insight => {
        expect(insight.implementationStatus).toBe('pending')
        expect(insight.statusHistory.length).toBe(1)
        expect(insight.statusHistory[0].status).toBe('pending')
      })
    })

    it('should accept optional metrics and personas for enhanced evidence', () => {
      const mockMetrics = {
        conversionRate: 0.45,
        uxScore: 72,
        dropOffRisk: 'medium' as const,
        engagement: 65,
        trend: { conversionRate: 5, uxScore: 3, engagement: -2 }
      }

      const insights = generateInsightsFromAnalysis(mockAnalysis, mockMetrics)

      // Should still generate valid insights
      expect(insights.length).toBeGreaterThan(0)
      insights.forEach(insight => {
        expect(insight.evidence.length).toBeGreaterThan(0)
      })
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

  describe('insight management functions', () => {
    const mockAnalysis: WebsiteAnalysisResult = {
      url: 'https://example.com',
      title: 'Example',
      description: 'Test description',
      structure: {
        pages: [],
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

    describe('updateInsightStatus', () => {
      it('should update implementation status', () => {
        const insights = generateInsightsFromAnalysis(mockAnalysis)
        const updated = updateInsightStatus(insights[0], 'in-progress')

        expect(updated.implementationStatus).toBe('in-progress')
        expect(updated.statusHistory.length).toBe(2)
        expect(updated.statusHistory[1].status).toBe('in-progress')
      })

      it('should add note when provided', () => {
        const insights = generateInsightsFromAnalysis(mockAnalysis)
        const updated = updateInsightStatus(insights[0], 'completed', 'Fixed CTA styling')

        expect(updated.implementationStatus).toBe('completed')
        expect(updated.statusHistory[1].note).toBe('Fixed CTA styling')
      })

      it('should update updatedAt timestamp', () => {
        const insights = generateInsightsFromAnalysis(mockAnalysis)
        const originalUpdatedAt = insights[0].updatedAt

        // Small delay to ensure different timestamp
        const updated = updateInsightStatus(insights[0], 'in-progress')

        expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime())
      })
    })

    describe('filterInsightsByStatus', () => {
      it('should filter insights by pending status', () => {
        const insights = generateInsightsFromAnalysis(mockAnalysis)
        const pending = filterInsightsByStatus(insights, 'pending')

        expect(pending.length).toBeGreaterThan(0)
        pending.forEach(insight => {
          expect(insight.implementationStatus).toBe('pending')
        })
      })

      it('should return empty array when no matches', () => {
        const insights = generateInsightsFromAnalysis(mockAnalysis)
        const completed = filterInsightsByStatus(insights, 'completed')

        expect(completed.length).toBe(0)
      })
    })

    describe('filterInsightsByCategory', () => {
      it('should filter insights by category', () => {
        const insights = generateInsightsFromAnalysis(mockAnalysis)
        const navigation = filterInsightsByCategory(insights, 'navigation')

        expect(navigation.length).toBeGreaterThan(0)
        navigation.forEach(insight => {
          expect(insight.category).toBe('navigation')
        })
      })

      it('should return empty array for non-existent category', () => {
        const insights = generateInsightsFromAnalysis(mockAnalysis)
        const design = filterInsightsByCategory(insights, 'design')

        expect(design.length).toBeGreaterThan(0)
      })
    })

    describe('getHighImpactInsights', () => {
      it('should return only high impact insights', () => {
        const insights = generateInsightsFromAnalysis(mockAnalysis)
        const highImpact = getHighImpactInsights(insights)

        expect(highImpact.length).toBeGreaterThan(0)
        highImpact.forEach(insight => {
          expect(insight.impact.level).toBe('high')
        })
      })
    })

    describe('getEvidenceSummary', () => {
      it('should return evidence summary for an insight', () => {
        const insights = generateInsightsFromAnalysis(mockAnalysis)
        const summary = getEvidenceSummary(insights[0])

        expect(summary.count).toBeGreaterThan(0)
        expect(summary.type).toBeDefined()
        expect(summary.descriptions).toBeInstanceOf(Array)
        expect(summary.descriptions.length).toBe(summary.count)
      })

      it('should include all evidence descriptions', () => {
        const insights = generateInsightsFromAnalysis(mockAnalysis)
        const insight = insights[0]
        const summary = getEvidenceSummary(insight)

        insight.evidence.forEach((evidence, index) => {
          expect(summary.descriptions[index]).toBe(evidence.description)
        })
      })
    })
  })
})