import * as file from "@shared/utils/documents/file.helpers.js";
import * as fs from "fs";
import * as path from "path";

import { Response } from "express";
import { docConfig } from "./doc_config.js";

export const sendDocument = async (
  res: Response,
  docType: "resume" | "cover-letter",
  companyName: string,
  jobId: number,
  filePath: string
) => {
  const { filename, contentType } = docConfig[docType];
  if (await file.fileExists(filePath)) {
    await file.sendFileBuffer(
      res,
      filePath,
      filename(companyName, jobId),
      contentType
    );
  }
};

export const sendMultipartWithJson = async (
  res: Response,
  docType: "resume" | "cover-letter",
  companyName: string,
  jobId: number,
  pdfPath: string,
  jsonPath: string,
) => {
  const boundary = `----WebKitFormBoundary${Date.now().toString(16)}`;
  res.setHeader("Content-Type", `multipart/form-data; boundary=${boundary}`);

  const { filename } = docConfig[docType];
  const pdfFileName = filename(companyName, jobId);
  const jsonFileName = pdfFileName.replace(".pdf", ".json");

  const pdfContent = await fs.promises.readFile(path.join(pdfPath, pdfFileName));
  const jsonContent = await fs.promises.readFile(path.join(jsonPath, jsonFileName));

  const parts = [
    {
      headers: {
        "Content-Disposition": `form-data; name="file"; filename="${pdfFileName}"`,
        "Content-Type": "application/pdf",
      },
      body: pdfContent,
    },
    {
      headers: {
        "Content-Disposition": `form-data; name="file"; filename="${jsonFileName}"`,
        "Content-Type": "application/json",
      },
      body: jsonContent,
    },
  ];

  const body = parts
    .map((part) => {
      const headers = Object.entries(part.headers)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\r\n");
      return `--${boundary}\r\n${headers}\r\n\r\n${part.body.toString(
        "binary"
      )}`;
    })
    .join("\r\n");

  const finalBody = `${body}\r\n--${boundary}--\r\n`;

  res.status(200).send(Buffer.from(finalBody, "binary"));
};