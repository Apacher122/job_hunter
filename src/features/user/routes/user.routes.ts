import * as userController from "../controllers";

import { authenticate } from "../../../shared/middleware/authenticate";
import express from "express";

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

router.get("/writing-samples", authenticate, userController.getWritingSamples);

export default router;
