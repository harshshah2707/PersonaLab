import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden bg-oat border-t border-sand/30">
      {/* Refined Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-terracotta/5 rounded-full blur-[140px] pointer-events-none opacity-20 animate-float" />
      
      <div className="layout-container relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-12 md:p-16 rounded-[3rem] border border-sand shadow-[0_20px_60px_rgba(107,79,59,0.05)] relative overflow-hidden group transition-all duration-1000">
            {/* Ceramic Accent Glow */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-terracotta/5 rounded-full blur-[100px] group-hover:bg-terracotta/10 transition-all duration-1000" />
            
            <div className="space-y-10 relative z-20">
              <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-white border border-sand text-[10px] font-black uppercase tracking-[0.4em] text-coffee shadow-sm animate-in fade-in">
                 <div className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
                 <span>Strategic Behavioral Insight</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-coffee leading-[0.85] max-w-[12ch] mx-auto animate-in fade-in">
                Expose <span className="text-terracotta italic font-normal">human</span> pathways.
              </h2>
              
              <p className="text-lg md:text-xl text-coffee/50 max-w-xl mx-auto leading-relaxed animate-in fade-in">
                Join the data-driven product leaders. Deploy AI personas to expose friction and maximize conversion in seconds.
              </p>
              
              <div className="pt-8 animate-in fade-in">
                <Link href="/login">
                  <Button 
                    size="lg" 
                    className="h-16 px-12 rounded-2xl bg-coffee text-white hover:opacity-90 font-black text-xs uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-coffee/20 group"
                  >
                    Start Neural Audit
                    <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-1 transition-all" />
                  </Button>
                </Link>
                
                <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[10px] text-coffee/20 uppercase tracking-[0.3em] font-black">
                   <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                      <span>Instant Audit</span>
                   </div>
                   <div className="w-1 h-1 rounded-full bg-sand" />
                   <span>Zero Friction</span>
                   <div className="w-1 h-1 rounded-full bg-sand" />
                   <span>Lab Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}