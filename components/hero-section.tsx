"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  onStartVisualizing: () => void
}

export function HeroSection({ onStartVisualizing }: HeroSectionProps) {
  return (
    <div className="h-full w-full flex items-center justify-center px-8 lg:px-16">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
            Map Your Code,
            <br />
            Master Your
            <br />
            Architecture.
          </h1>

          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
            Instantly visualize your codebase's dependency graph. Understand structure, find bottlenecks, and identify
            dead code.
          </p>

          <div className="space-y-4">
            <Button
              onClick={onStartVisualizing}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-medium rounded-lg transition-all duration-200 shadow-lg"
            >
              Start Visualizing
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <p className="text-sm text-muted-foreground">Free to use. No sign-up required.</p>
          </div>
        </motion.div>

        {/* Right Visual - Pure CSS gradient background */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px] bg-gradient-to-br from-blue-600/20 via-teal-600/10 to-purple-600/20 backdrop-blur-3xl border border-blue-500/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
