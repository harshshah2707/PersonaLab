"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Send, User, ChevronRight, AlertCircle, TrendingDown, X, Sparkles } from 'lucide-react'
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
    const userMsg: Message = { role: 'user', text: inputValue, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

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

      setMessages(prev => [...prev, { role: 'persona', text: response, timestamp: new Date() }])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <Card className="persona-chat border-sand bg-white shadow-2xl overflow-hidden flex flex-col h-[600px] rounded-[2.5rem] animate-in slide-in-from-bottom-8 duration-700">
      <CardHeader className="border-b border-sand py-6 px-8 flex-row items-center justify-between space-y-0 bg-cream/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-coffee border-4 border-white shadow-lg flex items-center justify-center rotate-3">
            <span className="text-xl font-black text-white">{persona.name[0]}</span>
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-coffee tracking-tighter">{persona.name}</CardTitle>
            <CardDescription className="text-[10px] font-black text-terracotta uppercase tracking-[0.2em] flex items-center gap-2">
              <TrendingDown className="w-3.5 h-3.5" />
              Non-Converter Archetype
            </CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-white text-coffee/20 hover:text-terracotta transition-all">
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-neutral" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={cn(
            "flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500",
            msg.role === 'user' ? "flex-row-reverse" : ""
          )}>
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-sm transition-transform duration-500 hover:scale-110",
              msg.role === 'user' ? "bg-white border-sand text-coffee" : "bg-coffee border-coffee text-white"
            )}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            
            <div className={cn(
              "max-w-[75%] p-5 rounded-[1.5rem] text-[13px] font-medium leading-relaxed shadow-sm",
              msg.role === 'user' 
                ? "bg-cream text-coffee rounded-tr-none border border-sand" 
                : "bg-white text-coffee/70 rounded-tl-none border border-sand italic"
            )}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-2xl bg-coffee border-2 border-coffee flex items-center justify-center shrink-0">
               <span className="text-[10px] font-black text-white">...</span>
            </div>
          </div>
        )}
      </CardContent>

      <div className="p-8 border-t border-sand bg-cream/30">
        <div className="relative group">
          <Input 
            placeholder={`Ask ${persona.name.split(' ')[0]} why they left...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="pr-16 h-16 rounded-2xl bg-white border-2 border-sand focus:border-coffee/20 transition-all font-bold text-coffee placeholder:text-coffee/20 shadow-inner"
          />
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 top-2 w-12 h-12 rounded-xl hover:bg-coffee hover:text-white text-coffee/20 transition-all"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default PersonaChat
