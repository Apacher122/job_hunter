import * as controller  from "../controllers/app_tracker.js";
import * as fs from "fs";

import { authenticate } from "@shared/middleware/authenticate.js";
import { decryptApiKeyMiddleware } from "@shared/middleware/decrypt.js";
import express from "express";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
});

export const routes = (privateKey: string) => {
  const router = express.Router();
  router.post(
    "/track-job",
    decryptApiKeyMiddleware(privateKey),
    authenticate,
    controller.newJobHandler
  );
  router.post("/list", authenticate, controller.getJobApplications);
  router.patch("/update", authenticate, controller.updateApplication);
  router.delete("/delete", authenticate, controller.deleteApp);
  return router;
};
