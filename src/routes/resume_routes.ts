import express from 'express';
import { downloadDocument, markApplication } from '../controllers/resume_controllers';

const router = express.Router();

router.get('/get-pdf', downloadDocument);
router.get('/get-summary', downloadDocument);
router.post('/mark-application-as-sent', markApplication);

export default router;