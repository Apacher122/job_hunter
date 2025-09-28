import documentRoutes from './routes/documents';
import express from 'express';

const router = express.Router();

router.use('/documents', documentRoutes);

export default router;