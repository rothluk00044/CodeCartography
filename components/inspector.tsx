"use client"

import { motion } from "framer-motion"
import { X, FileCode, GitBranch, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FileNode } from "@/lib/types"

interface InspectorProps {
  node: FileNode
  onClose: () => void
}

export function Inspector({ node, onClose }: InspectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">File Inspector</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">File Name</h3>
          <p className="text-base font-medium text-foreground break-all">{node.data.label}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Full Path</h3>
          <p className="text-xs font-mono text-foreground bg-muted p-3 rounded break-all">{node.id}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Dependencies</h3>
            </div>
            <p className="text-2xl font-bold text-foreground">{node.data.dependencyCount || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Files this imports</p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ArrowLeft className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Dependents</h3>
            </div>
            <p className="text-2xl font-bold text-foreground">{node.data.dependentCount || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Files that import this</p>
          </div>
        </div>

        {node.data.isCircular && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-4 h-4 text-destructive" />
              <h3 className="text-sm font-semibold text-destructive">Circular Dependency Detected</h3>
            </div>
            <p className="text-xs text-destructive/80">This file is part of a circular dependency chain</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
