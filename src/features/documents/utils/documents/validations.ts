import * as schemas from '../../models/index.js';

import { DocType, docConfig } from './docConfig.js';
import { ZodType, ZodTypeDef } from "zod";

export const isValidDocType = (type: string): type is DocType =>
  type in docConfig;

export const validateDocRequest = (
  docRequest: schemas.DocumentRequest
): { valid: boolean; error?: string } => {
  if (!docRequest.options.llm) return { valid: false, error: 'Invalid LLM provider.' };
  if (!isValidDocType(docRequest.options.docType) || Number.isNaN(docRequest.options.jobId))
    return { valid: false, error: 'Invalid document request' };
  return { valid: true };
};

const validateDocResponse = (res: unknown): schemas.ResumeItemsType => {
  if (!res)
    throw new Error(
      "No response was given by your selected LLM provider. Please try again."
    );

  const parsedResponse = schemas.ResumeSchema.safeParse(res);

  if (!parsedResponse.success) {
    throw new Error("An incorrect response was given by your selected LLM provider. Please try again.");
  }
  return parsedResponse.data;
};
