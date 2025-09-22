import { Request, Response } from 'express';
import {
  fileExists,
  sendFileBuffer,
} from '../../../shared/utils/documents/file.helpers';

import { compileCoverLetter } from '../../cover_letter/services/cover_letter.service';
import { compile_resume } from '../../resume/services/resume.service';
import { getCompanyInfo } from '../../job_guide/services/company_info.service';
import { getGuidingAnswers } from '../../job_guide/services/guiding_answers.service';
import { getJobPost } from '../../../database/queries/old/job.queries';
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
  | 'guiding-questions'
  | 'company-info';

type ContentType = 'application/pdf' | 'text/plain';

interface DocConfig {
  pathFn: (company: string, id: number) => string;
  generate: (company: string, id: number) => Promise<void>;
  filename: (company: string, id: number) => string;
  contentType: ContentType;
}

const docConfig: Record<DocType, DocConfig> = {
  resume: {
    pathFn: paths.paths.movedResume,
    generate: async (_company, id) => compile_resume(id),
    filename: (company, id) => `${company}_resume_${id}.pdf`,
    contentType: 'application/pdf' as const,
  },
  'cover-letter': {
    pathFn: paths.paths.movedCoverLetter,
    generate: async (_company, id) => compileCoverLetter(id),
    filename: (company, id) => `${company}_cover_letter_${id}.pdf`,
    contentType: 'application/pdf',
  },
  'guiding-questions': {
    pathFn: paths.paths.guidingAnswers,
    generate: async (_company, id) => getGuidingAnswers(id),
    filename: (company, id) => `${company}_guiding_answers_${id}.md`,
    contentType: 'text/plain',
  },
  'company-info': {
    pathFn: paths.paths.companyInfo,
    generate: async (_company, id) => getCompanyInfo(id),
    filename: (company, id) => `${company}_company_info_${id}.md`,
    contentType: 'text/plain',
  },
};

const isValidDocType = (type: string): type is DocType => type in docConfig;

export const downloadDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  const docType = req.query.docType as DocType;
  const getNew = req.query.getNew === 'true';
  const id = Number(req.query.id);

  if (!isValidDocType(docType)) {
    return void res.status(400).send('Invalid doocument type');
  }

  if (Number.isNaN(id)) {
    return void res.status(400).send('Invalid document ID');
  }

  if (!id && (docType == 'resume' || docType == 'cover-letter')) {
    return void res.status(400).send('Invalid document request');
  }

  try {
    const jobPost = await getJobPost(id);
    const companyName = jobPost?.companyName;

    if (!companyName) {
      return void res.status(404).send('Company not found');
    }

    const { pathFn, generate, filename, contentType } = docConfig[docType];
    const filePath = pathFn(companyName, Number(id));

    if (!(await fileExists(filePath)) || getNew) {
      await generate(companyName, id);
    }
    await sendFileBuffer(res, filePath, filename(companyName, id), contentType);
  } catch (error) {
    console.error(`Error handling ${docType}:`, error);
    res.status(500).send(`Failed to generate ${docType}`);
  }
};
