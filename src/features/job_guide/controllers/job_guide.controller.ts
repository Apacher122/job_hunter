import { Request, Response } from 'express';

import { getGuidingAnswers } from '../services/guiding_answers.service.js';

export const handleLoadJobGuide  = async (
    req: Request,
    res: Response
): Promise<void> => {
    const jobPostId = Number(req.query.id);
    const getNew = Boolean(req.query.getNew);

    try {
        const guidingAnswers = await getGuidingAnswers(jobPostId, getNew);
        res.json({ success: true, guidingAnswers });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }

}