import * as fs from 'fs';

import { PDFDocument } from 'pdf-lib';

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
    // Read the input PDF file into a buffer
    const existingPdfBytes = fs.readFileSync(filePath);
  
    // Load the existing PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(new Uint8Array(existingPdfBytes));
  
    // Remove specified pages (pagesToRemove is an array of page indexes)
    const pages = pdfDoc.getPages();

    // Remove pages starting from the second page (index 1 onwards)
    for (let i = pages.length - 1; i >= 1; i--) {
        pdfDoc.removePage(i);
    }

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();
  
    // Write the modified PDF back to the same file
    fs.writeFileSync(filePath, pdfBytes);
};