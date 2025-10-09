// Type definitions for VS Code/Electron file handling
export interface FileWithPath extends File {
  path: string;
}

export interface ElectronDialog {
  showOpenDialog(options: {
    properties: string[];
  }): Promise<{ filePaths: string[] }>;
}

declare global {
  interface Window {
    electron?: {
      showOpenDialog: ElectronDialog['showOpenDialog'];
    };
  }
}

export const isFileWithPath = (file: File): file is FileWithPath => {
  return 'path' in file;
};

export const showDirectoryPicker = async (): Promise<string | null> => {
  try {
    // Try to use the Electron dialog if available
    if (window.electron?.showOpenDialog) {
      const result = await window.electron.showOpenDialog({
        properties: ['openDirectory']
      });
      return result.filePaths[0] || null;
    }
  } catch (error) {
    console.warn('Electron dialog not available:', error);
  }
  return null;
};

export const getDirectoryPath = (file: FileWithPath): string => {
  // If it's already a directory (has no extension), return the path as is
  if (!file.name.includes('.')) {
    return file.path;
  }
  
  // Otherwise, get the parent directory path
  const pathSeparator = file.path.includes('\\') ? '\\' : '/';
  return file.path.split(pathSeparator).slice(0, -1).join(pathSeparator);
};