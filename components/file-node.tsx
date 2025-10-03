"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { motion } from "framer-motion"
import { FileCode, FileJson, FileText } from "lucide-react"
import type { FileNodeData } from "@/lib/types"

const getFileIcon = (fileName: string) => {
  if (fileName.endsWith(".json")) return FileJson
  if (fileName.match(/\.(tsx?|jsx?)$/)) return FileCode
  return FileText
}

interface FileNodeProps {
  data: FileNodeData;
}

export const FileNode = memo(({ data }: FileNodeProps) => {
  const Icon = getFileIcon(data.label)
  const isSelected = data.isSelected

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={`
        px-4 py-3 rounded-lg border-2 bg-card shadow-lg
        transition-all duration-200 min-w-[180px]
        ${isSelected ? "border-primary shadow-primary/20" : "border-border hover:border-primary/50"}
      `}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-1.5 h-1.5 !bg-primary/50 border-none -translate-y-[1px]" 
      />

      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="text-sm font-medium text-foreground truncate">{data.label}</span>
      </div>

      {data.dependencyCount !== undefined && (
        <div className="mt-2 text-xs text-muted-foreground">{data.dependencyCount} dependencies</div>
      )}

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-1.5 h-1.5 !bg-primary/50 border-none translate-y-[1px]" 
      />
    </motion.div>
  )
})

FileNode.displayName = "FileNode"
