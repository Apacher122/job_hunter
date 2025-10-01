import dotenv from 'dotenv';
import { startServer } from './server/startServer.js';

dotenv.config();

startServer().catch(console.error);
