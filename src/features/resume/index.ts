import express from 'express';
import resumeRoutes from './routes/resume.routes';

const router = express.Router();

router.use('/resume', resumeRoutes);
// add other routes like: router.use('/cover-letter', coverLetterRoutes);

export default router;