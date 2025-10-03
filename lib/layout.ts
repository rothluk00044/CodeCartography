import dagre from "dagre"
import type { GraphData } from "./types"

export function applyDagreLayout(data: GraphData): GraphData {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: "TB", ranksep: 100, nodesep: 80 })

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

  return {
    nodes: layoutedNodes,
    edges: data.edges,
  }
}
