import { Request, Response } from 'express';
import { fileExists, sendFileBuffer } from '../../../shared/utils/documents/file.helpers';

import { compileCoverLetter } from '../../cover_letter/services/cover_letter.service';
import { compile_resume } from '../../resume/services/resume.service';
import { getCompanyInfo } from '../../job_guide/services/company_info.service';
import { getGuidingAnswers } from '../../job_guide/services/guiding_answers.service';
import { getMatchSummary } from '../../job_guide/services/match_summarizer.service';
import { infoStore as info } from '../../../shared/data/info.store.js';
import paths from '../../../shared/constants/paths';

const filePathFor = (companyName: string, suffix: 'resume' | 'cover-letter') =>
    suffix === 'resume'
? paths.paths.movedResume(companyName)
: paths.paths.movedCoverLetter(companyName);

const generatorFor = (suffix: 'resume' | 'cover-letter') =>
    suffix === 'resume' ? compile_resume : compileCoverLetter;

type DocType =
| 'resume'
| 'cover-letter'
| 'match-summary'
| 'guiding-questions'
| 'company-info';

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
    'company-info': {
        pathFn: paths.paths.companyInfo,
        generate: getCompanyInfo,
        filename: company => `${company}_company_info.md`,
        contentType: 'text/plain',
    },
};

const isValidDocType = (type: string): type is DocType => type in docConfig;

export const downloadDocument = async (req: Request, res: Response): Promise<void> => {
    const companyName = info.jobPosting?.companyName;
    const docType = req.query.docType as DocType;
    const getNew = req.query.getNew === 'true';
    
    if (!companyName || !isValidDocType(docType)) {
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