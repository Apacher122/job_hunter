import * as fs from "fs";

import paths from "@shared/constants/paths.js";

export const initializeDocumentWorkspace = (uid: string, jobId: number) => {
  const tempFolder = paths.paths.tempDir(uid, jobId);
  const tempPdf = paths.paths.tempPdf(uid, jobId);
  const tempFolderCompiled = paths.latex.tempCompiled(uid, jobId);

  fs.mkdirSync(tempFolder, { recursive: true });
  fs.mkdirSync(tempPdf, { recursive: true });
  fs.mkdirSync(tempFolderCompiled, { recursive: true });

  return { tempFolder, tempPdf, tempFolderCompiled };
};
