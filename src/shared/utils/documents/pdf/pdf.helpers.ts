import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

export const convertPDFToBase64 = async (filePath: string) => {
    try {
        const fileContent = await fs.promises.readFile(filePath);
        const base64Content = fileContent.toString('base64');
        return base64Content;
    } catch (error) {
        const e = error as Error;
        console.error(`Error reading PDF file: ${e.message}`);
        return null
    }
}

export const forceSinglePagePDF = async(filePath: string): Promise<void> => {
    const existingPdfBytes = fs.readFileSync(filePath);  
    const pdfDoc = await PDFDocument.load(new Uint8Array(existingPdfBytes));  
    const pages = pdfDoc.getPages();

    for (let i = pages.length - 1; i >= 1; i--) {
        pdfDoc.removePage(i);
    }

    const pdfBytes = await pdfDoc.save();
  
    fs.writeFileSync(filePath, pdfBytes);
};