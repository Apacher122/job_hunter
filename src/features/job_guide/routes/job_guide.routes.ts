import { authenticate } from '@shared/middleware/authenticate.js';
import { decryptApiKeyMiddleware } from '@shared/middleware/decrypt.js';
import express from "express";
import { handleLoadMatchSummary } from "../controllers/match_summary.js";

export const routes = (privateKey: string) => {
  const router = express.Router();
  router.get("/match-summary", decryptApiKeyMiddleware(privateKey), authenticate, handleLoadMatchSummary);
  return router;
};
