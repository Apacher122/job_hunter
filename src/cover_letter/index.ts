import coverLetterRoutes from './routes/cover_letter.routes';
import express from 'express';

const router = express.Router();

router.use('/cover-letter', coverLetterRoutes);
// add other routes like: router.use('/cover-letter', coverLetterRoutes);

export default router;