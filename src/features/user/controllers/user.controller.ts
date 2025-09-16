import { Request, Response } from 'express';

import { getJobPostFromCall, setJobApplied, updateJobInfo } from '../services/user.service';
import { insertRowToSheet } from '../../../shared/libs/google/sheets';
import { getApplicationList } from '../../../database/queries/v2/job.queries';
import { AppliedJob } from '../../../shared/types/types';

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

export const markApplication = async (req: Request, res: Response ): Promise<void> => {
    try {
        const id = Number(req.body.id);
        const applied = Boolean(req.body.applied);
        await setJobApplied(id, applied);
        await insertRowToSheet(id);
        res.status(200).json({ success: true, message: 'Job marked as applied' });
    } catch (error) {
        const e = error as Error;
        console.error(`Error adding resume to sheet: ${e.message}`);
        res.status(500).json({ success: false, message: `Error marking job as applied: ${e.message}` });
    }
}

export const getJobApplications = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Getting Application List');
        const jobs = await getApplicationList();
        res.json(jobs);
    } catch (error) {
        const e = error as Error;
        console.error(`Error fetching application list: ${e.message}`);
        res.status(500).json({ success: false, message: `Error fetching application list: ${e.message}` });
    }
}

export const updateJobs = async (req: Request, res: Response): Promise<void> => {
    try {
        const appliedJob: AppliedJob = req.body;
        const id = appliedJob.id;
        console.log(req.body);
        await updateJobInfo(Number(id), appliedJob);
    } catch (err) {
        throw new Error('OH NO');
    }
}