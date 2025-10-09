"use client"

import { FileCode, GitBranch, AlertTriangle } from "lucide-react"
import type { GraphData } from "@/lib/types"

interface ProjectInfoPanelProps {
  graphData: GraphData | null
}

export function ProjectInfoPanel({ graphData }: ProjectInfoPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
        <div className="w-1 h-5 bg-blue-600 rounded-full" />
        <h2 className="text-lg font-semibold text-white">Project Info</h2>
      </div>

      {graphData ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#1a1f2e] rounded-lg">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-400">Total Files</span>
            </div>
            <span className="text-lg font-semibold text-white">{graphData.nodes.length}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#1a1f2e] rounded-lg">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-400">Dependencies</span>
            </div>
            <span className="text-lg font-semibold text-white">{graphData.edges.length}</span>
          </div>

          {graphData.nodes.some((node) => node.data.isCircular) && (
            <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-400">Circular Dependencies</span>
              </div>
              <span className="text-lg font-semibold text-red-400">
                {graphData.nodes.filter((node) => node.data.isCircular).length}
              </span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground p-4">Enter a project path to see information here.</p>
      )}
    </div>
  )
}
