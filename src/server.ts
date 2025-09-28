import dotenv from 'dotenv';
dotenv.config();

import { app } from './server/app';
import { startServer } from './server/startServer';

startServer().catch(console.error);
