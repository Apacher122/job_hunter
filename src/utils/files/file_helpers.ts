import fs from 'fs';
import { file } from 'googleapis/build/src/apis/file';
import path from 'path';
import mammoth from 'mammoth';
import pdf from 'pdf-parse';

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
