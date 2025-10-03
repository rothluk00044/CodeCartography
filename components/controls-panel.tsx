"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ControlsPanelProps {
  onAnalyze: (path: string) => void
  isAnalyzing: boolean
  error: string | null
}

export function ControlsPanel({ onAnalyze, isAnalyzing, error }: ControlsPanelProps) {
  const [path, setPath] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (path.trim()) {
      onAnalyze(path.trim())
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
        <div className="w-1 h-5 bg-blue-600 rounded-full" />
        <h2 className="text-lg font-semibold text-white">Controls</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center space-y-3 hover:border-gray-600 transition-colors"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const items = e.dataTransfer.items;
            if (items) {
              for (let i = 0; i < items.length; i++) {
                const item = items[i].webkitGetAsEntry();
                if (item?.isDirectory) {
                  const filePath = e.dataTransfer.files[i].webkitRelativePath.split('/')[0];
                  setPath(filePath);
                  onAnalyze(filePath);
                  break;
                }
              }
            }
          }}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.webkitdirectory = true;
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files && files.length > 0) {
                const filePath = files[0].webkitRelativePath.split('/')[0];
                setPath(filePath);
                onAnalyze(filePath);
              }
            };
            input.click();
          }}
        >
          <Upload className="w-10 h-10 text-blue-500 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm text-gray-300">
              <span className="text-blue-500 font-medium cursor-pointer hover:underline">Click to upload</span> or drag
              and drop a folder
            </p>
            <p className="text-xs text-gray-500">Select your project's root directory</p>
          </div>
        </div>

        {/* Path Input */}
        <div className="space-y-2">
          <label htmlFor="directory" className="text-sm font-medium text-gray-400">
            Or enter path manually:
          </label>
          <Input
            id="directory"
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/path/to/your/project"
            className="bg-[#1a1f2e] border-gray-700 text-white placeholder:text-gray-600"
            disabled={isAnalyzing}
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={!path.trim() || isAnalyzing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white py-2.5 rounded-lg font-medium transition-colors"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Project"}
        </button>
      </form>
    </div>
  )
}
