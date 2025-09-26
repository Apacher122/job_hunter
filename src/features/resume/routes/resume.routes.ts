import { downloadDocument } from '../../documents/controllers/document.controller';
import express from 'express';
import { getResumeChanges } from '../controllers/resume.controllers';

const router = express.Router();

router.get('/get-resume', downloadDocument);
router.get('/get-change-summary', getResumeChanges);

export default router;