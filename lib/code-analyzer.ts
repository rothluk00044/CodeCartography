import { Edge } from '@xyflow/react';
import type { CustomNode, FileNodeData } from './types';

export interface CodeAnalysis {
  deadCode: {
    unusedExports: string[];
    unusedFunctions: string[];
    unusedFiles: string[];
  };
  complexity: {
    cyclomaticComplexity: number;
    dependencyCount: number;
    linesOfCode: number;
  };
  summary?: string;
}

export interface AnalyzedNode extends CustomNode {
  data: FileNodeData & {
    analysis?: CodeAnalysis;
  };
}

export function analyzeCodebase(nodes: CustomNode[], edges: Edge[]): AnalyzedNode[] {
  return nodes.map(node => {
    const incomingEdges = edges.filter(edge => edge.target === node.id);
    const outgoingEdges = edges.filter(edge => edge.source === node.id);
    
    // Identify unused files (no incoming dependencies)
    const isUnused = incomingEdges.length === 0 && outgoingEdges.length === 0;
    
    // Calculate complexity metrics
    const complexity = {
      cyclomaticComplexity: calculateComplexity(node),
      dependencyCount: outgoingEdges.length,
      linesOfCode: countLines(node)
    };

    // Basic dead code analysis
    const deadCode = {
      unusedExports: findUnusedExports(node, edges),
      unusedFunctions: findUnusedFunctions(node),
      unusedFiles: isUnused ? [node.id] : []
    };

    return {
      ...node,
      data: {
        ...node.data,
        analysis: {
          deadCode,
          complexity,
        }
      }
    };
  });
}

function calculateComplexity(node: CustomNode): number {
  // Placeholder: Implement actual cyclomatic complexity calculation
  // This would analyze the AST of the file to count decision points
  return 1;
}

function countLines(node: CustomNode): number {
  const preview = node.data?.codePreview?.snippet || '';
  return preview.split('\n').length;
}

function findUnusedExports(node: CustomNode, edges: Edge[]): string[] {
  // Placeholder: Implement export analysis using TypeScript Compiler API
  return [];
}

function findUnusedFunctions(node: CustomNode): string[] {
  // Placeholder: Implement function usage analysis using TypeScript Compiler API
  return [];
}

export function categorizeNodes(nodes: AnalyzedNode[]): {
  core: AnalyzedNode[];
  utility: AnalyzedNode[];
  standalone: AnalyzedNode[];
} {
  return nodes.reduce((acc, node) => {
    if (node.data.analysis?.complexity.dependencyCount === 0) {
      acc.standalone.push(node);
    } else if (isUtilityFile(node)) {
      acc.utility.push(node);
    } else {
      acc.core.push(node);
    }
    return acc;
  }, {
    core: [] as AnalyzedNode[],
    utility: [] as AnalyzedNode[],
    standalone: [] as AnalyzedNode[]
  });
}

function isUtilityFile(node: AnalyzedNode): boolean {
  // Identify utility files based on naming and usage patterns
  const isUtilName = node.id.includes('util') || node.id.includes('helper');
  const dependencyCount = node.data.analysis?.complexity.dependencyCount || 0;
  const hasHighDependents = dependencyCount > 3;
  return isUtilName || hasHighDependents;
}