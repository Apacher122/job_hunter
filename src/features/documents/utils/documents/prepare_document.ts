import * as file from "@shared/utils/documents/file.helpers.js";
import * as schemas from "../../models/index.js";

import { docConfig } from "./doc_config.js";

export const generateIfNeeded = async (
  uid: string,
  companyName: string,
  docRequest: schemas.DocumentRequest
) => {
  type DocType = keyof typeof docConfig;
  const { pathFn, jsonPathFn, generate } = docConfig[docRequest.options.docType as DocType];
  const filePath = pathFn(uid, docRequest.options.jobId,);
  const jsonPath = jsonPathFn(uid, docRequest.options.docType);

  if (docRequest.options.getNew || !(await file.fileExists(filePath))) {
    await generate(
      uid,
      docRequest
    );
  }

  return {filePath, jsonPath};
};


