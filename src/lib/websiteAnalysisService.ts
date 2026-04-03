import type { PersonaProfile, AIInsight, HeatmapPoint, MetricsData, InsightEvidence, InsightImpact, InsightImplementationStatus } from '@/types'

// Website Analysis Types
export interface PageStructure {
  url: string
  title: string
  elements: string[]
  loadTime: number
}

export interface FormElement {
  id: string
  type: 'contact' | 'signup' | 'login' | 'search' | 'other'
  fields: string[]
  hasValidation: boolean
}

export interface NavigationStructure {
  mainLinks: string[]
  hasSearch: boolean
  hasBreadcrumbs: boolean
  depth: number
}

export interface TargetAudience {
  primary: string
  secondary: string[]
  industry: string
  companySize: 'startup' | 'smb' | 'enterprise' | 'mixed'
  technicalLevel: 'developer' | 'technical' | 'business' | 'mixed'
}

export interface WebsiteAnalysisResult {
  url: string
  title: string
  description: string
  structure: {
    pages: PageStructure[]
    forms: FormElement[]
    navigation: NavigationStructure
  }
  content: {
    topics: string[]
    targetAudience: TargetAudience
    language: string
  }
  metadata: {
    analyzedAt: Date
    processingTime: number
  }
}

// Progress callback type
export type ProgressCallback = (stage: string, progress: number) => void

// Mock data generators
const generateMockPages = (baseUrl: string): PageStructure[] => {
  const paths = ['', '/pricing', '/features', '/about', '/contact', '/docs']
  return paths.map((path, index) => ({
    url: `${baseUrl}${path}`,
    title: path === '' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2),
    elements: ['header', 'nav', 'main', 'footer', path === '/pricing' ? 'pricing-table' : 'content'],
    loadTime: Math.random() * 2 + 0.5
  }))
}

const generateMockForms = (): FormElement[] => [
  {
    id: 'form_contact',
    type: 'contact',
    fields: ['name', 'email', 'message'],
    hasValidation: true
  },
  {
    id: 'form_signup',
    type: 'signup',
    fields: ['email', 'password', 'confirm-password'],
    hasValidation: true
  },
  {
    id: 'form_search',
    type: 'search',
    fields: ['query'],
    hasValidation: false
  }
]

const generateMockNavigation = (): NavigationStructure => ({
  mainLinks: ['Home', 'Features', 'Pricing', 'About', 'Contact', 'Docs'],
  hasSearch: true,
  hasBreadcrumbs: false,
  depth: 3
})

const inferTargetAudience = (url: string): TargetAudience => {
  // Simulate AI inference based on URL patterns
  const domain = url.toLowerCase()
  
  if (domain.includes('dev') || domain.includes('github') || domain.includes('code')) {
    return {
      primary: 'Software Developers',
      secondary: ['Engineering Teams', 'Technical Leaders'],
      industry: 'Technology',
      companySize: 'mixed',
      technicalLevel: 'developer'
    }
  }
  
  if (domain.includes('shop') || domain.includes('store') || domain.includes('buy')) {
    return {
      primary: 'Online Shoppers',
      secondary: ['Retail Customers', 'Bargain Hunters'],
      industry: 'E-commerce',
      companySize: 'mixed',
      technicalLevel: 'business'
    }
  }
  
  // Default SaaS audience
  return {
    primary: 'Product Managers',
    secondary: ['Startup Founders', 'UX Designers', 'Marketing Teams'],
    industry: 'SaaS',
    companySize: 'startup',
    technicalLevel: 'mixed'
  }
}

const generateMockTopics = (url: string): string[] => {
  const domain = url.toLowerCase()
  
  if (domain.includes('dev') || domain.includes('github')) {
    return ['API Documentation', 'Code Examples', 'Integration Guides', 'Developer Tools']
  }
  
  if (domain.includes('shop') || domain.includes('store')) {
    return ['Products', 'Pricing', 'Reviews', 'Checkout', 'Shipping']
  }
  
  // Default SaaS topics
  return ['Product Features', 'Pricing Plans', 'Customer Success', 'Integrations', 'Security']
}

// Main analysis function with progress simulation
export async function analyzeWebsite(
  url: string,
  onProgress?: ProgressCallback
): Promise<WebsiteAnalysisResult> {
  const startTime = Date.now()
  
  // Stage 1: Initial validation (10%)
  onProgress?.('Validating URL', 10)
  await simulateDelay(300)
  
  // Stage 2: Scraping content (30%)
  onProgress?.('Scraping website content', 30)
  await simulateDelay(800)
  
  // Stage 3: Analyzing structure (50%)
  onProgress?.('Analyzing page structure', 50)
  await simulateDelay(600)
  
  // Stage 4: Processing content (70%)
  onProgress?.('Processing content analysis', 70)
  await simulateDelay(500)
  
  // Stage 5: Generating insights (90%)
  onProgress?.('Generating insights', 90)
  await simulateDelay(400)
  
  // Stage 6: Complete (100%)
  onProgress?.('Analysis complete', 100)
  
  const processingTime = Date.now() - startTime
  
  // Generate mock result
  const result: WebsiteAnalysisResult = {
    url,
    title: extractDomainName(url),
    description: `Professional ${inferTargetAudience(url).industry.toLowerCase()} platform offering comprehensive solutions for ${inferTargetAudience(url).primary.toLowerCase()}.`,
    structure: {
      pages: generateMockPages(url),
      forms: generateMockForms(),
      navigation: generateMockNavigation()
    },
    content: {
      topics: generateMockTopics(url),
      targetAudience: inferTargetAudience(url),
      language: 'en'
    },
    metadata: {
      analyzedAt: new Date(),
      processingTime
    }
  }
  
  return result
}

// Helper data for persona generation
const FIRST_NAMES = {
  female: ['Sarah', 'Emily', 'Jessica', 'Amanda', 'Rachel', 'Lauren', 'Ashley', 'Nicole', 'Stephanie', 'Michelle'],
  male: ['Michael', 'David', 'James', 'John', 'Robert', 'William', 'Daniel', 'Christopher', 'Matthew', 'Andrew'],
  neutral: ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Skyler', 'Drew']
}

const LAST_NAMES = ['Chen', 'Johnson', 'Rodriguez', 'Kim', 'Patel', 'Singh', 'Nguyen', 'Garcia', 'Williams', 'Brown']

const LOCATIONS = [
  { city: 'San Francisco', region: 'CA', country: 'USA' },
  { city: 'New York', region: 'NY', country: 'USA' },
  { city: 'Austin', region: 'TX', country: 'USA' },
  { city: 'Seattle', region: 'WA', country: 'USA' },
  { city: 'London', region: 'UK', country: 'UK' },
  { city: 'Toronto', region: 'ON', country: 'Canada' },
  { city: 'Berlin', region: 'DE', country: 'Germany' },
  { city: 'Sydney', region: 'NSW', country: 'Australia' },
  { city: 'Singapore', region: 'SG', country: 'Singapore' },
  { city: 'Amsterdam', region: 'NL', country: 'Netherlands' }
]

const ROLES_BY_AUDIENCE: Record<string, string[]> = {
  'Software Developers': ['Developer', 'Senior Developer', 'Tech Lead', 'DevOps Engineer', 'Full Stack Developer'],
  'Engineering Teams': ['Engineering Manager', 'Tech Lead', 'Architect', 'CTO', 'VP Engineering'],
  'Technical Leaders': ['CTO', 'VP Engineering', 'Technical Director', 'Chief Architect', 'Head of Engineering'],
  'Online Shoppers': ['Frequent Shopper', 'Bargain Hunter', 'Brand Loyalist', 'Research Buyer', 'Impulse Buyer'],
  'Retail Customers': ['Regular Customer', 'First-time Buyer', 'Loyal Customer', 'Seasonal Shopper', 'Bulk Buyer'],
  'Bargain Hunters': ['Deal Seeker', 'Price Comparison Shopper', 'Discount Hunter', 'Sale Shopper', 'Coupon User'],
  'Product Managers': ['Product Manager', 'Senior PM', 'Director of Product', 'VP Product', 'Head of Product'],
  'Startup Founders': ['Founder', 'Co-founder', 'CEO', 'CTO', 'Technical Co-founder'],
  'UX Designers': ['UX Designer', 'UI Designer', 'Product Designer', 'Senior Designer', 'Design Lead'],
  'Marketing Teams': ['Marketing Manager', 'Growth Lead', 'Content Strategist', 'Digital Marketer', 'CMO']
}

const PAIN_POINTS_BY_TOPIC: Record<string, string[]> = {
  'API Documentation': ['Documentation hard to find', 'Missing code examples', 'Outdated API references', 'No dark mode', 'Poor search functionality'],
  'Code Examples': ['Examples not working', 'No TypeScript support', 'Incomplete code snippets', 'Missing error handling', 'Outdated syntax'],
  'Integration Guides': ['Steps not clear', 'Missing prerequisites', 'Complex setup process', 'No troubleshooting', 'Version conflicts'],
  'Developer Tools': ['Slow performance', 'High memory usage', 'Limited features', 'Poor UX', 'Incompatible with workflow'],
  'Products': ['Limited product information', 'No size guide', 'Unclear pricing', 'Poor images', 'Missing reviews'],
  'Pricing': ['Hidden costs', 'No comparison', 'Complex plans', 'No free trial', 'Unclear value'],
  'Reviews': ['Fake reviews', 'No negative reviews', 'Old reviews only', 'Few reviews', 'Unverified buyers'],
  'Checkout': ['Complex checkout', 'Payment issues', 'Shipping costs high', 'No guest checkout', 'Form errors'],
  'Shipping': ['Slow delivery', 'High costs', 'No tracking', 'Limited options', 'International issues'],
  'Product Features': ['Features unclear', 'No demos', 'Missing capabilities', 'Complex UI', 'Performance issues'],
  'Pricing Plans': ['Plan differences unclear', 'No monthly option', 'Hidden limits', 'Confusing tiers', 'Price changes'],
  'Customer Success': ['No case studies', 'Poor support', 'Slow response', 'Limited resources', 'No onboarding'],
  'Integrations': ['Missing integrations', 'Complex setup', 'Sync issues', 'No API', 'Limited customization'],
  'Security': ['Unclear security', 'No compliance info', 'Data concerns', 'Privacy issues', 'No certifications']
}

const MOTIVATIONS_BY_AUDIENCE: Record<string, string[]> = {
  'Software Developers': ['Building efficient solutions', 'Learning new technologies', 'Solving complex problems', 'Automating workflows', 'Writing clean code'],
  'Engineering Teams': ['Scaling infrastructure', 'Reducing technical debt', 'Improving developer experience', 'Faster deployments', 'Better code quality'],
  'Technical Leaders': ['Strategic technology decisions', 'Team productivity', 'Innovation leadership', 'Risk mitigation', 'Technical excellence'],
  'Online Shoppers': ['Finding best deals', 'Quality products', 'Convenient shopping', 'Fast delivery', 'Trustworthy sellers'],
  'Retail Customers': ['Value for money', 'Product quality', 'Easy returns', 'Brand trust', 'Shopping experience'],
  'Bargain Hunters': ['Maximum savings', 'Finding discounts', 'Comparing prices', 'Getting deals', 'Budget optimization'],
  'Product Managers': ['Data-driven decisions', 'User satisfaction', 'Feature prioritization', 'Market fit', 'Growth metrics'],
  'Startup Founders': ['Rapid growth', 'Market validation', 'Resource efficiency', 'Investor appeal', 'Scalable solutions'],
  'UX Designers': ['Creating intuitive experiences', 'User research', 'Design consistency', 'Accessibility', 'Design systems'],
  'Marketing Teams': ['Lead generation', 'Brand awareness', 'Conversion optimization', 'Engagement metrics', 'Customer acquisition']
}

// Seeded random number generator for reproducible diversity
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

// Generate diverse demographics ensuring minimum diversity thresholds
function generateDemographics(index: number, seed: number): {
  age: number
  gender: string
  location: string
  techSavviness: number
} {
  const random = seededRandom(seed + index * 1000)
  
  // Ensure diverse age distribution across personas
  const ageRanges = [
    { min: 22, max: 28 },
    { min: 29, max: 35 },
    { min: 36,  max: 45 },
    { min: 46, max: 55 },
    { min: 25, max: 40 }
  ]
  const ageRange = ageRanges[index % ageRanges.length]
  const age = Math.floor(random() * (ageRange.max - ageRange.min + 1)) + ageRange.min
  
  // Ensure gender diversity across personas
  const genders = ['female', 'male', 'non-binary', 'female', 'male']
  const gender = genders[index % genders.length]
  
  // Ensure location diversity across personas
  const location = LOCATIONS[index % LOCATIONS.length]
  const locationString = `${location.city}, ${location.region}, ${location.country}`
  
  // Ensure tech savviness diversity (different levels)
  const techSavvinessLevels = [95, 72, 58, 85, 45]
  const techSavviness = techSavvinessLevels[index % techSavvinessLevels.length]
  
  return { age, gender, location: locationString, techSavviness }
}

// Generate behavior pattern based on demographics and website type
function generateBehaviorPattern(
  demographics: { age: number; techSavviness: number },
  targetAudience: string,
  index: number
): {
  browsingStyle: 'scanner' | 'reader' | 'explorer'
  decisionSpeed: 'fast' | 'moderate' | 'deliberate'
  riskTolerance: number
  priceSensitivity: number
} {
  // Browsing style influenced by tech savviness and age
  let browsingStyle: 'scanner' | 'reader' | 'explorer'
  if (demographics.techSavviness > 80) {
    browsingStyle = ['reader', 'explorer'][index % 2] as 'reader' | 'explorer'
  } else if (demographics.techSavviness > 50) {
    browsingStyle = ['scanner', 'reader'][index % 2] as 'scanner' | 'reader'
  } else {
    browsingStyle = 'scanner'
  }
  
  // Decision speed influenced by age and tech savviness
  let decisionSpeed: 'fast' | 'moderate' | 'deliberate'
  if (demographics.age < 30 && demographics.techSavviness > 70) {
    decisionSpeed = 'fast'
  } else if (demographics.age > 45) {
    decisionSpeed = 'deliberate'
  } else {
    decisionSpeed = 'moderate'
  }
  
  // Risk tolerance: higher for younger, tech-savvy users
  const riskTolerance = Math.round((demographics.techSavviness / 100) * 0.5 + (1 - demographics.age / 60) * 0.5 * 100) / 100
  
  // Price sensitivity varies by role
  const priceSensitivityMap: Record<string, number> = {
    'Developer': 0.6,
    'Manager': 0.4,
    'Founder': 0.3,
    'Shopper': 0.8,
    'Buyer': 0.7
  }
  const basePriceSensitivity = priceSensitivityMap[targetAudience.split(' ')[0]] || 0.5
  const priceSensitivity = Math.min(1, Math.max(0, basePriceSensitivity + (Math.random() * 0.2 - 0.1)))
  
  return { browsingStyle, decisionSpeed, riskTolerance, priceSensitivity: Math.round(priceSensitivity * 100) / 100 }
}

// Generate realistic name based on demographics
function generateName(demographics: { gender: string }, index: number): string {
  const namePool = demographics.gender === 'female' ? FIRST_NAMES.female :
                   demographics.gender === 'male' ? FIRST_NAMES.male :
                   FIRST_NAMES.neutral
  const firstName = namePool[index % namePool.length]
  const lastName = LAST_NAMES[index % LAST_NAMES.length]
  return `${firstName} ${lastName}`
}

// Calculate conversion likelihood based on behavior patterns and website analysis
function calculateConversionLikelihood(
  behaviorPattern: { browsingStyle: string; decisionSpeed: string; riskTolerance: number; priceSensitivity: number },
  demographics: { techSavviness: number },
  targetAudience: string
): number {
  let likelihood = 0.5
  
  // Browsing style impact
  if (behaviorPattern.browsingStyle === 'scanner') likelihood += 0.1
  if (behaviorPattern.browsingStyle === 'reader') likelihood += 0.05
  
  // Decision speed impact
  if (behaviorPattern.decisionSpeed === 'fast') likelihood += 0.15
  if (behaviorPattern.decisionSpeed === 'deliberate') likelihood -= 0.1
  
  // Risk tolerance impact
  likelihood += (behaviorPattern.riskTolerance - 0.5) * 0.2
  
  // Price sensitivity impact
  likelihood -= (behaviorPattern.priceSensitivity - 0.5) * 0.15
  
  // Tech savviness impact
  likelihood += (demographics.techSavviness - 70) / 100 * 0.1
  
  // Target audience adjustment
  if (targetAudience.includes('Developer') || targetAudience.includes('Technical')) {
    likelihood += 0.05
  }
  
  return Math.round(Math.min(0.95, Math.max(0.25, likelihood)) * 100) / 100
}

// Identify pain points based on website topics
function identifyPainPoints(topics: string[]): string[] {
  const painPoints: string[] = []
  const usedTopics = new Set<string>()
  
  for (let i = 0; i < 3; i++) {
    const topicIndex = (i + Math.floor(Math.random() * topics.length)) % topics.length
    const topic = topics[topicIndex]
    
    if (!usedTopics.has(topic)) {
      const topicPainPoints = PAIN_POINTS_BY_TOPIC[topic] || PAIN_POINTS_BY_TOPIC['Product Features']
      const painPoint = topicPainPoints[Math.floor(Math.random() * topicPainPoints.length)]
      painPoints.push(painPoint)
      usedTopics.add(topic)
    }
  }
  
  return painPoints
}

// Identify motivations based on target audience
function identifyMotivations(targetAudience: string, index: number): string[] {
  const motivations = MOTIVATIONS_BY_AUDIENCE[targetAudience] || MOTIVATIONS_BY_AUDIENCE['Product Managers']
  const shuffled = [...motivations].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

// Generate personas from website analysis
export function generatePersonasFromAnalysis(analysis: WebsiteAnalysisResult): PersonaProfile[] {
  const { targetAudience, topics } = analysis.content
  
  // Get roles for this audience type
  const roles = ROLES_BY_AUDIENCE[targetAudience.primary] || ROLES_BY_AUDIENCE['Product Managers']
  
  const personas: PersonaProfile[] = []
  
  for (let i = 0; i < 5; i++) {
    const demographics = generateDemographics(i, Date.now() + i)
    const behaviorPattern = generateBehaviorPattern(demographics, targetAudience.primary, i)
    const conversionLikelihood = calculateConversionLikelihood(behaviorPattern, demographics, targetAudience.primary)
    const painPoints = identifyPainPoints(topics)
    const motivations = identifyMotivations(targetAudience.primary, i)
    
    const browsingStyles: Array<'scanner' | 'reader' | 'explorer'> = ['scanner', 'reader', 'explorer', 'scanner', 'reader']
    const decisionSpeeds: Array<'fast' | 'moderate' | 'deliberate'> = ['fast', 'moderate', 'deliberate', 'fast', 'moderate']
    const riskTolerances = [0.75, 0.55, 0.35, 0.65, 0.45]
    const priceSensitivities = [0.6, 0.4, 0.3, 0.7, 0.5]
    
    const persona: PersonaProfile = {
      id: `persona_${i + 1}`,
      name: generateName(demographics, i),
      role: roles[i % roles.length],
      goal: `Quickly evaluate ${topics[i % topics.length].toLowerCase()} options`,
      painPoints,
      motivations,
      quote: getPersonaQuote(i, topics, targetAudience.primary),
      conversionLikelihood,
      behaviorPattern: {
        browsingStyle: browsingStyles[i],
        decisionSpeed: decisionSpeeds[i],
        riskTolerance: riskTolerances[i],
        priceSensitivity: priceSensitivities[i]
      },
      demographics: {
        age: demographics.age,
        gender: demographics.gender,
        location: demographics.location,
        techSavviness: demographics.techSavviness
      }
    }
    
    personas.push(persona)
  }
  
  return personas
}

// Generate contextual quote for persona
function getPersonaQuote(index: number, topics: string[], audience: string): string {
  const quotes = [
    `I just wanted to understand the ${topics[0]?.toLowerCase() || 'product'}, but had to dig through multiple pages.`,
    'As a decision maker, I need to see the complete picture before committing.',
    'I tried finding specific information but the navigation made it difficult.',
    `I want to quickly compare ${topics[1]?.toLowerCase() || 'options'} without reading through everything.`,
    'I need clear pricing and value comparison to make the right choice for my team.'
  ]
  return quotes[index]
}

// Generate metrics from analysis
export function generateMetricsFromAnalysis(analysis: WebsiteAnalysisResult): MetricsData {
  const avgLoadTime = analysis.structure.pages.reduce((sum, p) => sum + p.loadTime, 0) / analysis.structure.pages.length
  
  // Simulate metrics based on website characteristics
  const uxScore = Math.round(100 - (avgLoadTime * 10) - (analysis.structure.navigation.depth * 3))
  const conversionRate = Math.round((0.65 - avgLoadTime * 0.05) * 100) / 100
  
  return {
    conversionRate,
    uxScore: Math.max(0, Math.min(100, uxScore)),
    dropOffRisk: avgLoadTime > 1.5 ? 'high' : avgLoadTime > 1 ? 'medium' : 'low',
    engagement: Math.round(70 - avgLoadTime * 5),
    trend: {
      conversionRate: Math.round((Math.random() * 20 - 5) * 10) / 10,
      uxScore: Math.round((Math.random() * 10 - 3) * 10) / 10,
      engagement: Math.round((Math.random() * 10 - 5) * 10) / 10
    }
  }
}

// Generate heatmap points from analysis
export function generateHeatmapFromAnalysis(analysis: WebsiteAnalysisResult): HeatmapPoint[] {
  return [
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
      label: 'Navigation',
      description: 'Users exploring main navigation options'
    },
    {
      id: 'heatmap_3',
      x: 25,
      y: 55,
      intensity: 0.5,
      type: 'cyan',
      label: 'Feature List',
      description: 'Moderate interest in feature descriptions'
    },
    {
      id: 'heatmap_4',
      x: 58,
      y: 62,
      intensity: 0.3,
      type: 'emerald',
      label: 'Pricing Section',
      description: 'High attention to pricing information'
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
  ]
}

// Generate AI insights from analysis with evidence linking and impact estimates
export function generateInsightsFromAnalysis(
  analysis: WebsiteAnalysisResult,
  metrics?: MetricsData,
  personas?: PersonaProfile[],
  heatmapPoints?: HeatmapPoint[]
): AIInsight[] {
  const now = new Date()
  const navLinkCount = analysis.structure.navigation.mainLinks.length
  const formCount = analysis.structure.forms.length
  const avgLoadTime = analysis.structure.pages.reduce((sum, p) => sum + p.loadTime, 0) / analysis.structure.pages.length

  const insights: AIInsight[] = [
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
          description: 'Heatmap shows 90% intensity on CTA area, indicating users are finding it but not engaging optimally'
        },
        {
          type: 'metric',
          data: { name: 'conversionRate', value: metrics?.conversionRate || 0.45 },
          description: 'Current conversion rate suggests room for improvement in CTA effectiveness'
        },
        {
          type: 'persona',
          data: { personasAffected: 3, types: ['scanner', 'reader'] },
          description: '3 personas (scanners and readers) particularly affected by unclear visual hierarchy'
        }
      ],
      implementationStatus: 'pending',
      statusHistory: [{ status: 'pending', changedAt: now }],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'insight_2',
      title: 'Navigation creates decision fatigue',
      description: `Users encounter ${navLinkCount} navigation options before reaching key content, causing potential abandonment`,
      priority: 'high',
      category: 'navigation',
      recommendation: 'Reduce main navigation to 5 items or less. Use mega-menu or secondary navigation for less critical links.',
      impact: {
        level: 'high',
        estimatedImprovement: '+15% reduction in bounce rate',
        confidence: 0.78
      },
      evidence: [
        {
          type: 'metric',
          data: { name: 'dropOffRisk', value: avgLoadTime > 1.5 ? 'high' : 'medium' },
          description: `Drop-off risk is ${avgLoadTime > 1.5 ? 'high' : 'medium'} due to navigation complexity`
        },
        {
          type: 'heatmap',
          data: { x: 72, y: 28, intensity: 0.7, label: 'Navigation' },
          description: 'Heatmap shows users exploring navigation extensively, indicating difficulty finding direct paths'
        },
        {
          type: 'persona',
          data: { personasAffected: 4, types: ['fast', 'moderate'] },
          description: '4 personas with fast/moderate decision speed report navigation overwhelm'
        }
      ],
      implementationStatus: 'pending',
      statusHistory: [{ status: 'pending', changedAt: now }],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'insight_3',
      title: 'Form optimization needed',
      description: `${formCount} forms detected - consider reducing fields to improve conversion`,
      priority: 'medium',
      category: 'conversion',
      recommendation: 'Reduce form fields to essential items only. Consider progressive profiling or multi-step forms.',
      impact: {
        level: 'medium',
        estimatedImprovement: '+18% form completion rate',
        confidence: 0.72
      },
      evidence: [
        {
          type: 'metric',
          data: { name: 'engagement', value: metrics?.engagement || 65 },
          description: 'Current engagement score suggests form friction is impacting user experience'
        },
        {
          type: 'persona',
          data: { personasAffected: 2, types: ['scanner'] },
          description: 'Scanner personas particularly sensitive to form length, 2 personas cite this as pain point'
        },
        {
          type: 'simulation',
          data: { formAbandonRate: 0.35, estimatedRecovery: 0.18 },
          description: 'Behavior simulation estimates 35% form abandonment, potential 18% recovery with optimization'
        }
      ],
      implementationStatus: 'pending',
      statusHistory: [{ status: 'pending', changedAt: now }],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'insight_4',
      title: 'Content structure opportunity',
      description: `Topics like ${analysis.content.topics.slice(0, 2).join(' and ')} could be more prominently featured`,
      priority: 'medium',
      category: 'content',
      recommendation: 'Create dedicated sections or cards for key topics. Use visual hierarchy to guide users to priority content.',
      impact: {
        level: 'medium',
        estimatedImprovement: '+12% content engagement',
        confidence: 0.68
      },
      evidence: [
        {
          type: 'heatmap',
          data: { x: 25, y: 55, intensity: 0.5, label: 'Feature List' },
          description: 'Moderate 50% intensity on feature content suggests users are interested but engagement could be higher'
        },
        {
          type: 'metric',
          data: { name: 'uxScore', value: metrics?.uxScore || 72 },
          description: `UX score of ${metrics?.uxScore || 72} indicates content discoverability could be improved`
        },
        {
          type: 'persona',
          data: { personasAffected: 3, types: ['reader', 'explorer'] },
          description: '3 personas (readers and explorers) would benefit from better content organization'
        }
      ],
      implementationStatus: 'pending',
      statusHistory: [{ status: 'pending', changedAt: now }],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'insight_5',
      title: 'Page load time affecting user retention',
      description: `Average page load time is ${avgLoadTime.toFixed(2)}s, which may impact conversion rates`,
      priority: avgLoadTime > 2 ? 'high' : avgLoadTime > 1.5 ? 'medium' : 'low',
      category: 'conversion',
      recommendation: 'Optimize images, enable compression, and consider lazy loading for below-the-fold content.',
      impact: {
        level: avgLoadTime > 2 ? 'high' : avgLoadTime > 1.5 ? 'medium' : 'low',
        estimatedImprovement: avgLoadTime > 2 ? '+25% faster engagement' : '+10% faster engagement',
        confidence: 0.82
      },
      evidence: [
        {
          type: 'metric',
          data: { name: 'avgLoadTime', value: avgLoadTime },
          description: `Average load time of ${avgLoadTime.toFixed(2)}s exceeds optimal threshold of 1.5s`
        },
        {
          type: 'metric',
          data: { name: 'dropOffRisk', value: avgLoadTime > 1.5 ? 'high' : 'medium' },
          description: `Drop-off risk elevated to ${avgLoadTime > 1.5 ? 'high' : 'medium'} due to load time`
        },
        {
          type: 'persona',
          data: { personasAffected: 5, types: ['fast', 'scanner'] },
          description: 'All 5 personas affected, especially fast decision-makers and scanners'
        }
      ],
      implementationStatus: 'pending',
      statusHistory: [{ status: 'pending', changedAt: now }],
      createdAt: now,
      updatedAt: now
    }
  ]

  return insights
}

// Helper functions
function simulateDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function extractDomainName(url: string): string {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace('www.', '')
    return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)
  } catch {
    return 'Website'
  }
}

// Helper function to update insight implementation status
export function updateInsightStatus(
  insight: AIInsight,
  newStatus: InsightImplementationStatus,
  note?: string
): AIInsight {
  const now = new Date()
  return {
    ...insight,
    implementationStatus: newStatus,
    statusHistory: [
      ...insight.statusHistory,
      { status: newStatus, changedAt: now, note }
    ],
    updatedAt: now
  }
}

// Helper function to get insights by implementation status
export function filterInsightsByStatus(
  insights: AIInsight[],
  status: InsightImplementationStatus
): AIInsight[] {
  return insights.filter(insight => insight.implementationStatus === status)
}

// Helper function to get insights by category
export function filterInsightsByCategory(
  insights: AIInsight[],
  category: AIInsight['category']
): AIInsight[] {
  return insights.filter(insight => insight.category === category)
}

// Helper function to get high-impact insights
export function getHighImpactInsights(insights: AIInsight[]): AIInsight[] {
  return insights.filter(insight => insight.impact.level === 'high')
}

// Helper function to get evidence summary for an insight
export function getEvidenceSummary(insight: AIInsight): {
  type: string
  count: number
  descriptions: string[]
} {
  const evidenceByType = insight.evidence.reduce((acc, ev) => {
    acc[ev.type] = (acc[ev.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    type: Object.keys(evidenceByType).join(', '),
    count: insight.evidence.length,
    descriptions: insight.evidence.map(e => e.description)
  }
}

// Export a complete analysis function that returns all data
export async function performFullAnalysis(
  url: string,
  onProgress?: ProgressCallback
): Promise<{
  analysis: WebsiteAnalysisResult
  personas: PersonaProfile[]
  metrics: MetricsData
  heatmapPoints: HeatmapPoint[]
  insights: AIInsight[]
}> {
  const analysis = await analyzeWebsite(url, onProgress)
  const metrics = generateMetricsFromAnalysis(analysis)
  const personas = generatePersonasFromAnalysis(analysis)
  const heatmapPoints = generateHeatmapFromAnalysis(analysis)
  
  return {
    analysis,
    personas,
    metrics,
    heatmapPoints,
    insights: generateInsightsFromAnalysis(analysis, metrics, personas, heatmapPoints)
  }
}