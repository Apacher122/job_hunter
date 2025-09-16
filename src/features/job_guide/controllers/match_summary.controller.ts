import { getMatchSummary, fetchMatchSumary } from '../services/v2/match_summarizer.service';
import { Request, Response } from 'express';

export const handleLoadMatchSummary = async (
    req: Request,
    res: Response
): Promise<void> => {
    const jobPostId = Number(req.query.id);
    const getNew = Boolean(req.query.getNew);

    if (process.env.NODE_ENV !== 'testing' && jobPostId == 0) {
        console.log('Preventing creation of trash')
        return;
    }

    try {
        const matchSummary = await getMatchSummary(jobPostId, getNew);
        res.json({ success: true, matchSummary });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }

}