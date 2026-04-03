"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Send, User, ChevronRight, AlertCircle, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PersonaProfile } from '@/types'

interface Message {
  role: 'persona' | 'user'
  text: string
  timestamp: Date
}

interface PersonaChatProps {
  persona: PersonaProfile
  onClose?: () => void
}

export function PersonaChat({ persona, onClose }: PersonaChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Initial Greeting from Persona
  useEffect(() => {
    setMessages([
      {
        role: 'persona',
        text: `Hey, I'm ${persona.name}. I saw your page but I didn't actually buy anything. Want to know why?`,
        timestamp: new Date()
      }
    ])
  }, [persona])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMsg: Message = {
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    // Simulate persona response based on their pain points and motivations
    setTimeout(() => {
      let response = ""
      const q = userMsg.text.toLowerCase()

      if (q.includes('why') || q.includes('convert') || q.includes('buy')) {
        response = `To be honest, ${persona.painPoints[0]}. I was looking for ${persona.goal}, but the interface felt ${persona.behaviorPattern.browsingStyle === 'scanner' ? 'cluttered' : 'confusing'}.`
      } else if (q.includes('price') || q.includes('cost')) {
        response = persona.behaviorPattern.priceSensitivity > 0.7 
          ? "It felt a bit expensive for what was offered. I'm very price-conscious." 
          : "Price wasn't the main issue, it was more about the value proposition."
      } else {
        response = `My goal is ${persona.goal}. If you could fix the ${persona.painPoints[1] || 'navigation'}, I'd be much more likely to return.`
      }

      setMessages(prev => [...prev, {
        role: 'persona',
        text: response,
        timestamp: new Date()
      }])
      setIsTyping(false)
    }, 1000)
  }

  return (
    <Card className="persona-chat border-white/10 bg-card/40 backdrop-blur-3xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
      <CardHeader className="border-b border-white/5 py-4 px-6 flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald/10 border border-emerald/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-emerald" />
          </div>
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-wider">{persona.name}</CardTitle>
            <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-red-500" />
              Non-Converter Archetype
            </CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={cn(
            "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
            msg.role === 'user' ? "flex-row-reverse" : ""
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
              msg.role === 'user' ? "bg-foreground border-foreground" : "bg-emerald/10 border-emerald/20"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-background" /> : <span className="text-[10px] font-black text-emerald">{persona.name[0]}</span>}
            </div>
            
            <div className={cn(
              "max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed",
              msg.role === 'user' 
                ? "bg-foreground/10 text-foreground rounded-tr-none" 
                : "bg-white/5 text-muted-foreground rounded-tl-none border border-white/5"
            )}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald/10 border border-emerald/20 flex items-center justify-center shrink-0">
               <span className="text-[10px] font-black text-emerald animate-pulse">...</span>
            </div>
          </div>
        )}
      </CardContent>

      <div className="p-4 border-t border-white/5 bg-white/[0.02]">
        <div className="relative group">
          <Input 
            placeholder={`Ask ${persona.name.split(' ')[0]} why they left...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="pr-12 h-11 rounded-xl bg-white/5 border-white/5 focus:bg-white/10 transition-all font-medium"
          />
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-1 top-1 w-9 h-9 rounded-lg hover:bg-emerald/20 hover:text-emerald text-muted-foreground transition-all"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
}
