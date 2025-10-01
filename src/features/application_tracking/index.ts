import express from 'express';
import {routes} from './routes/app_tracker.js';

export const applicationTrackerRoutes = (privateKey: string) => {
  const router = express.Router();
  router.use('/applications', routes(privateKey));
  return router;
};