"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Brain, Globe, Target, Zap, Shield, HelpCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const docSections = [
  {
    title: 'Neural Logic Engine',
    description: 'Our proprietary behavioral engine that maps intuition clusters.',
    icon: Brain,
    content: [
      'Simulates high-fidelity human decision-making paths.',
      'Identifies cognitive friction in real-time DOM interactions.',
      'Neural traces use advanced psychographic profiling.'
    ]
  },
  {
    title: 'Interaction Spectrum',
    description: 'Understanding the thermal hierarchy of your product.',
    icon: Target,
    content: [
      'Thermal nodes visualize exactly where intuition breaks.',
      'Predictive mapping identifies bottlenecks before they occur.',
      'Clusters represent high-density drop-off locations.'
    ]
  },
  {
    title: 'Extraction Dynamics',
    description: 'How we interpret the laboratory environment.',
    icon: Globe,
    content: [
      'High-fidelity DOM extraction ensures neural parity.',
      'Auto-detects interactive elements and navigational lanes.',
      'Optimized for rapid institutional-grade audits.'
    ]
  },
  {
    title: 'Privacy Persistence',
    description: 'Research guidelines for sovereign behavioral data.',
    icon: Shield,
    content: [
      'Zero-biometric tracking – no PII required from real users.',
      'Synthetic entities protect real-world identity.',
      'Compliant with institutional research standards.'
    ]
  }
]

export default function DocumentationPage() {
  return (
    <div className="layout-container py-12 animate-in fade-in duration-1000">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Editorial Header */}
        <div className="space-y-6 text-center lg:text-left">
          <Badge variant="outline" className="bg-white border-sand px-4 py-1 uppercase font-black text-[10px] tracking-[0.3em] text-coffee/30 rounded-full">
             <HelpCircle className="w-3 h-3 text-terracotta mr-2 inline" />
             Laboratory Documentation
          </Badge>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-coffee leading-[1.05]">
              Neural Logic & <br/> <span className="text-terracotta italic font-normal">Strategic Architecture.</span>
            </h1>
            <p className="text-lg text-coffee/40 font-medium leading-relaxed max-w-2xl">
              An institutional guide to our behavioral simulation engine. Understand how we synthesize intuition, map friction, and deliver laboratory-grade insights.
            </p>
          </div>
        </div>

        {/* Documentation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {docSections.map((section, idx) => (
             <div key={idx} className="paper-card hover:translate-y-[-4px] transition-all duration-700 group">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 rounded-2xl bg-coffee flex items-center justify-center shadow-xl shadow-coffee/10 group-hover:rotate-6 transition-all">
                      <section.icon className="w-5 h-5 text-white" />
                   </div>
                   <h3 className="text-xl font-bold tracking-tighter text-coffee truncate">{section.title}</h3>
                </div>
                
                <p className="text-sm text-coffee/50 font-medium mb-8 leading-relaxed italic">
                   {section.description}
                </p>
                
                <div className="space-y-4 border-t border-sand/30 pt-6">
                   {section.content.map((point, k) => (
                     <div key={k} className="flex items-start gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-forest/40" />
                        <p className="text-[13px] font-bold text-coffee/70 leading-snug">{point}</p>
                     </div>
                   ))}
                </div>
                
                <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-coffee/20 group-hover:text-terracotta transition-colors">
                   <span>Learn Neural Methodology</span>
                   <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
                </div>
             </div>
           ))}
        </div>

        {/* Diagnostic Footer */}
        <div className="p-10 rounded-[3rem] bg-cream/30 border border-sand border-dashed text-center space-y-6">
           <div className="w-12 h-12 bg-white rounded-2xl border border-sand flex items-center justify-center mx-auto shadow-sm">
              <Zap className="w-5 h-5 text-terracotta" />
           </div>
           <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee/30">System Status</p>
              <h4 className="text-lg font-bold text-coffee tracking-tight">Version 2.1 – Structural Integrity Optimal</h4>
           </div>
           <p className="text-[11px] text-coffee/40 max-w-sm mx-auto leading-relaxed">
             Documentation updated regularly as neural logic evolves. Contact the behavioral lab for institutional overrides.
           </p>
        </div>
      </div>
    </div>
  )
}
