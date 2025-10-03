"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import { ReactFlow, Background, useNodesState, useEdgesState, type NodeTypes, type Edge } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { FileNode } from "./file-node"
import { applyDagreLayout } from "@/lib/layout"
import type { GraphData, CustomNode } from "@/lib/types"

const nodeTypes: NodeTypes = {
  fileNode: FileNode as any,
}

interface CodeGraphProps {
  data: GraphData
  onNodeClick: (node: CustomNode) => void
  selectedNodeId?: string
}

export function CodeGraph({ data, onNodeClick, selectedNodeId }: CodeGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [isLayouted, setIsLayouted] = useState(false)

  useEffect(() => {
    if (data && !isLayouted) {
      const layoutedData = applyDagreLayout(data)
      setNodes(layoutedData.nodes)
      setEdges(layoutedData.edges)
      setIsLayouted(true)
    }
  }, [data, isLayouted, setNodes, setEdges])

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: CustomNode) => {
      onNodeClick(node)
    },
    [onNodeClick],
  )

  // Update node styles based on selection
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isSelected: node.id === selectedNodeId,
        },
      })),
    )
  }, [selectedNodeId, setNodes])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={handleNodeClick}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ 
        padding: 0.2,
        minZoom: 0.6,
        maxZoom: 1
      }}
      minZoom={0.3}
      maxZoom={1.5}
      defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      className="bg-background"
    >
      <Background className="bg-muted/20" />
    </ReactFlow>
  )
}
