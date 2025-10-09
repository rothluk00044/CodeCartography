"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import { ReactFlow, Background, useNodesState, useEdgesState, type NodeTypes, type Edge, Panel, MiniMap, Controls } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { EnhancedFileNode } from "./enhanced-file-node"
import { applyEnhancedLayout } from "@/lib/enhanced-layout"
import type { GraphData, CustomNode, FileNodeData } from "@/lib/types"
import { motion } from "framer-motion"

const typeColors = {
  typescript: 'border-primary text-primary',
  javascript: 'border-warning text-warning',
  styles: 'border-success text-success',
  config: 'border-muted text-muted-foreground',
  documentation: 'border-secondary text-secondary',
  other: 'border-accent text-accent'
}

const nodeTypes: NodeTypes = {
  fileNode: EnhancedFileNode as any,
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
      // Ensure we pass the correct node and edge data
      const { nodes: layoutedNodes, edges: layoutedEdges } = applyEnhancedLayout(data.nodes, data.edges)
      setNodes(layoutedNodes)
      setEdges(layoutedEdges)
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
        padding: 1,
        minZoom: 0.4,
        maxZoom: 2
      }}
      minZoom={0.2}
      maxZoom={3}
      defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      className="bg-background"
      snapToGrid={true}
      snapGrid={[16, 16]}
      elevateNodesOnSelect={true}
      nodesDraggable={true}
      nodesConnectable={false}
      panOnDrag={true}
      zoomOnScroll={true}
      panOnScroll={false}
      preventScrolling={true}
    >
      <Background 
        className="bg-muted/20" 
        gap={16}
        size={1}
      />
      <Panel position="top-left" className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border shadow-lg">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">File Types</h3>
          <div className="flex flex-wrap gap-2">
            {['typescript', 'javascript', 'styles', 'config', 'documentation'].map((type) => {
              const count = data.nodes.filter(n => n.data.fileType === type).length;
              return (
                <motion.div
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  className="px-2 py-1 rounded-full text-xs text-foreground bg-background border border-border"
                >
                  <span className="text-foreground">{type}</span>
                  <span className="ml-1 text-muted-foreground">({count})</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Panel>
      <MiniMap 
        className="!bg-background/80 backdrop-blur-sm !border rounded-lg"
        maskColor="hsl(var(--muted))"
        nodeColor={node => {
          const type = (node.data as FileNodeData).fileType || 'other'
          switch(type) {
            case 'typescript': return 'hsl(var(--primary))'
            case 'javascript': return 'hsl(var(--warning))'
            case 'styles': return 'hsl(var(--success))'
            case 'config': return 'hsl(var(--muted))'
            default: return 'hsl(var(--secondary))'
          }
        }}
      />
      <Controls 
        className="!bg-background/80 backdrop-blur-sm !border rounded-lg"
        showInteractive={false}
      />
    </ReactFlow>
  )
}
