import { Request, Response } from 'express';

import fs from 'fs';
import { logger } from '../logger.js';
import mammoth from 'mammoth';
import path from 'path';
import paths from '../../constants/paths.js';
import pdf from 'pdf-parse';

///////////////////////
// File Reading Logic //
///////////////////////

type Reader = (filePath: string) => Promise<string>;

const txtReader: Reader = (filePath) => fs.promises.readFile(filePath, 'utf-8');

const docxReader: Reader = async (filePath) => {
  const buffer = await fs.promises.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
};

const pdfReader: Reader = async (filePath) => {
  const dataBuffer = await fs.promises.readFile(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
};

const readers: Record<string, Reader> = {
  '.txt': txtReader,
  '.docx': docxReader,
  '.pdf': pdfReader,
};

export const extractTextFromFile = async (filePath: string): Promise<string> => {
  const ext = path.extname(filePath).toLowerCase();
  const reader = readers[ext];
  if (!reader) throw new Error(`Unsupported file type: ${ext}`);
  return reader(filePath);
};

//////////////////////////
// File System Utilities //
//////////////////////////

export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
};

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
    files.map(async (file: string) => {
      if (extensions.includes(path.extname(file))) {
        await fs.promises.unlink(path.join(dir, file));
      }
    })
  );
}

export const validatePath = (filePath: string): string => {
  if (path.isAbsolute(filePath) && !filePath.includes('..')) {
    return filePath;
  }
  throw new Error('Invalid file path');
};

//////////////////////
// Cleanup Function  //
//////////////////////

export const cleanup = async (title: string, type: 'resume' | 'cover_letter', id: number): Promise<void> => {
  if (fs.existsSync(paths.paths.changeReport)) {
    fs.truncateSync(paths.paths.changeReport, 0);
  }

  const filename = `${title}_${type}_${id}`

  const extensions = ['.aux', '.log', '.out'];

  extensions.forEach(file => {
    const filePath = path.join(paths.paths.dir, `${filename}${file}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
  logger.info('Temporary LaTeX files purged');
};

/////////////////////////
// Express Response Util //
/////////////////////////

export async function sendFileBuffer(
  res: Response,
  filePath: string,
  fileName: string,
  mimeType: 'application/pdf' | 'text/plain'
): Promise<void> {
  try {
    const fileBuffer = await fs.promises.readFile(filePath);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(fileBuffer);
  } catch {
    res.status(500).send('Error reading file');
  }
}
