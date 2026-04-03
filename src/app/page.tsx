"use client"

import { Navbar } from '@/components/ui/navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeatureShowcase } from '@/components/landing/FeatureShowcase'
import { StatsSection } from '@/components/landing/StatsSection'
import { CTASection } from '@/components/landing/CTASection'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-14">
        <HeroSection />
        <StatsSection />
        <FeatureShowcase />
        <CTASection />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 PersonaLab. AI-Powered Product Analytics.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}