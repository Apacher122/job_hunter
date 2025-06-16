import { Request, Response } from 'express';

import { generateChangeReport } from '../services/resume.service';
import paths from '../../shared/constants/paths';
import { sendFileBuffer } from '../../shared/utils/documents/file.helpers';

export const getResumeChanges = async (req: Request, res: Response): Promise<void> => {
    try {
        await generateChangeReport();
        await sendFileBuffer(
            res,
            paths.paths.changeReport,
            'change_report.md',
            'text/plain',
        );

    } catch (error) {
        const e = error as Error;
        console.error(`Error fetching resume changes: ${e.message}`);
        res.status(500).json({ success: false, message: `Error fetching resume changes: ${e.message}` });
    }
}