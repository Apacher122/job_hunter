import { downloadDocument } from '../../documents/controllers/document';
import { handleLoadMatchSummary } from '../controllers/match_summary.controller';
import express from 'express';

const router = express.Router();

router.get('/get-info', downloadDocument);
router.get('/match-summary', handleLoadMatchSummary)
export default router;