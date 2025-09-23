import express from 'express';
import { addNewJob } from '../services/app_tracker.services';
const router = express.Router();

router.post('/send-info', addNewJob);
router.post('/applied', );
router.get('/get-list', );
router.post('/update-list', )

export default router;

