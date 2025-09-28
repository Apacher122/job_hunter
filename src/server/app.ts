import express from 'express';
import bodyParser from 'body-parser';
import { authenticate } from '../shared/middleware/authenticate';
import userRoutes from '../features/user/routes/user';
import authRoutes from '../features/auth/routes/auth';
import appRoutes from '../features/application_tracking/routes/app_tracker';
import { publicKeyStreamRouter, getPublicKey } from '../security/publicKeySSE';

export const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ success: true, message: 'Welcome to the Resume Compiler API' });
});

app.use('/public-key-stream', publicKeyStreamRouter);
app.get('/public-key', authenticate, getPublicKey);

app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/applications', appRoutes);
