import express from 'express';
import resumeRoutes from './resume_routes';

const router = express.Router();

router.use('/resume', resumeRoutes);
// add other routes like: router.use('/cover-letter', coverLetterRoutes);

export default router;