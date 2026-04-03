import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="glass-panel p-12 md:p-20 rounded-[3rem] border-white/10 shadow-2xl relative overflow-hidden">
          {/* Subtle Glows */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet/20 rounded-full blur-[80px]" />
          
          <div className="space-y-8 relative z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
              <Sparkles className="w-3 h-3 text-violet" />
              <span>Free for early adopters</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight premium-gradient-text leading-[1.1]">
              Ready to see your <br/> product through <span className="emerald-gradient-text">new eyes?</span>
            </h2>
            
            <p className="text-lg text-muted-foreground/80 max-w-xl mx-auto leading-relaxed">
              Don&apos;t just guess. Let AI personas tell you exactly what feels wrong about your product journey.
            </p>
            
            <div className="pt-4">
              <Link href="/login">
                <Button 
                  size="lg" 
                  className="h-14 px-10 rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                >
                  Analyze My Website Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="mt-4 text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] font-bold">
                No Credit Card Required • Instant Deployment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}