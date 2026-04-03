"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navbar } from '@/components/ui/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { mockAnalysis } from '@/lib/mockData'
import type { PersonaProfile, AIInsight, HeatmapPoint } from '@/types'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Zap, 
  Users,
  ChevronRight,
  Lightbulb,
  MousePointer,
  Eye
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [analysis, setAnalysis] = useState<typeof mockAnalysis | null>(null)
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalysis(mockAnalysis)
      setIsAnalyzing(false)
      setSelectedPersona(mockAnalysis.personas[0]?.id || null)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-14">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Analysis of <span className="text-primary">{analysis?.url || 'https://example-saas.com'}</span>
              </p>
            </div>

            {isAnalyzing ? (
              <AnalysisLoadingSkeleton />
            ) : analysis ? (
              <>
                <MetricsRow analysis={analysis} />
                
                <div className="grid lg:grid-cols-3 gap-6 mt-8">
                  <div className="lg:col-span-2 space-y-6">
                    <HeatmapSection points={analysis.heatmapPoints} />
                    <PersonasSection 
                      personas={analysis.personas}
                      selectedId={selectedPersona}
                      onSelect={setSelectedPersona}
                    />
                  </div>

                  <div className="space-y-6">
                    <InsightsPanel insights={analysis.insights} />
                    <FrictionPointsPanel points={analysis.frictionPoints} />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

function MetricsRow({ analysis }: { analysis: typeof mockAnalysis }) {
  const { metrics } = analysis
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Conversion Rate"
        value={`${metrics.conversionRate}%`}
        trend={metrics.trend.conversionRate}
        icon={Target}
        color="emerald"
      />
      <MetricCard
        title="UX Score"
        value={`${metrics.uxScore}/100`}
        trend={metrics.trend.uxScore}
        icon={Zap}
        color="cyan"
      />
      <MetricCard
        title="Drop-off Risk"
        value={metrics.dropOffRisk}
        trend={null}
        icon={AlertTriangle}
        color={metrics.dropOffRisk === 'high' ? 'red' : 'yellow'}
      />
      <MetricCard
        title="Engagement"
        value={`${metrics.engagement}%`}
        trend={metrics.trend.engagement}
        icon={Eye}
        color="cyan"
      />
    </div>
  )
}

function MetricCard({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  color 
}: { 
  title: string
  value: string
  trend: number | null
  icon: React.ElementType
  color: 'emerald' | 'cyan' | 'red' | 'yellow'
}) {
  const isPositive = trend !== null && trend > 0
  
  return (
    <Card className="metric-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-sm text-muted-foreground font-medium">{title}</span>
          <div className={`p-2 rounded-lg ${
            color === 'emerald' ? 'bg-primary/10 text-primary' :
            color === 'cyan' ? 'bg-accent/10 text-accent' :
            color === 'red' ? 'bg-red-500/10 text-red-500' :
            'bg-yellow-500/10 text-yellow-500'
          }`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="metric-value text-foreground mb-1">{value}</div>
        {trend !== null && (
          <div className={`flex items-center gap-1 text-sm ${
            isPositive ? 'text-primary' : 'text-destructive'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(trend)}%</span>
            <span className="text-muted-foreground">vs last run</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function HeatmapSection({ points }: { points: HeatmapPoint[] }) {
  const [selectedPoint, setSelectedPoint] = useState<HeatmapPoint | null>(null)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <MousePointer className="w-5 h-5 text-primary" />
          AI Interaction Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative bg-card border border-border rounded-xl mx-6 mb-6 overflow-hidden" style={{ height: '400px' }}>
          <div className="absolute top-4 left-4 right-4 h-12 bg-secondary rounded-lg flex items-center px-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-muted" />
              <div className="w-3 h-3 rounded-full bg-muted" />
              <div className="w-20 h-3 rounded bg-muted/50" />
            </div>
          </div>
          
          <div className="absolute top-24 left-6 right-6 h-8 bg-secondary/50 rounded-lg" />
          <div className="absolute top-40 left-6 w-1/3 h-32 bg-secondary/30 rounded-lg" />
          <div className="absolute top-40 right-6 w-1/2 h-32 bg-secondary/30 rounded-lg" />
          <div className="absolute top-80 left-6 right-6 h-16 bg-secondary/50 rounded-lg" />
          
          {points.map((point) => (
            <button
              key={point.id}
              onClick={() => setSelectedPoint(point)}
              className={`absolute w-4 h-4 rounded-full transition-all duration-300 cursor-pointer ${
                point.type === 'emerald' 
                  ? 'bg-primary shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)]' 
                  : 'bg-accent shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)]'
              } ${selectedPoint?.id === point.id ? 'scale-150' : 'hover:scale-125'}`}
              style={{ 
                left: `${point.x}%`, 
                top: `${point.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
          
          {selectedPoint && (
            <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur border border-border rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${selectedPoint.type === 'emerald' ? 'bg-primary' : 'bg-accent'}`} />
                    <span className="font-medium text-foreground">{selectedPoint.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedPoint.description}</p>
                </div>
                <button 
                  onClick={() => setSelectedPoint(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-6 px-6 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-sm text-muted-foreground">Good Interaction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <span className="text-sm text-muted-foreground">Attention/Confusion</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PersonasSection({ 
  personas, 
  selectedId, 
  onSelect 
}: { 
  personas: PersonaProfile[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Synthetic Personas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {personas.map((persona) => (
            <div
              key={persona.id}
              onClick={() => onSelect(persona.id)}
              className={`persona-card ${selectedId === persona.id ? 'border-primary/50' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{persona.name}</h4>
                  <p className="text-sm text-muted-foreground">{persona.role}</p>
                </div>
                <Badge variant={persona.conversionLikelihood >= 0.7 ? 'emerald' : 'secondary'}>
                  {Math.round(persona.conversionLikelihood * 100)}% conv.
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Goal: </span>
                  <span className="text-foreground">{persona.goal}</span>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    "{persona.quote}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function InsightsPanel({ insights }: { insights: AIInsight[] }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-accent" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className={`insight-item ${
              insight.priority === 'high' ? 'border-l-red-500' :
              insight.priority === 'medium' ? 'border-l-yellow-500' :
              'border-l-muted'
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-medium text-foreground text-sm">{insight.title}</h4>
              <Badge 
                variant={insight.priority === 'high' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {insight.priority}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{insight.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function FrictionPointsPanel({ points }: { points: string[] }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Friction Points
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {points.map((point, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <ChevronRight className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">{point}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function AnalysisLoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="metric-card">
            <CardContent className="p-5">
              <Skeleton className="h-4 w-20 mb-4" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full rounded-xl" />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}