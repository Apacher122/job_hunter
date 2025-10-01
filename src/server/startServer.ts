import { initializeApp, privateKey } from './initializeApp.js';

import { app } from './app.js';
import { shutdown } from '@database/index.js';

export const startServer = async () => {
  try {
    console.log('Starting server...');
    await initializeApp();
    const configuredApp = app(privateKey);
    configuredApp.listen(3001, '0.0.0.0', () => {
      console.log('Server is running on port 3001');
    });
  } catch (error: unknown) {
    console.error('Error starting server:', error instanceof Error ? error.message : error);
  }

  process.on('SIGINT', shutdownHandler);
  process.on('SIGTERM', shutdownHandler);
  process.on('uncaughtException', (error) => console.error(`Uncaught Exception: ${error}`));
  process.on('unhandledRejection', (reason, promise) =>
    console.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`)
  );
};

const shutdownHandler = () => {
  console.log('Shutting down gracefully...');
  shutdown();
};
