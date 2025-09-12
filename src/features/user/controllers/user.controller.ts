import { Request, Response } from 'express';

import { getJobPostFromCall } from '../services/user.service';
import { insertRowToSheet } from '../../../shared/libs/google/sheets';
import { getApplicationList } from '../../../database/queries/job.queries';

export const sendJobInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        await getJobPostFromCall(req.body.text);
        res.status(200).json({ success: true, message: 'Job info processed successfully' });
    } catch (error) {
        const e = error as Error;
        console.error(`Error processing job info: ${e.message}`);
        res.status(500).json({ success: false, message: `Error processing job info: ${e.message}` });
    }
}

export const markApplication = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.body.text);
        console.log(req.body);
        await insertRowToSheet(id);
        res.status(200).json({ success: true, message: 'Resume added to sheet successfully' });
    } catch (error) {
        const e = error as Error;
        console.error(`Error adding resume to sheet: ${e.message}`);
        res.status(500).json({ success: false, message: `Error adding resume to sheet: ${e.message}` });
    }
}

export const getJobApplications = async (req: Request, res: Response): Promise<void> => {
    try {
        const jobs = await getApplicationList();
        res.json(jobs);
    } catch (error) {
        const e = error as Error;
        console.error(`Error fetching application list: ${e.message}`);
        res.status(500).json({ success: false, message: `Error fetching application list: ${e.message}` });
    }
}