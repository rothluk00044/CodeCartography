"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { FolderOpen, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DirectoryInputProps {
  onAnalyze: (path: string) => void
  isAnalyzing: boolean
  error: string | null
}

export function DirectoryInput({ onAnalyze, isAnalyzing, error }: DirectoryInputProps) {
  const [path, setPath] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (path.trim()) {
      onAnalyze(path.trim())
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Analyze Codebase</h2>
        <p className="text-sm text-muted-foreground">Enter the absolute path to your project directory</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="directory" className="text-sm font-medium text-foreground">
            Directory Path
          </label>
          <div className="relative">
            <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="directory"
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/path/to/your/project"
              className="pl-10"
              disabled={isAnalyzing}
            />
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        <Button type="submit" disabled={!path.trim() || isAnalyzing} className="w-full">
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </Button>
      </form>

      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground">Example Paths</h3>
        <div className="space-y-2">
          {[
            "/Users/username/projects/my-app",
            "C:\\Users\\username\\projects\\my-app",
            "/home/username/projects/my-app",
          ].map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setPath(example)}
              className="w-full text-left px-3 py-2 text-xs font-mono bg-muted hover:bg-muted/80 rounded transition-colors"
              disabled={isAnalyzing}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
