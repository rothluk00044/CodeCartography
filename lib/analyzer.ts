import fs from "fs"
import path from "path"
import { parse } from "@babel/parser"
import traverse from "@babel/traverse"
import type { GraphData, FileNode, AnalyzeResponse } from "./types"

const IGNORE_DIRS = ["node_modules", ".git", ".next", "dist", "build", "coverage", ".vercel", "out"]
const VALID_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]

interface FileInfo {
  path: string
  dependencies: string[]
}

export async function analyzeCodebase(directoryPath: string): Promise<AnalyzeResponse> {
  // Scan directory for all valid files
  const files = scanDirectory(directoryPath)

  // Parse each file and extract dependencies
  const fileInfos = files.map((filePath) => parseFile(filePath, directoryPath))

  // Build graph data
  const graphData = buildGraph(fileInfos, directoryPath)

  // Detect circular dependencies
  const circularNodes = detectCircularDependencies(graphData)

  // Add metadata to nodes
  const enhancedNodes = graphData.nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      isCircular: circularNodes.has(node.id),
      dependentCount: graphData.edges.filter((e) => e.target === node.id).length,
    },
  }))

  return {
    nodes: enhancedNodes,
    edges: graphData.edges,
    stats: {
      totalFiles: files.length,
      totalDependencies: graphData.edges.length,
      circularDependencies: circularNodes.size,
    },
  }
}

function scanDirectory(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) {
    throw new Error(`Directory not found: ${dir}`)
  }

  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        scanDirectory(filePath, fileList)
      }
    } else {
      const ext = path.extname(file)
      if (VALID_EXTENSIONS.includes(ext)) {
        fileList.push(filePath)
      }
    }
  })

  return fileList
}

function parseFile(filePath: string, baseDir: string): FileInfo {
  const dependencies: string[] = []

  try {
    const content = fs.readFileSync(filePath, "utf-8")
    const ast = parse(content, {
      sourceType: "module",
      plugins: ["jsx", "typescript", "decorators-legacy"],
    })

    const traverseFn = (traverse as any).default || traverse

    traverseFn(ast, {
      ImportDeclaration(nodePath: any) {
        const source = nodePath.node.source.value
        if (source.startsWith(".") || source.startsWith("/")) {
          const resolvedPath = resolveImportPath(source, filePath, baseDir)
          if (resolvedPath) {
            dependencies.push(resolvedPath)
          }
        }
      },
      ExportNamedDeclaration(nodePath: any) {
        if (nodePath.node.source) {
          const source = nodePath.node.source.value
          if (source.startsWith(".") || source.startsWith("/")) {
            const resolvedPath = resolveImportPath(source, filePath, baseDir)
            if (resolvedPath) {
              dependencies.push(resolvedPath)
            }
          }
        }
      },
      ExportAllDeclaration(nodePath: any) {
        const source = nodePath.node.source.value
        if (source.startsWith(".") || source.startsWith("/")) {
          const resolvedPath = resolveImportPath(source, filePath, baseDir)
          if (resolvedPath) {
            dependencies.push(resolvedPath)
          }
        }
      },
    })
  } catch (error) {
    console.warn(`Failed to parse ${filePath}:`, error)
  }

  return { path: filePath, dependencies }
}

function resolveImportPath(importPath: string, fromFile: string, baseDir: string): string | null {
  const fromDir = path.dirname(fromFile)
  let resolvedPath = path.resolve(fromDir, importPath)

  // Try adding extensions if file doesn't exist
  if (!fs.existsSync(resolvedPath)) {
    for (const ext of VALID_EXTENSIONS) {
      const withExt = resolvedPath + ext
      if (fs.existsSync(withExt)) {
        resolvedPath = withExt
        break
      }
    }
  }

  // Try index files
  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
    for (const ext of VALID_EXTENSIONS) {
      const indexPath = path.join(resolvedPath, `index${ext}`)
      if (fs.existsSync(indexPath)) {
        resolvedPath = indexPath
        break
      }
    }
  }

  if (fs.existsSync(resolvedPath)) {
    return resolvedPath
  }

  return null
}

function buildGraph(fileInfos: FileInfo[], baseDir: string): GraphData {
  const nodes: FileNode[] = []
  const edges: GraphData["edges"] = []
  const nodeMap = new Map<string, FileNode>()

  // Create nodes
  fileInfos.forEach((fileInfo) => {
    const relativePath = path.relative(baseDir, fileInfo.path)
    const fileName = path.basename(fileInfo.path)

    const node: FileNode = {
      id: fileInfo.path,
      type: "fileNode",
      data: {
        label: fileName,
        dependencyCount: fileInfo.dependencies.length,
      },
      position: { x: 0, y: 0 },
    }

    nodes.push(node)
    nodeMap.set(fileInfo.path, node)
  })

  // Create edges
  fileInfos.forEach((fileInfo) => {
    fileInfo.dependencies.forEach((depPath) => {
      if (nodeMap.has(depPath)) {
        edges.push({
          id: `e-${fileInfo.path}-${depPath}`,
          source: fileInfo.path,
          target: depPath,
          type: "smoothstep",
          animated: false,
        })
      }
    })
  })

  return { nodes, edges }
}

function detectCircularDependencies(graphData: GraphData): Set<string> {
  const circularNodes = new Set<string>()
  const visited = new Set<string>()
  const recursionStack = new Set<string>()

  // Build adjacency list
  const adjacencyList = new Map<string, string[]>()
  graphData.nodes.forEach((node) => {
    adjacencyList.set(node.id, [])
  })
  graphData.edges.forEach((edge) => {
    const targets = adjacencyList.get(edge.source) || []
    targets.push(edge.target)
    adjacencyList.set(edge.source, targets)
  })

  function dfs(nodeId: string): boolean {
    visited.add(nodeId)
    recursionStack.add(nodeId)

    const neighbors = adjacencyList.get(nodeId) || []
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) {
          circularNodes.add(nodeId)
          return true
        }
      } else if (recursionStack.has(neighbor)) {
        circularNodes.add(nodeId)
        circularNodes.add(neighbor)
        return true
      }
    }

    recursionStack.delete(nodeId)
    return false
  }

  graphData.nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      dfs(node.id)
    }
  })

  return circularNodes
}
