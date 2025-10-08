import type { Node, Edge } from "@xyflow/react"

export interface FileNodeData extends Record<string, unknown> {
  label: string
  dependencyCount?: number
  dependentCount?: number
  isCircular?: boolean
  isSelected?: boolean
  fileType?: 'typescript' | 'javascript' | 'styles' | 'config' | 'documentation' | 'other'
  directory?: string
  codePreview?: {
    snippet: string
    language: string
    startLine: number
    endLine: number
  }
}

export type CustomNode = Node<FileNodeData>

export interface GraphData {
  nodes: CustomNode[]
  edges: Edge[]
}

export interface AnalyzeRequest {
  directoryPath: string
}

export interface AnalyzeResponse extends GraphData {
  stats?: {
    totalFiles: number
    totalDependencies: number
    circularDependencies: number
  }
}
