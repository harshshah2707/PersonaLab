import type { 
  MetricsData, 
  HistoricalMetrics, 
  HistoricalMetricPoint,
  TimeRange,
  METRICS_BOUNDS,
  MetricsCalculationConfig,
  SimulationResult
} from '@/types'
import { TIME_RANGES, METRICS_BOUNDS } from '@/types'

// Validation functions for metric bounds
export function validateConversionRate(value: number): boolean {
  return value >= METRICS_BOUNDS.minConversionRate && value <= METRICS_BOUNDS.maxConversionRate
}

export function validateUxScore(value: number): boolean {
  return value >= METRICS_BOUNDS.minUxScore && value <= METRICS_BOUNDS.maxUxScore
}

export function validateEngagement(value: number): boolean {
  return value >= METRICS_BOUNDS.minEngagement && value <= METRICS_BOUNDS.maxEngagement
}

export function validateAllMetrics(metrics: Partial<MetricsData>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (metrics.conversionRate !== undefined && !validateConversionRate(metrics.conversionRate)) {
    errors.push(`Conversion rate must be between ${METRICS_BOUNDS.minConversionRate} and ${METRICS_BOUNDS.maxConversionRate}`)
  }
  
  if (metrics.uxScore !== undefined && !validateUxScore(metrics.uxScore)) {
    errors.push(`UX score must be between ${METRICS_BOUNDS.minUxScore} and ${METRICS_BOUNDS.maxUxScore}`)
  }
  
  if (metrics.engagement !== undefined && !validateEngagement(metrics.engagement)) {
    errors.push(`Engagement must be between ${METRICS_BOUNDS.minEngagement} and ${METRICS_BOUNDS.maxEngagement}`)
  }
  
  return { valid: errors.length === 0, errors }
}

// Clamping functions to ensure values stay within bounds
export function clampConversionRate(value: number): number {
  return Math.max(METRICS_BOUNDS.minConversionRate, Math.min(METRICS_BOUNDS.maxConversionRate, value))
}

export function clampUxScore(value: number): number {
  return Math.max(METRICS_BOUNDS.minUxScore, Math.min(METRICS_BOUNDS.maxUxScore, value))
}

export function clampEngagement(value: number): number {
  return Math.max(METRICS_BOUNDS.minEngagement, Math.min(METRICS_BOUNDS.maxEngagement, value))
}

// Calculate metrics from simulation results
export function calculateMetricsFromSimulations(results: SimulationResult[]): MetricsData {
  if (results.length === 0) {
    return {
      conversionRate: 0,
      uxScore: 0,
      dropOffRisk: 'high',
      engagement: 0,
      trend: {
        conversionRate: 0,
        uxScore: 0,
        engagement: 0
      }
    }
  }

  const convertedCount = results.filter(r => r.converted).length
  const conversionRate = clampConversionRate(convertedCount / results.length)
  
  const avgEngagement = clampEngagement(
    results.reduce((sum, r) => sum + r.engagementScore, 0) / results.length
  )
  
  // Calculate UX score based on engagement and conversion
  const uxScore = clampUxScore(
    (avgEngagement * 0.4 + conversionRate * 100 * 0.6)
  )
  
  // Determine drop-off risk based on conversion rate
  let dropOffRisk: 'low' | 'medium' | 'high'
  if (conversionRate >= 0.05) {
    dropOffRisk = 'low'
  } else if (conversionRate >= 0.02) {
    dropOffRisk = 'medium'
  } else {
    dropOffRisk = 'high'
  }

  return {
    conversionRate,
    uxScore,
    dropOffRisk,
    engagement: avgEngagement,
    trend: {
      conversionRate: 0,
      uxScore: 0,
      engagement: 0
    }
  }
}

// Generate historical metrics for a time range
export function generateHistoricalMetrics(
  currentMetrics: MetricsData,
  timeRange: TimeRange
): HistoricalMetrics {
  const rangeConfig = TIME_RANGES.find(r => r.value === timeRange)
  const hours = rangeConfig?.hours ?? Infinity
  
  const now = new Date()
  const points = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 12
  
  const generatePoints = (baseValue: number, variance: number): HistoricalMetricPoint[] => {
    const pointsArray: HistoricalMetricPoint[] = []
    
    for (let i = points - 1; i >= 0; i--) {
      const timestamp = new Date(now)
      
      if (timeRange === '24h') {
        timestamp.setHours(timestamp.getHours() - i)
      } else if (timeRange === '7d') {
        timestamp.setDate(timestamp.getDate() - i)
      } else if (timeRange === '30d') {
        timestamp.setDate(timestamp.getDate() - (i * 3))
      } else {
        timestamp.setDate(timestamp.getDate() - (i * 30))
      }
      
      // Add some variance to historical values
      const varianceFactor = (Math.random() - 0.5) * 2 * variance
      const value = baseValue * (1 + varianceFactor * 0.1)
      
      pointsArray.push({
        timestamp,
        value: Math.max(0, Math.min(1, value))
      })
    }
    
    return pointsArray
  }

  const generateDropOffRiskPoints = (): Array<{ timestamp: Date; value: 'low' | 'medium' | 'high' }> => {
    const pointsArray: Array<{ timestamp: Date; value: 'low' | 'medium' | 'high' }> = []
    const riskValues: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high']
    
    for (let i = points - 1; i >= 0; i--) {
      const timestamp = new Date(now)
      
      if (timeRange === '24h') {
        timestamp.setHours(timestamp.getHours() - i)
      } else if (timeRange === '7d') {
        timestamp.setDate(timestamp.getDate() - i)
      } else if (timeRange === '30d') {
        timestamp.setDate(timestamp.getDate() - (i * 3))
      } else {
        timestamp.setDate(timestamp.getDate() - (i * 30))
      }
      
      // Vary the risk level
      const riskIndex = Math.floor(Math.random() * 3)
      pointsArray.push({
        timestamp,
        value: riskValues[riskIndex]
      })
    }
    
    return pointsArray
  }

  return {
    timeRange,
    conversionRate: generatePoints(currentMetrics.conversionRate, 0.3),
    uxScore: generatePoints(currentMetrics.uxScore / 100, 0.2).map(p => ({
      ...p,
      value: p.value * 100
    })),
    engagement: generatePoints(currentMetrics.engagement / 100, 0.25).map(p => ({
      ...p,
      value: p.value * 100
    })),
    dropOffRisk: generateDropOffRiskPoints()
  }
}

// Calculate trend percentage between two values
export function calculateTrend(current: number, previous: number): number | null {
  if (!previous || previous === 0) return null
  return ((current - previous) / previous) * 100
}

// Get average value from historical points
export function getAverageFromHistorical(points: HistoricalMetricPoint[]): number {
  if (points.length === 0) return 0
  return points.reduce((sum, p) => sum + p.value, 0) / points.length
}

// Get latest value from historical points
export function getLatestFromHistorical(points: HistoricalMetricPoint[]): number {
  if (points.length === 0) return 0
  return points[points.length - 1].value
}

// Filter historical data by time range
export function filterHistoricalByTimeRange(
  historical: HistoricalMetrics,
  timeRange: TimeRange
): HistoricalMetrics {
  const rangeConfig = TIME_RANGES.find(r => r.value === timeRange)
  if (!rangeConfig || rangeConfig.hours === Infinity) {
    return historical
  }

  const cutoffTime = new Date(Date.now() - rangeConfig.hours * 60 * 60 * 1000)

  const filterPoints = (points: HistoricalMetricPoint[]): HistoricalMetricPoint[] => {
    return points.filter(p => new Date(p.timestamp) >= cutoffTime)
  }

  const filterRiskPoints = (
    points: Array<{ timestamp: Date; value: 'low' | 'medium' | 'high' }>
  ): Array<{ timestamp: Date; value: 'low' | 'medium' | 'high' }> => {
    return points.filter(p => new Date(p.timestamp) >= cutoffTime)
  }

  return {
    timeRange,
    conversionRate: filterPoints(historical.conversionRate),
    uxScore: filterPoints(historical.uxScore),
    engagement: filterPoints(historical.engagement),
    dropOffRisk: filterRiskPoints(historical.dropOffRisk)
  }
}

// Calculate performance comparison between time ranges
export function calculatePerformanceComparison(
  currentMetrics: MetricsData,
  previousMetrics: MetricsData | null
): {
  conversionRateChange: number | null
  uxScoreChange: number | null
  engagementChange: number | null
  overallTrend: 'improving' | 'declining' | 'stable'
} {
  const conversionRateChange = calculateTrend(
    currentMetrics.conversionRate,
    previousMetrics?.conversionRate ?? null
  )
  
  const uxScoreChange = calculateTrend(
    currentMetrics.uxScore,
    previousMetrics?.uxScore ?? null
  )
  
  const engagementChange = calculateTrend(
    currentMetrics.engagement,
    previousMetrics?.engagement ?? null
  )

  // Determine overall trend
  let improvingCount = 0
  let decliningCount = 0
  
  if (conversionRateChange !== null) {
    if (conversionRateChange > 0) improvingCount++
    else if (conversionRateChange < 0) decliningCount++
  }
  
  if (uxScoreChange !== null) {
    if (uxScoreChange > 0) improvingCount++
    else if (uxScoreChange < 0) decliningCount++
  }
  
  if (engagementChange !== null) {
    if (engagementChange > 0) improvingCount++
    else if (engagementChange < 0) decliningCount++
  }

  let overallTrend: 'improving' | 'declining' | 'stable'
  if (improvingCount > decliningCount) {
    overallTrend = 'improving'
  } else if (decliningCount > improvingCount) {
    overallTrend = 'declining'
  } else {
    overallTrend = 'stable'
  }

  return {
    conversionRateChange,
    uxScoreChange,
    engagementChange,
    overallTrend
  }
}

// Normalize metrics for display
export function normalizeConversionRate(value: number): number {
  return clampConversionRate(value)
}

export function normalizeUxScore(value: number): number {
  return clampUxScore(value)
}

export function normalizeEngagement(value: number): number {
  return clampEngagement(value)
}

// Format metrics for display
export function formatConversionRate(value: number): string {
  const normalized = normalizeConversionRate(value)
  return `${(normalized * 100).toFixed(1)}%`
}

export function formatUxScore(value: number): string {
  const normalized = normalizeUxScore(value)
  return `${Math.round(normalized)}`
}

export function formatEngagement(value: number): string {
  const normalized = normalizeEngagement(value)
  return `${normalized.toFixed(1)}%`
}