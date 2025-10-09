import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { Edge } from '@xyflow/react';
import type { CustomNode, FileNodeData } from './types';

export interface CodeAnalysis {
  summary: string;
  purpose: string;
  keyFeatures: string[];
  complexity: {
    score: number;
    explanation: string;
  };
  suggestions: string[];
  metrics: {
    linesOfCode: number;
    functions: number;
    classes: number;
    exports: number;
    imports: number;
  };
  patterns: {
    isReactComponent: boolean;
    isUtilityFile: boolean;
    isConfigFile: boolean;
    isTestFile: boolean;
    hasDefaultExport: boolean;
    hasTypeScript: boolean;
  };
}

export interface AnalyzedNode extends CustomNode {
  data: FileNodeData & {
    analysis?: {
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
    };
  };
}

export async function analyzeCode(code: string, filename: string): Promise<CodeAnalysis> {
  try {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'decorators-legacy'],
    });

    const analysis = {
      functions: 0,
      classes: 0,
      exports: 0,
      imports: 0,
      complexity: 0,
      reactComponents: 0,
      hooks: 0,
      interfaces: 0,
      types: 0,
      patterns: {
        isReactComponent: false,
        isUtilityFile: false,
        isConfigFile: false,
        isTestFile: false,
        hasDefaultExport: false,
        hasTypeScript: false,
      }
    };

    const traverseFn = (traverse as any).default || traverse;

    traverseFn(ast, {
      FunctionDeclaration(path: any) {
        analysis.functions++;
        analysis.complexity += calculateCyclomaticComplexity(path.node);
        
        // Check for React component patterns
        if (path.node.id?.name && /^[A-Z]/.test(path.node.id.name)) {
          analysis.reactComponents++;
          analysis.patterns.isReactComponent = true;
        }
      },

      ArrowFunctionExpression(path: any) {
        analysis.functions++;
        analysis.complexity += calculateCyclomaticComplexity(path.node);
      },

      FunctionExpression(path: any) {
        analysis.functions++;
        analysis.complexity += calculateCyclomaticComplexity(path.node);
      },

      ClassDeclaration(path: any) {
        analysis.classes++;
        if (path.node.id?.name && /^[A-Z]/.test(path.node.id.name)) {
          analysis.reactComponents++;
          analysis.patterns.isReactComponent = true;
        }
      },

      TSInterfaceDeclaration() {
        analysis.interfaces++;
        analysis.patterns.hasTypeScript = true;
      },

      TSTypeAliasDeclaration() {
        analysis.types++;
        analysis.patterns.hasTypeScript = true;
      },

      ExportDefaultDeclaration() {
        analysis.exports++;
        analysis.patterns.hasDefaultExport = true;
      },

      ExportNamedDeclaration() {
        analysis.exports++;
      },

      ImportDeclaration(path: any) {
        analysis.imports++;
        const source = path.node.source.value;
        if (source.includes('react')) {
          analysis.patterns.isReactComponent = true;
        }
      },

      CallExpression(path: any) {
        const callee = path.node.callee;
        if (callee.name && callee.name.startsWith('use')) {
          analysis.hooks++;
          analysis.patterns.isReactComponent = true;
        }
      }
    });

    // Determine file patterns
    const lowerFilename = filename.toLowerCase();
    analysis.patterns.isConfigFile = lowerFilename.includes('config') || 
      lowerFilename.includes('.config.') || 
      filename.endsWith('.json') ||
      filename.includes('package.json') ||
      filename.includes('tsconfig') ||
      filename.includes('tailwind');
    
    analysis.patterns.isTestFile = lowerFilename.includes('test') || 
      lowerFilename.includes('spec') || 
      lowerFilename.includes('.test.') || 
      lowerFilename.includes('.spec.');

    analysis.patterns.isUtilityFile = lowerFilename.includes('util') || 
      lowerFilename.includes('helper') || 
      lowerFilename.includes('lib') ||
      lowerFilename.includes('constants') ||
      (analysis.functions > 2 && analysis.reactComponents === 0);

    const linesOfCode = code.split('\n').filter(line => line.trim()).length;

    // Generate insights
    const keyFeatures = generateKeyFeatures(analysis, filename);
    const purpose = generatePurpose(analysis, filename);
    const summary = generateSummary(analysis, filename, linesOfCode);
    const suggestions = generateSuggestions(analysis, linesOfCode);
    const complexityScore = Math.min(10, Math.max(1, Math.round(analysis.complexity / Math.max(1, analysis.functions))));

    return {
      summary,
      purpose,
      keyFeatures,
      complexity: {
        score: complexityScore,
        explanation: `Complexity score based on cyclomatic complexity (${analysis.complexity}) across ${analysis.functions} functions. ${complexityScore <= 3 ? 'Low complexity - easy to maintain.' : complexityScore <= 6 ? 'Moderate complexity - manageable.' : 'High complexity - consider refactoring.'}`
      },
      suggestions,
      metrics: {
        linesOfCode,
        functions: analysis.functions,
        classes: analysis.classes,
        exports: analysis.exports,
        imports: analysis.imports,
      },
      patterns: analysis.patterns
    };

  } catch (error) {
    // Fallback analysis for unparseable files
    const linesOfCode = code.split('\n').filter(line => line.trim()).length;
    const lowerFilename = filename.toLowerCase();
    
    return {
      summary: `Unable to parse ${filename} - analyzing as text file.`,
      purpose: determineFilePurposeFromName(filename),
      keyFeatures: ['Text/configuration file', 'Manual review recommended'],
      complexity: {
        score: 1,
        explanation: 'Cannot analyze complexity - not a parseable code file.'
      },
      suggestions: ['Check if this is a valid JavaScript/TypeScript file', 'Consider file format and syntax'],
      metrics: {
        linesOfCode,
        functions: 0,
        classes: 0,
        exports: 0,
        imports: 0,
      },
      patterns: {
        isReactComponent: lowerFilename.includes('component') || filename.endsWith('.tsx'),
        isUtilityFile: lowerFilename.includes('util') || lowerFilename.includes('helper'),
        isConfigFile: lowerFilename.includes('config') || filename.endsWith('.json'),
        isTestFile: lowerFilename.includes('test') || lowerFilename.includes('spec'),
        hasDefaultExport: false,
        hasTypeScript: filename.endsWith('.ts') || filename.endsWith('.tsx'),
      }
    };
  }
}

// Graph-based analysis functions for layout system
export function analyzeCodebase(nodes: CustomNode[], edges: Edge[]): AnalyzedNode[] {
  return nodes.map(node => {
    const incomingEdges = edges.filter(edge => edge.target === node.id);
    const outgoingEdges = edges.filter(edge => edge.source === node.id);
    
    // Identify unused files (no incoming dependencies)
    const isUnused = incomingEdges.length === 0 && outgoingEdges.length === 0;
    
    // Calculate complexity metrics
    const complexity = {
      cyclomaticComplexity: calculateComplexityForNode(node),
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

// Helper functions for graph analysis
function calculateComplexityForNode(node: CustomNode): number {
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

function isUtilityFile(node: AnalyzedNode): boolean {
  // Identify utility files based on naming and usage patterns
  const isUtilName = node.id.includes('util') || node.id.includes('helper');
  const dependencyCount = node.data.analysis?.complexity.dependencyCount || 0;
  const hasHighDependents = dependencyCount > 3;
  return isUtilName || hasHighDependents;
}

// Helper functions for individual file analysis
function calculateCyclomaticComplexity(node: any): number {
  let complexity = 1; // Base complexity

  // Count decision points
  if (node.type === 'IfStatement') complexity++;
  if (node.type === 'WhileStatement') complexity++;
  if (node.type === 'ForStatement') complexity++;
  if (node.type === 'SwitchCase') complexity++;
  if (node.type === 'ConditionalExpression') complexity++;
  if (node.type === 'LogicalExpression' && (node.operator === '&&' || node.operator === '||')) complexity++;

  return complexity;
}

function generateKeyFeatures(analysis: any, filename: string): string[] {
  const features = [];

  if (analysis.patterns.isReactComponent) {
    features.push(`React component with ${analysis.reactComponents} component(s)`);
    if (analysis.hooks > 0) features.push(`Uses ${analysis.hooks} React hooks`);
  }

  if (analysis.patterns.hasTypeScript) {
    features.push(`TypeScript file with ${analysis.interfaces} interfaces and ${analysis.types} type aliases`);
  }

  if (analysis.functions > 0) {
    features.push(`${analysis.functions} function(s) defined`);
  }

  if (analysis.classes > 0) {
    features.push(`${analysis.classes} class(es) defined`);
  }

  if (analysis.exports > 0) {
    features.push(`Exports ${analysis.exports} item(s)`);
  }

  if (analysis.imports > 0) {
    features.push(`Imports from ${analysis.imports} source(s)`);
  }

  if (analysis.patterns.isUtilityFile) {
    features.push('Utility/helper functions');
  }

  if (analysis.patterns.isConfigFile) {
    features.push('Configuration file');
  }

  if (analysis.patterns.isTestFile) {
    features.push('Test file');
  }

  return features.length > 0 ? features : ['Basic file structure'];
}

function generatePurpose(analysis: any, filename: string): string {
  if (analysis.patterns.isReactComponent) {
    return 'React component file that renders UI elements and manages component state.';
  }

  if (analysis.patterns.isConfigFile) {
    return 'Configuration file that defines settings and options for the application.';
  }

  if (analysis.patterns.isTestFile) {
    return 'Test file containing unit tests or integration tests for application functionality.';
  }

  if (analysis.patterns.isUtilityFile) {
    return 'Utility file providing reusable helper functions and common functionality.';
  }

  if (analysis.functions > analysis.classes) {
    return 'Module containing utility functions and business logic.';
  }

  if (analysis.classes > 0) {
    return 'Class-based module defining object-oriented structures and behaviors.';
  }

  if (analysis.patterns.hasTypeScript && (analysis.interfaces > 0 || analysis.types > 0)) {
    return 'TypeScript definition file containing type definitions and interfaces.';
  }

  return 'JavaScript/TypeScript module containing application code.';
}

function generateSummary(analysis: any, filename: string, linesOfCode: number): string {
  const fileType = analysis.patterns.isReactComponent ? 'React component' :
                  analysis.patterns.isConfigFile ? 'configuration file' :
                  analysis.patterns.isTestFile ? 'test file' :
                  analysis.patterns.isUtilityFile ? 'utility module' : 
                  analysis.patterns.hasTypeScript ? 'TypeScript module' : 'code module';

  return `${filename} is a ${fileType} with ${linesOfCode} lines of code. It contains ${analysis.functions} functions, ${analysis.classes} classes, and manages ${analysis.exports} exports with ${analysis.imports} imports.`;
}

function generateSuggestions(analysis: any, linesOfCode: number): string[] {
  const suggestions = [];

  if (linesOfCode > 300) {
    suggestions.push('Consider breaking this large file into smaller, more focused modules');
  }

  if (analysis.functions > 10) {
    suggestions.push('File contains many functions - consider grouping related functions into classes or separate modules');
  }

  if (analysis.complexity > 20) {
    suggestions.push('High complexity detected - consider refactoring complex functions');
  }

  if (analysis.exports === 0 && !analysis.patterns.isConfigFile) {
    suggestions.push('File has no exports - consider if this code should be exported or if it\'s dead code');
  }

  if (analysis.imports > 15) {
    suggestions.push('Many imports detected - consider if all dependencies are necessary');
  }

  if (analysis.patterns.isReactComponent && analysis.functions > 5) {
    suggestions.push('React component with many functions - consider breaking into smaller components');
  }

  if (!analysis.patterns.hasTypeScript && analysis.functions > 3) {
    suggestions.push('Consider adding TypeScript for better type safety');
  }

  return suggestions.length > 0 ? suggestions : ['Code structure looks good'];
}

function determineFilePurposeFromName(filename: string): string {
  const lower = filename.toLowerCase();
  
  if (lower.includes('config')) return 'Configuration file for application settings';
  if (lower.includes('test') || lower.includes('spec')) return 'Test file for application functionality';
  if (lower.includes('util') || lower.includes('helper')) return 'Utility functions and helper methods';
  if (lower.includes('component')) return 'UI component for the application';
  if (lower.includes('page')) return 'Page component or route handler';
  if (lower.includes('api')) return 'API route or service handler';
  if (lower.includes('hook')) return 'Custom React hook';
  if (lower.includes('context')) return 'React context provider';
  if (lower.includes('store')) return 'State management store';
  if (lower.includes('type') || lower.includes('interface')) return 'Type definitions and interfaces';
  
  return 'Application module or component';
}