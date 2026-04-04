import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: "PersonaLab | Laboratory-Grade Behavioral Simulation",
  description: "Advanced synthetic user audit studio for elite product teams. Simulate human intuition without real-user friction.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased h-full overflow-x-hidden bg-background text-foreground selection:bg-accent/20 selection:text-accent transition-colors duration-500`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative isolate min-h-screen">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}