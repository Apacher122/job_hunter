import path from 'path';

export const validatePath = (filePath) => {
    // Implement path validation logic if necessary
    if (path.isAbsolute(filePath) && !filePath.includes('..')) {
      return filePath;
    }
    throw new Error('Invalid file path');
} 