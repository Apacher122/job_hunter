import * as compileDoc from '../services/index'
import * as db from '../../../database';
import * as docs from '../services'
import * as file from '../../../shared/utils/documents/file.helpers';

import { CoverLetterSchema, ResumeSchema } from '../models/requests';
import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../../../shared/middleware/authenticate';
import { LLMHeaders } from '../../../shared/types/llm.types';
import { auth } from 'firebase-admin';
import { getFullJobPosting } from '../../../database/queries/complex/jobs.queries';
import { getJobPost } from '../../../database/queries/old/job.queries';
import paths from '../../../shared/constants/paths';
import z from 'zod';

const filePathFor = (companyName: string, suffix: 'resume' | 'cover-letter') =>
  suffix === 'resume'
    ? paths.paths.movedResume(companyName)
    : paths.paths.movedCoverLetter(companyName);

const generatorFor = (suffix: 'resume' | 'cover-letter') =>
  suffix === 'resume' ? compileDoc.compileResume : compileDoc.compileCoverLetter;

type DocType =
  | 'resume'
  | 'cover-letter';

type ContentType = 'application/pdf' | 'text/plain';

interface DocConfig {
  pathFn: (company: string, id: string) => string;
  generate: (company: string, jobId: number, uid: string, headers?: LLMHeaders) => Promise<void>;
  filename: (company: string, id: string) => string;
  contentType: ContentType;
}

const docConfig: Record<DocType, DocConfig> = {
  resume: {
    pathFn: paths.paths.movedResume,
    generate: async (_company, jobId, uid, headers) => compileDoc.compileResume(jobId, uid, headers),
    filename: (company, uid) => `${company}_resume_${uid}.pdf`,
    contentType: 'application/pdf' as const,
  },
  'cover-letter': {
    pathFn: paths.paths.movedCoverLetter,
    generate: async (_company, uid) => compileDoc.compileCoverLetter(Number(uid)),
    filename: (company, uid) => `${company}_cover_letter_${uid}.pdf`,
    contentType: 'application/pdf',
  },
};

const isValidDocType = (type: string): type is DocType => type in docConfig;

export const downloadDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authReq = req as AuthenticatedRequest;
  const docType = req.query.docType as DocType;
  const getNew = req.query.getNew === 'true';
  const jobId = Number(req.query.jobId);
  const headers = req.headers as unknown as LLMHeaders;
  const uid = authReq.user.uid;

  if (!isValidDocType(docType) || Number.isNaN(jobId)) {
    return void res.status(400).send('Invalid document request');
  }

  try {
    const jobPost = await db.getFullJobPosting(jobId, uid);
    const companyName = jobPost?.company_name;

    if (!companyName) {
      return void res.status(404).send('No job post found.');
    }

    const { pathFn, generate, filename, contentType } = docConfig[docType];
    const filePath = pathFn(companyName, authReq.user.uid);

    if (!(await file.fileExists(filePath)) || getNew) {
      await generate(companyName, jobId, uid, headers);
      await file.sendFileBuffer(res, filePath, filename(companyName, authReq.user.uid), contentType);
    } else {
      res.status(200).sendFile(filePath, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename(companyName, authReq.user.uid)}"`,
        },
      });
    }
  } catch (error) {
    console.error(`Error handling ${docType}:`, error);
    res.status(500).send(`Failed to generate ${docType}`);
  }
};
