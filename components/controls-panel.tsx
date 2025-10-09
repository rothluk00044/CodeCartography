"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ControlsPanelProps {
  onAnalyze: (path: string) => void
  isAnalyzing: boolean
  error: string | null
}

export function ControlsPanel({ onAnalyze, isAnalyzing, error }: ControlsPanelProps) {
  const [path, setPath] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (path.trim()) {
      onAnalyze(path.trim())
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
        <div className="w-1 h-5 bg-blue-600 rounded-full" />
        <h2 className="text-lg font-semibold text-white">Controls</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Path Input */}
        <div className="space-y-2">
          <label htmlFor="directory" className="text-sm font-medium text-gray-400">
            Enter project path:
          </label>
          <Input
            id="directory"
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/path/to/your/project"
            className="bg-[#1a1f2e] border-gray-700 text-white placeholder:text-gray-600"
            disabled={isAnalyzing}
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={!path.trim() || isAnalyzing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white py-2.5 rounded-lg font-medium transition-colors"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Project"}
        </button>
      </form>
    </div>
  )
}
