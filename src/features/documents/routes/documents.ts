import * as fs from "fs";

import { authenticate } from "@shared/middleware/authenticate.js";
import { decryptApiKeyMiddleware } from "@shared/middleware/decrypt.js";
import { downloadDocument } from "../controllers/document.js";
import express from "express";

export const routes = (privateKey: string) => {
  const router = express.Router();

  router.post(
    "/revise",
    decryptApiKeyMiddleware(privateKey),
    authenticate,
    downloadDocument
  );

  return router;
};
