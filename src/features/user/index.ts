import express from 'express';
import userRoutes from './routes/user.routes';

const router = express.Router();

router.use('/user', userRoutes);
// add other routes like: router.use('/cover-letter', coverLetterRoutes);

export default router;