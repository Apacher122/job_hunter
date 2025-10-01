import * as userController from "../controllers/index.js";

import { authenticate } from "@shared/middleware/authenticate.js";
import express from "express";

export const routes = (privateKey?: string) => {
  const router = express.Router();

  router.post(
    "/questionnaire",
    authenticate,
    userController.createOrUpdateCandidateQuestionnaire
  );

  router.get(
    "/questionnaire",
    authenticate,
    userController.getCandidateQuestionnaire
  );

  router.post(
    "/writing-samples",
    authenticate,
    userController.createOrUpdateWritingSamples
  );

  router.get(
    "/writing-samples",
    authenticate,
    userController.getWritingSamples
  );

  return router;
};