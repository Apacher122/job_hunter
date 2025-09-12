import { markApplication, sendJobInfo, getJobApplications } from '../controllers/user.controller';

import express from 'express';

const router = express.Router();

router.post('/send-job-info', sendJobInfo);
router.post('/mark-application-as-sent', markApplication);
router.get('/application-list', getJobApplications);

export default router;