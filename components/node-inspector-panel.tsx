"use client"

import { ArrowRight, ArrowLeft, GitBranch } from "lucide-react"
import type { FileNode } from "@/lib/types"

interface NodeInspectorPanelProps {
  selectedNode: FileNode | null
}

export function NodeInspectorPanel({ selectedNode }: NodeInspectorPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
        <div className="w-1 h-5 bg-blue-600 rounded-full" />
        <h2 className="text-lg font-semibold text-white">Node Inspector</h2>
      </div>

      {selectedNode ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">File Name</h3>
            <p className="text-sm font-medium text-white break-all">{selectedNode.data.label}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">Full Path</h3>
            <p className="text-xs font-mono text-gray-400 bg-[#1a1f2e] p-3 rounded break-all">{selectedNode.id}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#1a1f2e] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                <h3 className="text-xs font-semibold text-gray-400">Dependencies</h3>
              </div>
              <p className="text-2xl font-bold text-white">{selectedNode.data.dependencyCount || 0}</p>
            </div>

            <div className="p-3 bg-[#1a1f2e] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ArrowLeft className="w-3.5 h-3.5 text-blue-500" />
                <h3 className="text-xs font-semibold text-gray-400">Dependents</h3>
              </div>
              <p className="text-2xl font-bold text-white">{selectedNode.data.dependentCount || 0}</p>
            </div>
          </div>

          {selectedNode.data.isCircular && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <GitBranch className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-semibold text-red-400">Circular Dependency</h3>
              </div>
              <p className="text-xs text-red-400/80">Part of a circular dependency chain</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500 py-8 text-center">Click a node on the graph to inspect its details.</p>
      )}
    </div>
  )
}
