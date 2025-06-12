import { Request, Response } from 'express';

import { compileCoverLetter } from '../services/cover_letter/cover_letter_service';
import { compile_resume } from '../services/resume/resume_service';
import { fileExists } from '../shared/utils/files/file_helpers';
import { getGuidingAnswers } from '../services/review/guiding_answers';
import { getMatchSummary } from '../services/review/match_summarizer';
import { infoStore as info } from '../shared/data/info_store.js';
import { insertRowToSheet } from '../shared/libs/google/sheets';
import paths from '../shared/constants/paths';
import { sendFileBuffer } from '../shared/utils/request_response';

const filePathFor = (companyName: string, suffix: 'resume' | 'cover-letter') =>
    suffix === 'resume'
? paths.paths.movedResume(companyName)
: paths.paths.movedCoverLetter(companyName);

const generatorFor = (suffix: 'resume' | 'cover-letter') =>
    suffix === 'resume' ? compile_resume : compileCoverLetter;

// Supported document types
type DocType =
| 'resume'
| 'cover-letter'
| 'match-summary'
| 'guiding-questions';

// Map document types to paths and generators
const docConfig: Record<
DocType,
{
    pathFn: (company: string) => string;
    generate: () => Promise<void>;
    filename: (company: string) => string;
    contentType: 'application/pdf' | 'text/plain';
}
> = {
    resume: {
        pathFn: paths.paths.movedResume,
        generate: compile_resume,
        filename: company => `${company}_resume.pdf`,
        contentType: 'application/pdf' as const,
    },
    'cover-letter': {
        pathFn: paths.paths.movedCoverLetter,
        generate: compileCoverLetter,
        filename: company => `${company}_cover_letter.pdf`,
        contentType: 'application/pdf',
    },
    'match-summary': {
        pathFn: paths.paths.matchSummary,
        generate: getMatchSummary,
        filename: company => `${company}_match_summary.md`,
        contentType: 'text/plain' as const,
    },
    'guiding-questions': {
        pathFn: paths.paths.guidingAnswers,
        generate: getGuidingAnswers,
        filename: company => `${company}_guiding_answers.md`,
        contentType: 'text/plain',
    },
};

export const downloadDocument = async (req: Request, res: Response): Promise<void> => {
    const companyName = info.jobPosting?.companyName;
    const docType = req.query.docType as DocType;
    const getNew = req.query.getNew === 'true';
    
    if (!companyName || !docType || !docConfig[docType]) {
        return void res.status(400).send('Invalid document request');
    }
    
    const { pathFn, generate, filename, contentType } = docConfig[docType];
    const filePath = pathFn(companyName);
    
    try {
        if (!(await fileExists(filePath)) || getNew) {
            await generate();
        }
        await sendFileBuffer(res, filePath, filename(companyName), contentType);
    } catch (error) {
        console.error(`Error handling ${docType}:`, error);
        res.status(500).send(`Looks like there isn't a Resume or Cover Letter for ${companyName} yet.`);
    }
};

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