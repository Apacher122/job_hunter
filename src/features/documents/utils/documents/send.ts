import * as file from "@shared/utils/documents/file.helpers.js";

import { Response } from 'express';
import { docConfig } from './docConfig.js';

export const sendDocument = async (
  res: Response,
  docType: 'resume' | 'cover-letter',
  companyName: string,
  jobId: number,
  filePath: string
) => {
  const { filename, contentType } = docConfig[docType];
  if (await file.fileExists(filePath)) {
    await file.sendFileBuffer(res, filePath, filename(companyName, jobId), contentType);
  }
};
