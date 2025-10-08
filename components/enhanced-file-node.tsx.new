'use client'

import { memo } from "react"
import { Handle, Position } from "@xyflow/react"
import { FileCode, FileJson, FileText, File } from "lucide-react"
import { CodePreviewCard } from "./code-preview-card"
import type { FileNodeData } from "@/lib/types"

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'typescript':
    case 'javascript':
      return FileCode
    case 'config':
      return FileJson
    case 'documentation':
      return FileText
    default:
      return File
  }
}

const typeColors = {
  typescript: 'border-primary',
  javascript: 'border-warning',
  styles: 'border-success',
  config: 'border-muted',
  documentation: 'border-secondary',
  other: 'border-accent'
}

interface FileNodeProps {
  data: FileNodeData
}

export const EnhancedFileNode = memo(({ data }: FileNodeProps) => {
  const Icon = getFileIcon(data.fileType || 'other')
  const colorClass = typeColors[data.fileType as keyof typeof typeColors] || typeColors.other

  return (
    <div className="relative">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-muted-foreground !w-2 !h-2" 
      />
      <CodePreviewCard nodeData={data}>
        <div
          className={`border ${colorClass}`}
          style={{
            width: '160px',
            height: '24px',
            backgroundColor: 'transparent',
            fontSize: '12px',
            lineHeight: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            padding: '0',
            margin: '0'
          }}
        >
          <span className="px-1 truncate">{data.label}</span>
        </div>
      </CodePreviewCard>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-muted-foreground !w-2 !h-2" 
      />
    </div>
  )
})

EnhancedFileNode.displayName = "EnhancedFileNode"