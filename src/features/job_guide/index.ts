import express from 'express';
import {routes} from './routes/job_guide.routes.js';

const router = express.Router();

router.use('/resume', routes);

export default router;