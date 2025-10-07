import dagre from "dagre"
import type { GraphData } from "./types"
import type { Edge, MarkerType } from "@xyflow/react"

export function applyDagreLayout(data: GraphData): GraphData {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ 
    rankdir: "TB",
    ranksep: 150,
    nodesep: 100,
    edgesep: 50,
    marginx: 50,
    marginy: 50,
    align: "UL"
  })

  // Add nodes to dagre
  data.nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 80 })
  })

  // Add edges to dagre
  data.edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  // Calculate layout
  dagre.layout(dagreGraph)

  // Apply positions to nodes
  const layoutedNodes = data.nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 100,
        y: nodeWithPosition.y - 40,
      },
    }
  })

  // Enhance edges with better styling
  const enhancedEdges = data.edges.map(edge => ({
    ...edge,
    type: 'smoothstep',
    animated: false,
    style: { stroke: 'hsl(var(--foreground))', strokeWidth: 1, opacity: 0.5 },
    markerEnd: {
      type: 'arrow' as MarkerType,
      color: 'hsl(var(--foreground))',
    },
  } as Edge))

  return {
    nodes: layoutedNodes,
    edges: enhancedEdges,
  }
}
