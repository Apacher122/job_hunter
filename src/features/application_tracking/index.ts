import express from 'express';
import appRoutes from './routes/app_tracker';

const router = express.Router();

router.use('/applications', appRoutes);

export default router;