import { markApplication, sendJobInfo } from '../controllers/user.controller';

import express from 'express';

const router = express.Router();

router.post('/send-job-info', sendJobInfo);
router.post('/mark-application-as-sent', markApplication);

export default router;