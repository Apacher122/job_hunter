import fs from 'fs';
import path from 'path';

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