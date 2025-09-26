import { addNewJob } from '../services/app_tracker.services';
import express from 'express';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

router.post('/track-job', limiter, addNewJob);
router.post('/applied', );
router.get('/get-list', );
router.post('/update-list', )

export default router;

