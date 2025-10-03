"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { CodebaseVisualizer } from "@/components/codebase-visualizer"

export default function Home() {
  const [showVisualizer, setShowVisualizer] = useState(false)

  if (showVisualizer) {
    return (
      <main className="h-screen w-full bg-background">
        <CodebaseVisualizer onGoBack={() => setShowVisualizer(false)} />
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <HeroSection onStartVisualizing={() => setShowVisualizer(true)} />
    </main>
  )
}
