import fs from 'fs';

// Prepare PDF to send to OpenAI API
export const preparePDFForOpenAI = async (filePath) => {
    try {
        const fileContent = await fs.promises.readFile(filePath);
        const base64Content = fileContent.toString('base64');
        return base64Content;
    } catch (error) {
        console.error(`Error reading PDF file: ${error.message}`);
        throw error;
    }
}