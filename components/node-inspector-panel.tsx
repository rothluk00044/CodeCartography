"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AlertCircle, Code, FileText, TrendingUp, Lightbulb, Loader2, ArrowRight, ArrowLeft, GitBranch } from "lucide-react"
import type { CustomNode } from "@/lib/types"
import type { CodeAnalysis } from "@/lib/code-analyzer"

interface NodeInspectorPanelProps {
  selectedNode: CustomNode | null
}

export function NodeInspectorPanel({ selectedNode }: NodeInspectorPanelProps) {
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!selectedNode) return;

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze/file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filePath: selectedNode.id, // using the file path as id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze file');
      }

      const result = await response.json();
      setAnalysis(result.analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getComplexityColor = (score: number) => {
    if (score <= 3) return "bg-green-100 text-green-800 border-green-300";
    if (score <= 6) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
        <div className="w-1 h-5 bg-blue-600 rounded-full" />
        <h2 className="text-lg font-semibold text-white">Node Inspector</h2>
      </div>

      {selectedNode ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">File Name</h3>
            <p className="text-sm font-medium text-white break-all">{selectedNode.data.label}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">Full Path</h3>
            <p className="text-xs font-mono text-gray-400 bg-[#1a1f2e] p-3 rounded break-all">{selectedNode.id}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#1a1f2e] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                <h3 className="text-xs font-semibold text-gray-400">Dependencies</h3>
              </div>
              <p className="text-2xl font-bold text-white">{selectedNode.data.dependencyCount || 0}</p>
            </div>

            <div className="p-3 bg-[#1a1f2e] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ArrowLeft className="w-3.5 h-3.5 text-blue-500" />
                <h3 className="text-xs font-semibold text-gray-400">Dependents</h3>
              </div>
              <p className="text-2xl font-bold text-white">{selectedNode.data.dependentCount || 0}</p>
            </div>
          </div>

          {selectedNode.data.isCircular && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <GitBranch className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-semibold text-red-400">Circular Dependency</h3>
              </div>
              <p className="text-xs text-red-400/80">Part of a circular dependency chain</p>
            </div>
          )}

          {/* Analyze Button */}
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="w-full"
            variant="outline"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Code className="h-4 w-4 mr-2" />
                Analyze Code
              </>
            )}
          </Button>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Analysis Error</span>
              </div>
              <p className="text-sm text-red-400/80 mt-1">{error}</p>
            </div>
          )}

          {analysis && (
            <div className="space-y-4">
              <Separator className="bg-gray-800" />
              
              {/* Analysis Summary */}
              <div className="p-4 bg-[#1a1f2e] rounded-lg">
                <h3 className="text-sm font-semibold text-white mb-2">Summary</h3>
                <p className="text-xs text-gray-400">{analysis.summary}</p>
              </div>

              {/* Purpose */}
              <div className="p-4 bg-[#1a1f2e] rounded-lg">
                <h3 className="text-sm font-semibold text-white mb-2">Purpose</h3>
                <p className="text-xs text-gray-400">{analysis.purpose}</p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-[#1a1f2e] rounded-lg text-center">
                  <div className="text-lg font-bold text-white">{analysis.metrics.linesOfCode}</div>
                  <div className="text-xs text-gray-400">Lines</div>
                </div>
                <div className="p-3 bg-[#1a1f2e] rounded-lg text-center">
                  <div className="text-lg font-bold text-white">{analysis.metrics.functions}</div>
                  <div className="text-xs text-gray-400">Functions</div>
                </div>
                <div className="p-3 bg-[#1a1f2e] rounded-lg text-center">
                  <div className="text-lg font-bold text-white">{analysis.metrics.classes}</div>
                  <div className="text-xs text-gray-400">Classes</div>
                </div>
                <div className="p-3 bg-[#1a1f2e] rounded-lg text-center">
                  <div className="text-lg font-bold text-white">{analysis.metrics.exports}</div>
                  <div className="text-xs text-gray-400">Exports</div>
                </div>
              </div>

              {/* Complexity Score */}
              <div className="p-4 bg-[#1a1f2e] rounded-lg">
                <h3 className="text-sm font-semibold text-white mb-2">Complexity Score</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`px-2 py-1 rounded text-xs font-bold ${getComplexityColor(analysis.complexity.score)}`}>
                    {analysis.complexity.score}/10
                  </div>
                  <span className="text-xs text-gray-400">
                    {analysis.complexity.score <= 3 ? 'Low' : analysis.complexity.score <= 6 ? 'Medium' : 'High'}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{analysis.complexity.explanation}</p>
              </div>

              {/* Key Features */}
              <div className="p-4 bg-[#1a1f2e] rounded-lg">
                <h3 className="text-sm font-semibold text-white mb-2">Key Features</h3>
                <div className="space-y-1">
                  {analysis.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full" />
                      <span className="text-xs text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Patterns */}
              <div className="p-4 bg-[#1a1f2e] rounded-lg">
                <h3 className="text-sm font-semibold text-white mb-2">File Type</h3>
                <div className="flex flex-wrap gap-1">
                  {analysis.patterns.isReactComponent && (
                    <Badge className="bg-blue-500/20 text-blue-400 text-xs">React</Badge>
                  )}
                  {analysis.patterns.hasTypeScript && (
                    <Badge className="bg-blue-500/20 text-blue-400 text-xs">TypeScript</Badge>
                  )}
                  {analysis.patterns.isUtilityFile && (
                    <Badge className="bg-green-500/20 text-green-400 text-xs">Utility</Badge>
                  )}
                  {analysis.patterns.isConfigFile && (
                    <Badge className="bg-orange-500/20 text-orange-400 text-xs">Config</Badge>
                  )}
                  {analysis.patterns.isTestFile && (
                    <Badge className="bg-purple-500/20 text-purple-400 text-xs">Test</Badge>
                  )}
                  {analysis.patterns.hasDefaultExport && (
                    <Badge className="bg-gray-500/20 text-gray-400 text-xs">Default Export</Badge>
                  )}
                </div>
              </div>

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div className="p-4 bg-[#1a1f2e] rounded-lg">
                  <h3 className="text-sm font-semibold text-white mb-2">Suggestions</h3>
                  <div className="space-y-2">
                    {analysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="p-2 bg-blue-500/10 border-l-2 border-blue-500 rounded">
                        <span className="text-xs text-blue-400">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground p-4">Click a node on the graph to inspect its details.</p>
      )}
    </div>
  )
}
