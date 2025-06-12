import express from 'express';
import jobGuideRoutes from './routes/job_guide.routes';

const router = express.Router();

router.use('/resume', jobGuideRoutes);
// add other routes like: router.use('/cover-letter', coverLetterRoutes);

export default router;