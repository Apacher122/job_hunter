import { Request, Response } from 'express';
import fs from 'fs';

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
    } catch (error) {
        res.status(500).send('Error reading file');
    }
}