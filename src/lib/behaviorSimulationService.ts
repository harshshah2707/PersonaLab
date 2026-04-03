import type {
  PersonaProfile,
  WebsiteAnalysis,
  WebsiteAnalysisResult,
  SimulationResult,
  Interaction,
  UserState,
  SimulationConfig,
  WebsitePage
} from '@/types'

// Default simulation configuration
const DEFAULT_CONFIG: SimulationConfig = {
  maxInteractions: 50,
  maxDuration: 300000, // 5 minutes in ms
  conversionThreshold: 0.7,
  dropOffThreshold: 0.8
}

// Interaction weights based on element types
const ELEMENT_INTERACTION_WEIGHTS = {
  cta: { click: 0.8, hover: 0.3, scroll: 0.9 },
  navigation: { click: 0.7, hover: 0.4, scroll: 0.6 },
  form: { click: 0.3, hover: 0.5, scroll: 0.7, form: 0.6 },
  content: { click: 0.2, hover: 0.6, scroll: 0.8 },
  footer: { click: 0.1, hover: 0.2, scroll: 0.4 }
}

// Page types and their typical user behavior patterns
const PAGE_BEHAVIOR_PATTERNS = {
  landing: {
    avgInteractions: 8,
    avgDuration: 45000,
    conversionProbability: 0.15
  },
  pricing: {
    avgInteractions: 12,
    avgDuration: 90000,
    conversionProbability: 0.25
  },
  features: {
    avgInteractions: 10,
    avgDuration: 60000,
    conversionProbability: 0.1
  },
  contact: {
    avgInteractions: 6,
    avgDuration: 30000,
    conversionProbability: 0.3
  },
  about: {
    avgInteractions: 5,
    avgDuration: 25000,
    conversionProbability: 0.05
  },
  docs: {
    avgInteractions: 15,
    avgDuration: 120000,
    conversionProbability: 0.2
  }
}

// Initialize user state for simulation
function initializeUserState(persona: PersonaProfile, landingPage: string): UserState {
  return {
    currentPage: landingPage,
    isActive: true,
    frustration: 0,
    satisfaction: 0.5,
    timeOnPage: 0,
    scrollDepth: 0,
    formsStarted: 0,
    formsCompleted: 0
  }
}

// Determine element type based on element name
function getElementType(element: string): keyof typeof ELEMENT_INTERACTION_WEIGHTS {
  const lowerElement = element.toLowerCase()
  
  if (lowerElement.includes('button') || lowerElement.includes('cta') || lowerElement.includes('signup') || lowerElement.includes('get started')) {
    return 'cta'
  }
  if (lowerElement.includes('nav') || lowerElement.includes('menu') || lowerElement.includes('link')) {
    return 'navigation'
  }
  if (lowerElement.includes('form') || lowerElement.includes('input') || lowerElement.includes('field')) {
    return 'form'
  }
  if (lowerElement.includes('footer') || lowerElement.includes('copyright')) {
    return 'footer'
  }
  return 'content'
}

// Calculate interaction probability based on persona behavior pattern
function calculateInteractionProbability(
  persona: PersonaProfile,
  elementType: keyof typeof ELEMENT_INTERACTION_WEIGHTS,
  interactionType: 'click' | 'hover' | 'scroll' | 'form'
): number {
  const weights = ELEMENT_INTERACTION_WEIGHTS[elementType]
  let baseProbability = (weights as Record<string, number>)[interactionType] || 0.3
  
  // Adjust based on browsing style
  if (persona.behaviorPattern.browsingStyle === 'scanner') {
    baseProbability *= interactionType === 'scroll' ? 1.2 : 0.8
  } else if (persona.behaviorPattern.browsingStyle === 'reader') {
    baseProbability *= interactionType === 'hover' ? 1.3 : 0.9
  } else if (persona.behaviorPattern.browsingStyle === 'explorer') {
    baseProbability *= interactionType === 'click' ? 1.2 : 1.0
  }
  
  // Adjust based on decision speed
  if (persona.behaviorPattern.decisionSpeed === 'fast') {
    baseProbability *= interactionType === 'click' ? 1.3 : 0.7
  } else if (persona.behaviorPattern.decisionSpeed === 'deliberate') {
    baseProbability *= interactionType === 'click' ? 0.7 : 1.2
  }
  
  // Adjust based on tech savviness
  const techAdjustment = (persona.demographics.techSavviness - 50) / 100 * 0.3
  baseProbability *= (1 + techAdjustment)
  
  return Math.min(0.95, Math.max(0.05, baseProbability))
}

// Determine next action based on persona and current state
function determineNextAction(
  persona: PersonaProfile,
  currentPage: WebsitePage,
  userState: UserState,
  previousInteractions: Interaction[]
): Interaction | null {
  // Check if user should exit based on frustration
  if (userState.frustration >= 0.9) {
    return null
  }
  
  // Check if max interactions reached
  if (previousInteractions.length >= DEFAULT_CONFIG.maxInteractions) {
    return null
  }
  
  // Determine available elements on current page
  const allElements = [
    ...currentPage.ctaElements.map(e => ({ element: e, type: 'cta' as const })),
    ...currentPage.navigationElements.map(e => ({ element: e, type: 'navigation' as const })),
    ...currentPage.formElements.map(e => ({ element: e, type: 'form' as const })),
    ...currentPage.elements.filter(e => !currentPage.ctaElements.includes(e) && 
      !currentPage.navigationElements.includes(e) && 
      !currentPage.formElements.includes(e)).map(e => ({ element: e, type: 'content' as const }))
  ]
  
  if (allElements.length === 0) {
    return null
  }
  
  // Select element based on persona behavior
  const elementSelections = allElements.map(({ element, type }) => {
    const clickProb = calculateInteractionProbability(persona, type, 'click')
    const hoverProb = calculateInteractionProbability(persona, type, 'hover')
    const scrollProb = calculateInteractionProbability(persona, type, 'scroll')
    const formProb = type === 'form' ? calculateInteractionProbability(persona, type, 'form') : 0
    
    return {
      element,
      type,
      clickProb,
      hoverProb,
      scrollProb,
      formProb,
      combinedScore: clickProb * 2 + hoverProb * 0.5 + scrollProb * 0.3 + formProb * 1.5
    }
  })
  
  // Sort by combined score and select
  elementSelections.sort((a, b) => b.combinedScore - a.combinedScore)
  
  // Add some randomness based on risk tolerance
  const randomFactor = Math.random()
  const selectionIndex = randomFactor < persona.behaviorPattern.riskTolerance 
    ? Math.floor(Math.random() * Math.min(3, elementSelections.length))
    : 0
  const selected = elementSelections[selectionIndex]
  
  // Determine interaction type
  const interactionTypes: Array<'click' | 'hover' | 'scroll' | 'form'> = ['scroll', 'hover', 'click']
  if (selected.type === 'form') {
    interactionTypes.push('form')
  }
  
  // Weight interaction types
  const interactionWeights = interactionTypes.map(type => {
    switch (type) {
      case 'click': return selected.clickProb * 2
      case 'hover': return selected.hoverProb * 0.5
      case 'scroll': return selected.scrollProb * 0.3
      case 'form': return selected.formProb * 1.5
    }
  })
  
  const totalWeight = interactionWeights.reduce((sum, w) => sum + w, 0)
  let randomWeight = Math.random() * totalWeight
  let interactionType: 'click' | 'hover' | 'scroll' | 'form' = 'scroll'
  
  for (let i = 0; i < interactionTypes.length; i++) {
    randomWeight -= interactionWeights[i]
    if (randomWeight <= 0) {
      interactionType = interactionTypes[i]
      break
    }
  }
  
  // Determine if this causes navigation
  let targetPage: string | undefined
  if (interactionType === 'click' && selected.type === 'navigation') {
    // Simulate navigation to another page
    const navIndex = currentPage.navigationElements.indexOf(selected.element)
    targetPage = navIndex >= 0 ? `/page-${navIndex}` : currentPage.url
  } else if (interactionType === 'click' && selected.type === 'cta') {
    // CTA often leads to signup/signup
    targetPage = '/signup'
  }
  
  return {
    type: interactionType,
    element: selected.element,
    timestamp: Date.now(),
    duration: Math.floor(Math.random() * 5000) + 500,
    page: currentPage.url,
    targetPage
  }
}

// Update user state based on interaction
function updateUserState(
  userState: UserState,
  interaction: Interaction,
  persona: PersonaProfile
): UserState {
  const newState = { ...userState }
  
  // Update page and navigation
  if (interaction.targetPage) {
    newState.currentPage = interaction.targetPage
  }
  
  // Update time tracking
  newState.timeOnPage += interaction.duration || 1000
  
  // Update scroll depth
  if (interaction.type === 'scroll') {
    newState.scrollDepth = Math.min(100, newState.scrollDepth + Math.random() * 30)
  }
  
  // Update form tracking
  if (interaction.type === 'form') {
    newState.formsStarted += 1
  }
  
  // Update satisfaction based on interaction type
  const elementType = getElementType(interaction.element)
  
  if (interaction.type === 'click') {
    if (elementType === 'cta') {
      newState.satisfaction += 0.1
      newState.frustration = Math.max(0, newState.frustration - 0.05)
    } else if (elementType === 'navigation') {
      newState.satisfaction += 0.05
    }
  } else if (interaction.type === 'hover') {
    newState.satisfaction += 0.02
  } else if (interaction.type === 'scroll') {
    newState.satisfaction += 0.03
  }
  
  // Decrease satisfaction over time (boredom)
  newState.satisfaction = Math.max(0, newState.satisfaction - 0.01)
  
  // Increase frustration based on price sensitivity and lack of conversion
  if (elementType === 'cta' && interaction.type === 'click') {
    // User engaged with CTA - good sign
  } else if (newState.timeOnPage > 120000) { // 2 minutes on same page
    newState.frustration += 0.1
  }
  
  // Price-sensitive users get frustrated with pricing pages
  if (newState.currentPage.includes('pricing') && persona.behaviorPattern.priceSensitivity > 0.6) {
    newState.frustration += 0.05
  }
  
  // Check if user should become inactive
  if (newState.frustration >= DEFAULT_CONFIG.dropOffThreshold) {
    newState.isActive = false
  }
  
  // Check if user should exit based on behavior pattern
  if (persona.behaviorPattern.decisionSpeed === 'fast' && newState.timeOnPage > 180000) {
    newState.isActive = false
  }
  
  return newState
}

// Check if user has converted
function hasConverted(userState: UserState, interactions: Interaction[], config: SimulationConfig): boolean {
  // Check for form completion
  if (userState.formsCompleted >= 1) {
    return true
  }
  
  // Check for CTA clicks with signup navigation
  const signupClicks = interactions.filter(i => 
    i.type === 'click' && 
    (i.element.toLowerCase().includes('signup') || 
     i.element.toLowerCase().includes('get started') ||
     i.element.toLowerCase().includes('start free'))
  )
  
  if (signupClicks.length >= 1) {
    return true
  }
  
  // Check for high engagement with conversion
  const engagementScore = calculateEngagementScore(interactions, userState)
  if (engagementScore > config.conversionThreshold * 100) {
    return true
  }
  
  return false
}

// Identify drop-off point
function identifyDropOffPoint(interactions: Interaction[], userState: UserState): string | undefined {
  if (userState.isActive) {
    return undefined
  }
  
  if (interactions.length === 0) {
    return 'Bounced immediately - no interactions recorded'
  }
  
  const lastInteraction = interactions[interactions.length - 1]
  
  // Check for high frustration
  if (userState.frustration >= 0.9) {
    return `Frustrated at "${lastInteraction.element}" on ${lastInteraction.page}`
  }
  
  // Check for time-based exit
  if (userState.timeOnPage > 300000) {
    return `Timeout after ${Math.round(userState.timeOnPage / 60000)} minutes on ${lastInteraction.page}`
  }
  
  // Check for specific page drop-offs
  if (lastInteraction.page.includes('pricing')) {
    return `Left from pricing page at "${lastInteraction.element}" - possible price sensitivity issue`
  }
  
  if (lastInteraction.page.includes('contact') || lastInteraction.page.includes('signup')) {
    return `Form abandonment at "${lastInteraction.element}" - friction point detected`
  }
  
  // Generic drop-off
  return `Dropped off at "${lastInteraction.element}" on ${lastInteraction.page}`
}

// Calculate engagement score
function calculateEngagementScore(interactions: Interaction[], userState: UserState): number {
  if (interactions.length === 0) {
    return 0
  }
  
  // Base score from interaction count (max 40 points)
  const interactionScore = Math.min(40, interactions.length * 2)
  
  // Score from scroll depth (max 20 points)
  const scrollScore = (userState.scrollDepth / 100) * 20
  
  // Score from time spent (max 20 points, capped at 5 minutes)
  const timeScore = Math.min(20, (userState.timeOnPage / 300000) * 20)
  
  // Score from form engagement (max 10 points)
  const formScore = Math.min(10, userState.formsStarted * 5)
  
  // Bonus for CTA engagement (max 10 points)
  const ctaInteractions = interactions.filter(i => 
    i.type === 'click' && 
    (i.element.toLowerCase().includes('button') || 
     i.element.toLowerCase().includes('cta') ||
     i.element.toLowerCase().includes('signup'))
  )
  const ctaScore = Math.min(10, ctaInteractions.length * 5)
  
  return Math.round(interactionScore + scrollScore + timeScore + formScore + ctaScore)
}

// Convert website analysis to page structure
function convertToWebsitePage(analysis: WebsiteAnalysis | WebsiteAnalysisResult, pageUrl: string): WebsitePage {
  // Check if it's the extended analysis result (test mock)
  const structure = 'structure' in analysis ? analysis.structure : null
  if (structure && 'pages' in structure && structure.pages[0] && 'loadTime' in structure.pages[0]) {
    const result = analysis as WebsiteAnalysisResult
    const page = result.structure.pages.find(p => p.url === pageUrl) || result.structure.pages[0]
    
    return {
      url: page.url,
      title: page.title,
      elements: page.elements,
      ctaElements: ['Get Started', 'Sign Up', 'Start Free Trial'],
      formElements: result.structure.forms.flatMap(f => f.fields.map(field => `${f.type} - ${field}`)),
      navigationElements: result.structure.navigation.mainLinks
    }
  }
  
  // Standard WebsiteAnalysis
  const stdAnalysis = analysis as WebsiteAnalysis
  const stdStructure = stdAnalysis.structure
  const page = stdStructure?.pages.find(p => p.url === pageUrl) || stdStructure?.pages[0]
  
  if (!stdStructure || !page) {
    return {
      url: stdAnalysis.url,
      title: 'Page',
      elements: ['Hero', 'Navigation', 'Content', 'CTA'],
      ctaElements: ['Get Started'],
      formElements: [],
      navigationElements: ['Home', 'Features', 'Pricing']
    }
  }
  
  return {
    url: page.url,
    title: page.title,
    elements: page.elements,
    ctaElements: page.ctaElements,
    formElements: page.formElements,
    navigationElements: page.navigationElements
  }
}

// Main simulation function
export function simulateUserBehavior(
  persona: PersonaProfile,
  analysis: WebsiteAnalysis | WebsiteAnalysisResult,
  config: Partial<SimulationConfig> = {}
): SimulationResult {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  // Initialize simulation state
  const landingPage = analysis.structure?.pages[0]?.url || analysis.url
  const currentPageData = convertToWebsitePage(analysis, landingPage)
  let userState = initializeUserState(persona, landingPage)
  const interactions: Interaction[] = []
  const pagesVisited: string[] = [landingPage]
  const startTime = Date.now()
  
  // Simulation loop
  while (userState.isActive && interactions.length < finalConfig.maxInteractions) {
    const elapsedTime = Date.now() - startTime
    
    if (elapsedTime > finalConfig.maxDuration) {
      break
    }
    
    // Get current page data
    const currentPage = convertToWebsitePage(analysis, userState.currentPage)
    
    // Determine next action
    const interaction = determineNextAction(persona, currentPage, userState, interactions)
    
    if (!interaction) {
      break
    }
    
    // Record interaction
    interactions.push(interaction)
    
    // Track pages visited
    if (interaction.targetPage && !pagesVisited.includes(interaction.targetPage)) {
      pagesVisited.push(interaction.targetPage)
    }
    
    // Update user state
    userState = updateUserState(userState, interaction, persona)
  }
  
  // Calculate final metrics
  const converted = hasConverted(userState, interactions, finalConfig)
  const engagementScore = calculateEngagementScore(interactions, userState)
  const dropOffPoint = identifyDropOffPoint(interactions, userState)
  const totalDuration = Date.now() - startTime
  
  return {
    personaId: persona.id,
    interactions,
    converted,
    dropOffPoint,
    engagementScore,
    conversionLikelihood: persona.conversionLikelihood,
    totalDuration,
    pagesVisited,
    finalPage: userState.currentPage
  }
}

// Run simulations for multiple personas
export function runBehaviorSimulations(
  personas: PersonaProfile[],
  analysis: WebsiteAnalysis | WebsiteAnalysisResult,
  config?: Partial<SimulationConfig>
): SimulationResult[] {
  return personas.map(persona => simulateUserBehavior(persona, analysis, config))
}

// Calculate aggregate metrics from simulation results
export function calculateSimulationMetrics(results: SimulationResult[]): {
  conversionRate: number
  avgEngagement: number
  avgDuration: number
  dropOffPoints: Record<string, number>
  topDropOffElements: Array<{ element: string; count: number }>
} {
  if (results.length === 0) {
    return {
      conversionRate: 0,
      avgEngagement: 0,
      avgDuration: 0,
      dropOffPoints: {},
      topDropOffElements: []
    }
  }
  
  const converted = results.filter(r => r.converted).length
  const conversionRate = converted / results.length
  
  const avgEngagement = results.reduce((sum, r) => sum + r.engagementScore, 0) / results.length
  const avgDuration = results.reduce((sum, r) => sum + r.totalDuration, 0) / results.length
  
  // Analyze drop-off points
  const dropOffPoints: Record<string, number> = {}
  const dropOffElements: Record<string, number> = {}
  
  results.forEach(result => {
    if (result.dropOffPoint) {
      dropOffPoints[result.dropOffPoint] = (dropOffPoints[result.dropOffPoint] || 0) + 1
      
      // Extract element from drop-off point
      const elementMatch = result.dropOffPoint.match(/"([^"]+)"/)
      if (elementMatch) {
        const element = elementMatch[1]
        dropOffElements[element] = (dropOffElements[element] || 0) + 1
      }
    }
  })
  
  const topDropOffElements = Object.entries(dropOffElements)
    .map(([element, count]) => ({ element, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  
  return {
    conversionRate: Math.round(conversionRate * 100) / 100,
    avgEngagement: Math.round(avgEngagement),
    avgDuration: Math.round(avgDuration),
    dropOffPoints,
    topDropOffElements
  }
}