import type { WebsiteAnalysis, PersonaProfile, AIInsight, HeatmapPoint, MetricsData } from '@/types'

// Realistic mock data for PersonaLab demo
export const mockAnalysis: WebsiteAnalysis = {
  id: 'analysis_001',
  url: 'https://example-saas.com',
  metrics: {
    conversionRate: 3.7,
    uxScore: 82,
    dropOffRisk: 'high',
    engagement: 68,
    trend: {
      conversionRate: 12,
      uxScore: 5,
      engagement: -3
    }
  },
  personas: [
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
      quote: 'I just wanted to know how much it costs, but had to dig through three pages.',
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
        'Integration steps not step-by-step',
        'Missing code examples'
      ],
      motivations: ['Integration ease', 'Developer experience', 'Reliability'],
      quote: 'As a PM, I need to show my engineering team the integration path. The docs are scattered.',
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
        'Documentation search not working',
        'Response times not documented'
      ],
      motivations: ['Performance', 'Clean API', 'Documentation quality'],
      quote: 'I tried searching for "authentication flow" but got zero results. That\'s a red flag.',
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
    },
    {
      id: 'persona_4',
      name: 'David Sterling',
      role: 'Enterprise Executive',
      goal: 'Verify security and compliance',
      painPoints: [
        'Missing SOC2 compliance badge',
        'No enterprise pricing tier visible',
        'Terms of Service hard to read'
      ],
      motivations: ['Compliance', 'Risk mitigation', 'Legal clarity'],
      quote: 'I can\'t recommend this to our procurement team without seeing their security posture upfront.',
      conversionLikelihood: 0.45,
      behaviorPattern: {
        browsingStyle: 'reader',
        decisionSpeed: 'deliberate',
        riskTolerance: 0.3,
        priceSensitivity: 0.2
      },
      demographics: {
        age: 52,
        gender: 'male',
        location: 'London',
        techSavviness: 60
      }
    }
  ],
  heatmapPoints: [
    {
      id: 'heatmap_1',
      x: 45,
      y: 35,
      intensity: 0.9,
      type: 'emerald',
      label: 'Primary CTA',
      description: 'Strong engagement with main call-to-action button'
    },
    {
      id: 'heatmap_2',
      x: 72,
      y: 28,
      intensity: 0.7,
      type: 'cyan',
      label: 'Pricing Toggle',
      description: 'Users exploring monthly vs annual pricing'
    },
    {
      id: 'heatmap_3',
      x: 25,
      y: 55,
      intensity: 0.5,
      type: 'cyan',
      label: 'Navigation',
      description: 'Decision fatigue at main navigation'
    },
    {
      id: 'heatmap_4',
      x: 58,
      y: 62,
      intensity: 0.3,
      type: 'emerald',
      label: 'Feature List',
      description: 'Moderate interest in feature descriptions'
    },
    {
      id: 'heatmap_5',
      x: 82,
      y: 45,
      intensity: 0.4,
      type: 'cyan',
      label: 'Footer',
      description: 'Users looking for contact/support info'
    },
    {
      id: 'heatmap_6',
      x: 15,
      y: 12,
      intensity: 0.6,
      type: 'emerald',
      label: 'Logo/Home',
      description: 'Orientation point for lost navigators'
    },
    {
      id: 'heatmap_7',
      x: 65,
      y: 85,
      intensity: 0.8,
      type: 'cyan',
      label: 'Support Chat',
      description: 'Conversion friction manifested as help requests'
    },
    {
      id: 'heatmap_8',
      x: 35,
      y: 22,
      intensity: 0.2,
      type: 'emerald',
      label: 'Blog Sidebar',
      description: 'Low-intent exploration zone'
    }
  ],
  insights: [
    {
      id: 'insight_1',
      title: 'CTA lacks visual hierarchy',
      description: 'Primary call-to-action blends with secondary actions, reducing click-through rate by estimated 23%',
      priority: 'high',
      category: 'design',
      recommendation: 'Use contrasting colors and larger size for primary CTA. Consider adding a subtle shadow or glow effect to make it stand out.',
      impact: {
        level: 'high',
        estimatedImprovement: '+23% CTR improvement',
        confidence: 0.85
      },
      evidence: [
        {
          type: 'heatmap',
          data: { x: 45, y: 35, intensity: 0.9, label: 'Primary CTA' },
          description: 'Heatmap shows 90% intensity on CTA area'
        },
        {
          type: 'metric',
          data: { name: 'conversionRate', value: 0.45 },
          description: 'Current conversion rate suggests room for improvement'
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
      description: 'Users encounter 7 navigation options before reaching pricing, causing 34% to abandon',
      priority: 'high',
      category: 'navigation',
      recommendation: 'Reduce main navigation to 5 items or less. Use mega-menu for less critical links.',
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
        },
        {
          type: 'heatmap',
          data: { x: 72, y: 28, intensity: 0.7, label: 'Navigation' },
          description: 'Heatmap shows users exploring navigation extensively'
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
      description: 'Users must scroll past 3 sections before seeing pricing, increasing bounce rate',
      priority: 'medium',
      category: 'conversion',
      recommendation: 'Add pricing link to main navigation and consider sticky header with pricing CTA.',
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
        },
        {
          type: 'persona',
          data: { personasAffected: 3, types: ['fast', 'scanner'] },
          description: '3 personas report difficulty finding pricing information'
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
      description: 'Headline doesn\'t communicate core benefit, causing 28% to leave within 5 seconds',
      priority: 'medium',
      category: 'content',
      recommendation: 'Craft a clear, benefit-focused headline with supporting subheadline.',
      impact: {
        level: 'medium',
        estimatedImprovement: '+12% engagement improvement',
        confidence: 0.68
      },
      evidence: [
        {
          type: 'heatmap',
          data: { x: 50, y: 25, intensity: 0.4, label: 'Hero' },
          description: 'Low 40% intensity on hero section indicates disengagement'
        },
        {
          type: 'metric',
          data: { name: 'uxScore', value: 68 },
          description: 'UX score indicates hero section could be more compelling'
        }
      ],
      implementationStatus: 'pending',
      statusHistory: [{ status: 'pending', changedAt: new Date() }],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  frictionPoints: [
    'Pricing not immediately visible in navigation',
    'Feature comparison requires multiple clicks',
    'No clear social proof or testimonials visible',
    'Documentation search returns no results',
    'Missing dark mode affects developer perception'
  ],
  summary: 'Users hesitate before first action due to unclear value proposition and navigation complexity. Pricing visibility is the primary friction point, with 67% of personas reporting difficulty finding cost information. Technical users show lower conversion due to missing documentation search functionality.',
  structure: {
    pages: [
      {
        url: 'https://example-saas.com',
        title: 'Home',
        elements: ['Hero Section', 'Navigation', 'Features Grid', 'CTA Button', 'Footer'],
        ctaElements: ['Get Started Button', 'Start Free Trial', 'Request Demo'],
        formElements: ['Email Input', 'Sign Up Form'],
        navigationElements: ['Home', 'Features', 'Pricing', 'Docs', 'About']
      },
      {
        url: 'https://example-saas.com/pricing',
        title: 'Pricing',
        elements: ['Pricing Cards', 'Toggle Switch', 'FAQ Section', 'CTA Buttons'],
        ctaElements: ['Choose Plan', 'Start Free Trial'],
        formElements: [],
        navigationElements: ['Monthly', 'Yearly']
      }
    ],
    navigation: {
      mainLinks: ['Home', 'Features', 'Pricing', 'Docs', 'About'],
      footerLinks: ['Privacy', 'Terms', 'Contact', 'Twitter', 'GitHub']
    },
    forms: [
      {
        type: 'signup',
        fields: ['email', 'password', 'name']
      },
      {
        type: 'contact',
        fields: ['name', 'email', 'message']
      }
    ]
  }
}

export const simulateAuth = async (email: string): Promise<{ user: { id: string; email: string; name: string; createdAt: Date }; token: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Return mock user data
  return {
    user: {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      createdAt: new Date()
    },
    token: 'mock_jwt_' + Math.random().toString(36).substr(2, 9)
  }
}