import { authenticate } from "../../../shared/middleware/authenticate";
import { decryptApiKeyMiddleware } from "../../../shared/middleware/decrypt";
import express from "express";
import fs from "fs";
import { newJobHandler } from "../controllers/app_tracker.controller";
import paths from "../../../shared/constants/paths";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limiter: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const privateKey = fs.readFileSync(paths.paths.privateKey, "utf-8");

router.post("/track-job", decryptApiKeyMiddleware(privateKey), authenticate, newJobHandler);
// router.post('/applied', );
// router.get('/get-list', );
// router.post('/update-list', )

export default router;
