import paths from '../../../shared/constants/paths';
import { authenticate } from '../../../shared/middleware/authenticate';
import { decryptApiKeyMiddleware } from '../../../shared/middleware/decrypt';
import { downloadDocument } from '../controllers/document';
import express from 'express';
import fs from 'fs';

const router = express.Router();
const privateKey = fs.readFileSync(paths.paths.privateKey, 'utf-8');

router.get(
  '/revise',
  decryptApiKeyMiddleware(privateKey),
  authenticate,
  downloadDocument
);

export default router;
