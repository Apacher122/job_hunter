import bodyParser from 'body-parser';
import coverLetterRoutes from './features/cover_letter/routes/cover_letter.routes.js';
import express from 'express';
import { insertRowToSheet } from './shared/libs/google/sheets.js';
import jobGuideRoutes from './features/job_guide/routes/job_guide.routes.js';
import { loadUserInfoToLatex } from "./shared/utils/documents/latex/latex.helpers.js"
import pool from './database/index.js';
import resumeRoutes from './features/resume/routes/resume.routes.js';
import userRoutes from './features/user/routes/user.routes';

const app = express();
app.use(bodyParser.json());

// Entrance
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to the Resume Compiler API' });
});

app.use('/user', userRoutes);
app.use('/resume', resumeRoutes);
app.use('/cover-letter', coverLetterRoutes);
app.use('/job-guide', jobGuideRoutes);

app.post('/reload', async (req, res) => {
  await initializeApp();
  res.status(200).json({ success: true, message: 'Reloading application...' });
});

app.post('/add-to-sheet', async (req, res) => {
  try {
    await insertRowToSheet();
    res.status(200).json({ success: true, message: 'Resume added to sheet successfully' });
  } catch (error) {
    const e = error as Error;
    console.error(`Error adding resume to sheet: ${e.message}`);
    res.status(500).json({ success: false, message: `Error adding resume to sheet: ${e.message}` });
  }
});

const initializeApp = async () => {
    try {
        await loadUserInfoToLatex();

        console.log("Job application content and user info loaded successfully.");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error initializing app: ${error.message}`);
        } else {
            console.error("An unknown error occurred during app initialization.");
        }
        throw error;
    }
}

const startServer = async () => {
  try {
    console.log('Starting server...');
    await initializeApp();
    app.listen(3000, '0.0.0.0', () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    const e = error as Error;
    console.error(`Error starting server: ${e.message}`);
  } finally {
    console.log('Server startup process completed');
  }
};

startServer().catch(error => {
  console.error(`Error in server startup: ${error.message}`);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  pool.end(() => {
    console.log('Database connection pool closed.');
    process.exit(0);
  });
}
);
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  pool.end(() => {
    console.log('Database connection pool closed.');
    process.exit(0);
  });
}
);
process.on('uncaughtException', (error) => {
  console.error(`Uncaught Exception: ${error.message}`);
}
);
process.on('unhandledRejection', (reason, promise) => {
  console.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
}
);