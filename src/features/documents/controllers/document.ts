import * as db from "@database/index.js";
import * as docs from "../utils/documents/index.js";
import * as schemas from "../models/index.js";

import { Request, Response } from "express";

import { AuthenticatedRequest } from "@shared/middleware/authenticate.js";
import { ErrorCodes } from "@shared/types/errorTypes.js";

export const downloadDocument = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const uid = authReq.user.uid;

  const parsedData = schemas.DocumentRequestSchema.safeParse(req.body);
  if (!parsedData.success) {
    return void res.sendError(
      400,
      ErrorCodes.VALIDATION_FAILED,
      "There was an error processing your form. Make sure to fill out all required fields.",
      parsedData.error
    );
  }

  const { valid, error } = docs.validateDocRequest(parsedData.data);
  if (!valid) {
    return void res.sendError(
      400,
      ErrorCodes.VALIDATION_FAILED,
      "One or more fields contained an invalid value",
      error
    );
  }

  try {
    const companyName = await getCompanyName(
      parsedData.data.options.jobId,
      uid
    );
    if (!companyName) return void res.status(404).send("No job post found.");

    const filePath = await docs.generateIfNeeded(
      uid,
      companyName,
      parsedData.data
    );
    await docs.sendDocument(
      res,
      parsedData.data.options.docType,
      companyName,
      parsedData.data.options.jobId,
      filePath
    );
  } catch (err) {
    console.error(`Error handling ${parsedData.data.options.docType}:`, err);
    res.sendError(
      500,
      ErrorCodes.RESOURCE_CREATION_ERROR,
      "We ran into an error processing your resume. Please try again.",
      err
    );
  }
};

const getCompanyName = async (jobId: number, uid: string) => {
  const jobPost = await db.getFullJobPosting(jobId, uid);
  return jobPost?.company_name;
};
