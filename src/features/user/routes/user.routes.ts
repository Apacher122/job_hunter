import { markApplication, sendJobInfo, getJobApplications, updateJobs } from '../controllers/user.controller';

import express from 'express';

const router = express.Router();

router.post('/send-job-info', sendJobInfo);
router.post('/mark-application-as-sent', markApplication);
router.get('/application-list', getJobApplications);
router.post('/update-list', updateJobs)
export default router;