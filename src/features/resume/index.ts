import express from 'express';
import resumeRoutes from './routes/resume.routes';

const router = express.Router();

router.use('/resume', resumeRoutes);

export default router;