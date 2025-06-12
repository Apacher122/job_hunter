import { downloadDocument } from '../../shared/controllers/document.controller';
import express from 'express';

const router = express.Router();

router.get('/get-pdf', downloadDocument);
router.get('/get-summary', downloadDocument);

export default router;