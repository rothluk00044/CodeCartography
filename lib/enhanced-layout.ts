import { Edge, Node, Position, MarkerType } from '@xyflow/react';
import * as d3 from 'd3';
import type { CustomNode } from './types';
import { analyzeCodebase, categorizeNodes, type AnalyzedNode } from './code-analyzer';

const CANVAS_WIDTH = 1600;  // More compact canvas
const CANVAS_HEIGHT = 1000;
const CORE_SECTION = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, width: 900, height: 700 };
const UTILITY_SECTION = { x: 150, y: CANVAS_HEIGHT / 2, width: 200, height: CANVAS_HEIGHT - 100 };
const STANDALONE_SECTION = { x: CANVAS_WIDTH - 150, y: CANVAS_HEIGHT / 2, width: 200, height: CANVAS_HEIGHT - 100 };

const defaultNodeWidth = 160;  // Fixed width
const defaultNodeHeight = 24;  // Fixed height
const nodeSpacing = 40;  // Reduced spacing for more compact layout

export type CustomEdge = Edge;

interface ForceSimulationNode extends d3.SimulationNodeDatum {
  id: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

function layoutCoreNodes(nodes: AnalyzedNode[], edges: Edge[]): AnalyzedNode[] {
  const nodeIds = new Set(nodes.map(node => node.id));
  
  // Only include edges where both source and target nodes exist
  const validEdges = edges.filter(edge => 
    nodeIds.has(edge.source.toString()) && nodeIds.has(edge.target.toString())
  );

  const simulationNodes: ForceSimulationNode[] = nodes.map(node => ({
    id: node.id,
    x: CORE_SECTION.x + (Math.random() - 0.5) * CORE_SECTION.width * 0.8,
    y: CORE_SECTION.y + (Math.random() - 0.5) * CORE_SECTION.height * 0.8
  }));

  const simulation = d3.forceSimulation(simulationNodes)
    .force('link', d3.forceLink(validEdges.map(e => ({ 
      source: e.source.toString(),
      target: e.target.toString()
    })))
      .id((d: any) => d.id)
      .distance(200) // Shorter distance for tighter layout
      .strength(1)) // Maximum strength for more structured layout
    .force('charge', d3.forceManyBody()
      .strength(-400) // Reduced repulsion for closer nodes
      .distanceMin(100)
      .distanceMax(400))
    .force('collide', d3.forceCollide()
      .radius(defaultNodeWidth / 2 + nodeSpacing)
      .strength(1))
    .force('center', d3.forceCenter(CORE_SECTION.x, CORE_SECTION.y))
    // Stronger grid alignment forces with tighter grid
    .force('x', d3.forceX().strength(0.5)
      .x(d => Math.round((d.x || CORE_SECTION.x) / 60) * 60)) // Snap to 60px grid
    .force('y', d3.forceY().strength(0.5)
      .y(d => Math.round((d.y || CORE_SECTION.y) / 60) * 60));

  for (let i = 0; i < 300; ++i) simulation.tick();

  return nodes.map(node => {
    const simNode = simulationNodes.find(n => n.id === node.id);
    if (!simNode?.x || !simNode?.y) return node;

    const gridSize = 20;
    return {
      ...node,
      position: {
        x: Math.round(simNode.x / gridSize) * gridSize,
        y: Math.round(simNode.y / gridSize) * gridSize
      }
    };
  });
}

function layoutUtilityNodes(nodes: AnalyzedNode[]): AnalyzedNode[] {
  const nodesPerColumn = Math.ceil(Math.sqrt(nodes.length));
  return nodes.map((node, i) => ({
    ...node,
    position: {
      x: UTILITY_SECTION.x + (Math.floor(i / nodesPerColumn) * (defaultNodeWidth + nodeSpacing)),
      y: UTILITY_SECTION.y - UTILITY_SECTION.height/2 + (i % nodesPerColumn) * (defaultNodeHeight + nodeSpacing)
    }
  }));
}

function layoutStandaloneNodes(nodes: AnalyzedNode[]): AnalyzedNode[] {
  const nodesPerColumn = Math.ceil(Math.sqrt(nodes.length));
  return nodes.map((node, i) => ({
    ...node,
    position: {
      x: STANDALONE_SECTION.x + (Math.floor(i / nodesPerColumn) * (defaultNodeWidth + nodeSpacing)),
      y: STANDALONE_SECTION.y - UTILITY_SECTION.height/2 + (i % nodesPerColumn) * (defaultNodeHeight + nodeSpacing)
    }
  }));
}

export function applyEnhancedLayout(nodes: CustomNode[], edges: CustomEdge[]): { nodes: CustomNode[], edges: CustomEdge[] } {
  if (!nodes.length) return { nodes: [], edges: [] };

  // Filter out edges with non-existent nodes
  const nodeIds = new Set(nodes.map(node => node.id));
  const validEdges = edges.filter(edge => 
    nodeIds.has(edge.source.toString()) && nodeIds.has(edge.target.toString())
  );

  const analyzedNodes = analyzeCodebase(nodes, validEdges);
  const { core, utility, standalone } = categorizeNodes(analyzedNodes);
  
  // Handle empty core case
  if (core.length === 0) {
    const allNodes = [...utility, ...standalone];
    return {
      nodes: updateNodeStyles(allNodes),
      edges: validEdges
    };
  }

  const layoutedCore = layoutCoreNodes(core, validEdges);
  const layoutedUtility = layoutUtilityNodes(utility);
  const layoutedStandalone = layoutStandaloneNodes(standalone);

function updateNodeStyles(nodes: AnalyzedNode[]): AnalyzedNode[] {
  return nodes.map(node => {
    return {
      ...node,
      style: {
        ...node.style,
        width: 160,
        height: 24,
        backgroundColor: getNodeBackgroundColor(node),
        border: '1px solid rgb(148, 163, 184)',
        borderRadius: 0,
        color: 'rgb(226, 232, 240)',
        fontSize: '12px',
        fontFamily: 'monospace',
        textAlign: 'center',
        lineHeight: '24px',
        padding: 0
      }
    };
  });
}

function getNodeBackgroundColor(node: AnalyzedNode): string {
  return 'transparent';
}

function getNodeBorderColor(node: AnalyzedNode): string {
  if (node.data.analysis?.deadCode.unusedExports.length) {
    return 'rgb(255, 100, 100)'; // Red for dead code
  }
  return 'currentColor';
}

  // Apply styles and combine all nodes
  const styledNodes = updateNodeStyles([...layoutedCore, ...layoutedUtility, ...layoutedStandalone]);

  // Update edges with better styling
  const updatedEdges = edges.map(edge => ({
    ...edge,
    type: 'smoothstep',
    animated: false,
    markerEnd: {
      type: MarkerType.Arrow,
      width: 16,
      height: 16,
      color: 'rgba(148, 163, 184, 0.5)' // Subtle gray for arrows
    },
    style: {
      strokeWidth: 1,
      stroke: 'rgba(148, 163, 184, 0.3)' // Very subtle gray for lines
    }
  }));

  return {
    nodes: styledNodes,
    edges: updatedEdges
  };
}

export function centerOnNode(nodes: CustomNode[], targetNodeId: string): CustomNode[] {
  const targetNode = nodes.find(node => node.id === targetNodeId);
  if (!targetNode || !targetNode.position) return nodes;

  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2;
  const offsetX = centerX - targetNode.position.x;
  const offsetY = centerY - targetNode.position.y;

  return nodes.map(node => ({
    ...node,
    position: node.position ? {
      x: node.position.x + offsetX,
      y: node.position.y + offsetY
    } : node.position
  }));
}