import { type NextRequest, NextResponse } from "next/server"
import { analyzeCodebase } from "@/lib/analyzer"
import type { AnalyzeRequest } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json()
    const { directoryPath } = body

    if (!directoryPath) {
      return NextResponse.json({ error: "Directory path is required" }, { status: 400 })
    }

    const result = await analyzeCodebase(directoryPath)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze codebase" },
      { status: 500 },
    )
  }
}
