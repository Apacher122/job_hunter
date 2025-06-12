import { Request, Response } from 'express';

import { getJobPostFromCall } from '../services/user.service';
import { insertRowToSheet } from '../../shared/libs/google/sheets';

export const sendJobInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        const jobPost = await getJobPostFromCall(req.body.text);
        res.status(200).json({ success: true, message: 'Job info processed successfully' });
    } catch (error) {
        const e = error as Error;
        console.error(`Error processing job info: ${e.message}`);
        res.status(500).json({ success: false, message: `Error processing job info: ${e.message}` });
    }
}

export const markApplication = async (req: Request, res: Response): Promise<void> => {
    try {
        await insertRowToSheet();
        res.status(200).json({ success: true, message: 'Resume added to sheet successfully' });
    } catch (error) {
        const e = error as Error;
        console.error(`Error adding resume to sheet: ${e.message}`);
        res.status(500).json({ success: false, message: `Error adding resume to sheet: ${e.message}` });
    }
}