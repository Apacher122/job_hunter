import fs from 'fs';
import { file } from 'googleapis/build/src/apis/file';
import path from 'path';
import mammoth from 'mammoth';
import pdf from 'pdf-parse';
import { logger } from '../logger.js';
import paths from '../../constants/paths.js';

export async function truncateFileIfExists(filePath: string): Promise<void> {
  try {
    await fs.promises.access(filePath);
    await fs.promises.truncate(filePath, 0);
  } catch {
    // file does not exist - no action needed
  }
}

export async function deleteFilesByExtensions(dir: string, extensions: string[]): Promise<void> {
  const files = await fs.promises.readdir(dir);
  await Promise.all(
    files.map(async (file) => {
      if (extensions.includes(path.extname(file))) {
        await fs.promises.unlink(path.join(dir, file));
      }
    })
  );
}

export const convertPDFToBase64 = async (filePath: string) => {
    try {
        const fileContent = await fs.promises.readFile(filePath);
        const base64Content = fileContent.toString('base64');
        return base64Content;
    } catch (error) {
        const e = error as Error;
        console.error(`Error reading PDF file: ${e.message}`);
        throw error;
    }
}

export const readTxt = async (filePath: string): Promise<string> => {
    return fs.promises.readFile(filePath, 'utf-8');
}

export const readDocx = async (filePath: string): Promise<string> => {
    const buffer = await fs.promises.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer: buffer });
    return result.value;
}

export const readPdf = async (filePath: string): Promise<string> => {
      const dataBuffer = await fs.promises.readFile(filePath);
      const data = await pdf(dataBuffer);
      return data.text; // The plain text content
}

export const extractTextFromFile = async (filePath: string): Promise<string> => {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.txt':
            return readTxt(filePath);
        case '.docx':
            return readDocx(filePath);
        case '.pdf':
            return readPdf(filePath);
        default:
            throw new Error(`Unsupported file type: ${ext}`);
    }
}


export const fileExists = async (path: string): Promise<boolean> => {
  try {
    await fs.promises.access(path);
    return true;
  } catch {
    return false;
  }
};

export const cleanup = async (): Promise<void> => {
  // Clean up old change report
  if (fs.existsSync(paths.paths.change_report)) {
    fs.truncateSync(paths.paths.change_report, 0);
  }

  // Clean up temporary files and old PDFs
  const extensions = ['.aux', '.log', '.out', `.pdf`];
  const files = fs.readdirSync(paths.paths.output_dir);

  files.forEach(file => {
    const filePath = path.join(paths.paths.output_dir, file);
    if (fs.existsSync(filePath) && extensions.includes(path.extname(file))) {
      fs.unlinkSync(filePath);
    }
  })
  logger.info('Temporary LaTeX files purged');
};