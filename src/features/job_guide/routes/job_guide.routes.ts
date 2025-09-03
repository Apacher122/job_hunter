import { downloadDocument } from '../../documents/controllers/document.controller';
import express from 'express';

const router = express.Router();

router.get('/get-info', downloadDocument);

export default router;