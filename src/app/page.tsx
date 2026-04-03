"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/ui/navbar'
import { ArrowRight, Loader2, Zap } from 'lucide-react'

export default function LandingPage() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) return
    
    setIsLoading(true)
    
    // Simulate analysis start
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-14">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            AI-Powered User Simulation
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Test your product before users do.
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Generate synthetic users that simulate real behavior. Predict conversions, identify friction, and optimize your UX — without waiting for traffic.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex gap-3">
              <Input
                type="url"
                placeholder="https://your-saas.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12 text-base"
                required
              />
              <Button 
                type="submit" 
                size="lg" 
                disabled={isLoading}
                className="h-12 px-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Run Simulation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </section>

        {/* Features Grid */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'AI Personas',
                description: 'Generate diverse synthetic users based on your target audience demographics and behavior patterns.'
              },
              {
                title: 'Behavior Simulation',
                description: 'Watch simulated users navigate your product, identifying friction points and conversion barriers.'
              },
              {
                title: 'Actionable Insights',
                description: 'Get specific, prioritized recommendations to improve your UX and conversion rates.'
              }
            ].map((feature, i) => (
              <Card key={i} className="p-6 hover:border-primary/30 transition-colors">
                <CardContent className="p-0">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}