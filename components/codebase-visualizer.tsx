"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CodeGraph } from "./code-graph"
import { ControlsPanel } from "./controls-panel"
import { ProjectInfoPanel } from "./project-info-panel"
import { NodeInspectorPanel } from "./node-inspector-panel"
import type { GraphData, CustomNode } from "@/lib/types"

interface CodebaseVisualizerProps {
  onGoBack: () => void;
}

export function CodebaseVisualizer({ onGoBack }: CodebaseVisualizerProps) {
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (directoryPath: string) => {
    setIsAnalyzing(true)
    setError(null)
    setSelectedNode(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ directoryPath }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze codebase")
      }

      const data = await response.json()
      setGraphData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleNodeClick = (node: CustomNode) => {
    setSelectedNode(node)
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <header className="bg-[#1a1f2e] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onGoBack}
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Go Back
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">Function-Level View</h1>
            <p className="text-sm text-gray-400">Show file-level dependencies</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Graph Canvas */}
        <div className="flex-1 relative bg-[#0a0e1a]">
          {graphData ? (
            <CodeGraph data={graphData} onNodeClick={handleNodeClick} selectedNodeId={selectedNode?.id} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4 max-w-2xl px-8"
              >
                <h2 className="text-4xl font-bold text-gray-300">Welcome to Codebase Cartographer</h2>
                <p className="text-lg text-gray-500 leading-relaxed">
                  Upload your project folder in the right panel to begin visualizing your code's architecture.
                </p>
              </motion.div>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 bg-[#0a0e1a]/90 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-white font-medium">Analyzing codebase...</p>
              </motion.div>
            </div>
          )}
        </div>

        {/* Right Sidebar with Three Panels */}
        <aside className="w-96 bg-[#0f1419] border-l border-gray-800 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Controls Panel */}
            <ControlsPanel onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} error={error} />

            {/* Project Info Panel */}
            <ProjectInfoPanel graphData={graphData} />

            {/* Node Inspector Panel */}
            <NodeInspectorPanel selectedNode={selectedNode} />
          </div>
        </aside>
      </div>
    </div>
  )
}
