'use client'

import * as React from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { type FileNodeData } from '@/lib/types'

interface CodePreviewCardProps {
  children: React.ReactNode
  nodeData: FileNodeData
}

export function CodePreviewCard({ children, nodeData }: CodePreviewCardProps) {
  if (!nodeData.codePreview) {
    return <>{children}</>
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-[520px] p-0" side="right">
        <div className="flex flex-col space-y-2">
          <div className="p-4 pb-0">
            <h4 className="text-sm font-semibold">{nodeData.label}</h4>
            <p className="text-xs text-muted-foreground">
              Lines {nodeData.codePreview.startLine}-{nodeData.codePreview.endLine}
            </p>
          </div>
          <pre className="max-h-[300px] overflow-auto rounded-b-lg bg-muted p-4">
            <code>{nodeData.codePreview.snippet}</code>
          </pre>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}