import * as fs from "fs";

import {
  getJobApplications,
  newJobHandler,
} from "../controllers/app_tracker.js";

import { authenticate } from "@shared/middleware/authenticate.js";
import { decryptApiKeyMiddleware } from "@shared/middleware/decrypt.js";
import express from "express";
import rateLimit from "express-rate-limit";

// Rate limiter: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

export const routes = (privateKey: string) => {
  const router = express.Router();
  router.post(
    "/track-job",
    decryptApiKeyMiddleware(privateKey),
    authenticate,
    newJobHandler
  );
  // router.post('/applied', );
  // router.get('/get-list', );
  router.post("/list", authenticate, getJobApplications);

  return router;
};
