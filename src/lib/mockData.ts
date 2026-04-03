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
    }
  ],
  insights: [
    {
      id: 'insight_1',
      title: 'CTA lacks visual hierarchy',
      description: 'Primary call-to-action blends with secondary actions, reducing click-through rate by estimated 23%',
      priority: 'high',
      category: 'design',
      impact: 'high'
    },
    {
      id: 'insight_2',
      title: 'Navigation creates decision fatigue',
      description: 'Users encounter 7 navigation options before reaching pricing, causing 34% to abandon',
      priority: 'high',
      category: 'navigation',
      impact: 'high'
    },
    {
      id: 'insight_3',
      title: 'Pricing visibility is delayed',
      description: 'Users must scroll past 3 sections before seeing pricing, increasing bounce rate',
      priority: 'medium',
      category: 'conversion',
      impact: 'medium'
    },
    {
      id: 'insight_4',
      title: 'Hero section unclear value proposition',
      description: 'Headline doesn\'t communicate core benefit, causing 28% to leave within 5 seconds',
      priority: 'medium',
      category: 'content',
      impact: 'medium'
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