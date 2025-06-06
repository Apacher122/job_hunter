
// Format new LaTeX content from the zod object returned by openai

import { promises as fsPromises } from 'fs';

export const preparePDFForOpenAI = async (filePath: string) => {
    try {
        const fileContent = await fsPromises.readFile(filePath);
        const base64Content = fileContent.toString('base64');
        return base64Content;
    } catch (error) {
        const e = error as Error;
        console.error(`Error reading PDF file: ${e.message}`);
        throw error;
    }
}

export const parseJSONData = async (filePath: string) => {
    try {
        const data = await fsPromises.readFile(filePath, 'utf-8');
        const parsedData = JSON.parse(data);
        return JSON.stringify(parsedData)
    } catch (error) {
        const e = error as Error;
        console.error(`Could not parse JSON data ${e.message}`);
        throw error;
    }
}