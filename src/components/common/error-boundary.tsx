"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { AlertCircle, RotateCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Dashboard error caught by boundary:", error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-8 bg-background relative overflow-hidden">
          {/* Background Decorative Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />
          
          <div className="glass-panel max-w-lg w-full p-12 rounded-[2.5rem] border-white/10 shadow-2xl relative z-10 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-8 border border-destructive/20 active:scale-95 transition-transform">
              <AlertCircle className="w-10 h-10" />
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed max-w-sm mx-auto">
              Our simulation engine encountered an unexpected runtime error. We&apos;ve logged the incident and are working on it.
            </p>

            {this.state.error && (
              <div className="mb-8 p-4 bg-black/40 border border-white/5 rounded-2xl text-[10px] font-mono text-muted-foreground/60 text-left overflow-auto max-h-32 scrollbar-thin">
                 {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button 
                onClick={this.handleReset}
                variant="default"
                className="h-12 px-8 rounded-full bg-foreground text-background font-bold hover:bg-foreground/90 transition-all active:scale-95 shadow-xl shadow-white/5 gap-2 w-full sm:w-auto"
              >
                <RotateCcw className="w-4 h-4" />
                Reload Application
              </Button>
              <Link href="/" className="w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  className="h-12 px-8 rounded-full font-bold hover:bg-white/5 gap-2 w-full"
                >
                  <Home className="w-4 h-4" />
                  Return Home
                </Button>
              </Link>
            </div>
          </div>

          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet/20 rounded-full blur-[80px]" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald/20 rounded-full blur-[80px]" />
        </div>
      )
    }

    return this.props.children
  }
}
