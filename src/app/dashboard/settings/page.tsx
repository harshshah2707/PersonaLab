"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, Brain, Zap, Shield, Save, User, Activity, Fingerprint } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const [analystName, setAnalystName] = useState('Senior Researcher')
  const [confidenceThreshold, setConfidenceThreshold] = useState(85)
  const [simulationSpeed, setSimulationSpeed] = useState(1.2)

  return (
    <div className="layout-container py-12 animate-in fade-in duration-1000">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Editorial Header */}
        <div className="space-y-6 text-center lg:text-left">
          <Badge variant="outline" className="bg-white border-sand px-4 py-1 uppercase font-black text-[10px] tracking-[0.3em] text-coffee/30 rounded-full">
             <Settings className="w-3 h-3 text-terracotta mr-2 inline" />
             System Configuration
          </Badge>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-coffee leading-[1.05]">
              Neural Lab <br/> <span className="text-terracotta italic font-normal">Environmental Overrides.</span>
            </h1>
            <p className="text-lg text-coffee/40 font-medium leading-relaxed max-w-2xl">
              Configure your institutional behavioral environment. Adjust neural thresholds, manage simulation identity, and optimize laboratory performance.
            </p>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           {/* Left Column - System Overrides */}
           <div className="lg:col-span-12 space-y-8">
              <div className="paper-card">
                 <div className="flex items-center justify-between mb-8 pb-6 border-b border-sand/40">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-coffee flex items-center justify-center text-white shadow-lg">
                          <Activity className="w-5 h-5" />
                       </div>
                       <div className="space-y-1">
                          <h3 className="text-xl font-bold tracking-tighter text-coffee">Neural Thresholds</h3>
                          <p className="text-[11px] text-coffee/30 font-black uppercase tracking-widest">Behavioral Sensitivity</p>
                       </div>
                    </div>
                    <Badge variant="outline" className="bg-forest/5 text-forest border-forest/10 px-3 uppercase text-[9px] font-black h-6">Calibrated v4.0</Badge>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee/60">Confidence Threshold</label>
                          <div className="relative pt-2">
                             <input 
                                type="range" 
                                min="10" 
                                max="100" 
                                value={confidenceThreshold}
                                onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                                className="w-full accent-terracotta h-1 rounded-full appearance-none bg-sand"
                             />
                             <div className="mt-4 flex justify-between items-center text-[11px] font-bold text-coffee/40 uppercase tracking-widest">
                                <span>Sensitive</span>
                                <span className="text-terracotta text-lg font-black tracking-tighter italic">{confidenceThreshold}%</span>
                                <span>Conservative</span>
                             </div>
                          </div>
                       </div>

                       <div className="p-6 rounded-2xl bg-cream/30 border border-sand italic text-[11px] text-coffee/50 leading-relaxed">
                          Sets the neural strictness for dropout simulation. Higher values yield more conservative behavior paths.
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee/60">Simulation Neural Speed</label>
                          <div className="relative pt-2">
                             <input 
                                type="range" 
                                min="0.1" 
                                max="5.0" 
                                step="0.1"
                                value={simulationSpeed}
                                onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                                className="w-full accent-coffee h-1 rounded-full appearance-none bg-sand"
                             />
                             <div className="mt-4 flex justify-between items-center text-[11px] font-bold text-coffee/40 uppercase tracking-widest">
                                <span>Analytical</span>
                                <span className="text-coffee text-lg font-black tracking-tighter italic">{simulationSpeed}x</span>
                                <span>Accelerated</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="paper-card">
                 <div className="flex items-center gap-4 mb-10 pb-6 border-b border-sand/40">
                    <div className="w-10 h-10 rounded-2xl bg-coffee flex items-center justify-center text-white shadow-lg">
                       <Fingerprint className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-xl font-bold tracking-tighter text-coffee">Laboratory Identity</h3>
                       <p className="text-[11px] text-coffee/30 font-black uppercase tracking-widest">Institutional Credentials</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee/60">Analyst Handle</label>
                       <Input 
                          value={analystName}
                          onChange={(e) => setAnalystName(e.target.value)}
                          className="h-12 rounded-xl bg-white border-sand focus:border-terracotta/20 font-bold text-coffee px-5"
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-coffee/60">Institutional ID</label>
                       <Input 
                          value="LAB-SYNTH-92-X"
                          disabled
                          className="h-12 rounded-xl bg-cream/40 border-sand text-coffee/20 font-black px-5 italic"
                       />
                    </div>
                 </div>

                 <div className="mt-12 flex items-center justify-between pt-8 border-t border-sand/40">
                    <div className="flex items-center gap-3 text-coffee/30">
                       <Shield className="w-4 h-4" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Research integrity verified by PersonaLab Node 4.0</span>
                    </div>
                    <Button className="h-12 px-8 rounded-2xl bg-coffee text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-coffee/10 border-4 border-white gap-3 flex">
                       <Save className="w-3.5 h-3.5" />
                       Save Environmental Context
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
