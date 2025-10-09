# CodeCartography

**Visualize, analyze, and understand your codebase architecture like never before**

CodeCartography is a powerful web-based tool that transforms your codebase into an interactive dependency graph, providing deep insights into your project's structure, complexity, and potential issues.

![Demo](https://img.shields.io/badge/status-active-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)

## Features

### **Codebase Analysis**
- **Interactive Dependency Graph** - Visualize file relationships and dependencies
- **Circular Dependency Detection** - Automatically identifies problematic dependency cycles
- **Project Statistics** - View comprehensive metrics about your codebase
- **Code Preview** - Hover over nodes to see file content snippets

### **Advanced Code Intelligence**
- **Static Code Analysis** - Deep AST-based analysis using Babel parser
- **Complexity Scoring** - Cyclomatic complexity calculation for each file
- **Pattern Recognition** - Identifies React components, utilities, configs, and test files
- **Code Quality Insights** - Get actionable suggestions for improvement

### **Rich Analytics Dashboard**
- **File Metrics** - Lines of code, functions, classes, imports/exports
- **Architecture Insights** - Purpose detection and file categorization
- **Refactoring Suggestions** - Intelligent recommendations for code improvements
- **TypeScript Support** - Full analysis of TypeScript projects

### **Modern User Experience**
- **Dark Theme Interface** - Beautiful, professional dark-themed UI
- **Smooth Animations** - Powered by Framer Motion for fluid interactions
- **Responsive Design** - Works seamlessly across different screen sizes
- **Real-time Updates** - Live analysis and visualization updates

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/CodeCartography.git
   cd CodeCartography
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

1. **Launch the App** - Click "Start Visualizing" on the homepage
2. **Enter Project Path** - Provide the absolute path to your project directory
3. **Analyze Codebase** - Click "Analyze Project" to generate the dependency graph
4. **Explore Insights** - Navigate the interactive graph and inspect individual files
5. **Deep Dive Analysis** - Click "Analyze Code" on any file node for detailed insights

### Supported File Types
- JavaScript (`.js`, `.jsx`, `.mjs`, `.cjs`)
- TypeScript (`.ts`, `.tsx`)
- All common web development file formats

## Technology Stack

### Core Framework
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[React](https://reactjs.org/)** - UI library

### Visualization & UI
- **[@xyflow/react](https://reactflow.dev/)** - Interactive graph visualization
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

### Code Analysis Engine
- **[@babel/parser](https://babeljs.io/docs/en/babel-parser)** - JavaScript/TypeScript AST parsing
- **[@babel/traverse](https://babeljs.io/docs/en/babel-traverse)** - AST traversal and analysis
- **[D3.js](https://d3js.org/)** - Data-driven graph layout algorithms

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting (via formatting tools)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── analyze/           # Main codebase analysis endpoint
│   │   │   ├── file/          # Individual file analysis endpoint
│   │   │   └── route.ts
│   │   └── readFile/          # File reading utilities
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx              # Homepage
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── code-graph.tsx        # Main graph visualization
│   ├── codebase-visualizer.tsx # Main app interface
│   ├── node-inspector-panel.tsx # File analysis panel
│   ├── controls-panel.tsx    # Project input controls
│   ├── project-info-panel.tsx # Project statistics
│   └── code-preview-card.tsx # Hover preview component
├── lib/
│   ├── analyzer.ts           # Codebase scanning and parsing
│   ├── code-analyzer.ts      # Individual file analysis
│   ├── enhanced-layout.ts    # Graph layout algorithms
│   ├── types.ts             # TypeScript definitions
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## Analysis Capabilities

### Code Quality Metrics
- **Cyclomatic Complexity** - Measure code complexity and maintainability
- **Dependency Analysis** - Track imports, exports, and file relationships
- **Architecture Patterns** - Identify components, utilities, configs, and tests
- **Code Statistics** - Lines of code, function count, class definitions

### Intelligent Suggestions
- **Refactoring Recommendations** - Break down large files and complex functions
- **Best Practices** - TypeScript adoption, proper exports, dependency management
- **Architecture Insights** - Component decomposition and module organization

## Use Cases

- **Code Reviews** - Understand impact of changes across the codebase
- **Refactoring** - Identify complex areas that need attention
- **Onboarding** - Help new team members understand project structure
- **Architecture Planning** - Visualize and improve code organization
- **Technical Debt** - Find unused code and circular dependencies

## Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with the amazing [React Flow](https://reactflow.dev/) library
- Code analysis powered by [Babel](https://babeljs.io/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

**CodeCartography** - *Mapping the DNA of your code*