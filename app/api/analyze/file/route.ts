import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { analyzeCode } from '../../../../lib/code-analyzer';

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json();

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    // Read the file content
    let code = '';
    let filename = '';
    
    try {
      // Handle relative paths by joining with current working directory
      const fullPath = filePath.startsWith('/') || filePath.includes(':') 
        ? filePath 
        : join(process.cwd(), filePath);
      
      code = await readFile(fullPath, 'utf-8');
      filename = filePath.split(/[\/\\]/).pop() || filePath;
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to read file', details: error },
        { status: 404 }
      );
    }

    // Analyze the code
    const analysis = await analyzeCode(code, filename);

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze code', details: error },
      { status: 500 }
    );
  }
}