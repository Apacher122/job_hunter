import { downloadDocument } from '../../documents/controllers/document.js';
import express from 'express';
import { handleLoadMatchSummary } from '../controllers/match_summary.controller.js';

const router = express.Router();

router.get('/get-info', downloadDocument);
router.get('/match-summary', handleLoadMatchSummary)
export default router;