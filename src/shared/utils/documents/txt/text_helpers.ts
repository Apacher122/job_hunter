import * as fs from 'fs';

export const appendTextToFile = async (filePath: string, text: string): Promise<void> => {
  try {
    await fs.promises.appendFile(filePath, text + '\n', 'utf-8');
  } catch (error) {
    const e = error as Error;
    console.error(`Error appending text to file: ${e.message}`);
    throw error;
  }
}