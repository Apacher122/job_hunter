import {authenticate} from '../../../shared/middleware/authenticate';
import { decryptApiKeyMiddleware } from '../../../shared/middleware/decrypt';
import { downloadDocument } from '../controllers/document';
import express from 'express';

const router = express.Router();

router.get('/revise', decryptApiKeyMiddleware(process.env.PRIVATE_KEY!), authenticate, downloadDocument);

export default router;