import { compile_resume } from './services/resume/resume_service.js';
import express from 'express';
import { compileCoverLetter } from './services/cover_letter/cover_letter_service.js';
import { initializeApp } from './services/startup_service.js';
import bodyParser from 'body-parser';
import { insertRowToSheet } from './apis/google/sheets.js';

const app = express();
app.use(bodyParser.json());

// Entrance
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to the Resume Compiler API' });
});

app.post('/reload', async (req, res) => {
  await initializeApp();
  res.status(200).json({ success: true, message: 'Reloading application...' });
});

// API Endpoints
app.post('/generate-resume', async (req, res) => {
  try {
    await compile_resume();
    res.status(200).json({ success: true, message: 'Resume generated successfully' });
  } catch (error) {
    const e = error as Error;
    console.error(`Error generating resume: ${e.message}`);
    res.status(500).json({ success: false, message: `Error generating resume: ${e.message}` });
  }
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

app.post('/generate-cover-letter', async (req, res) => {
  try {
    await compileCoverLetter();
    res.status(200).json({ success: true, message: 'Cover letter generated successfully' });
  } catch (error) {
    const e = error as Error;
    console.error(`Error generating cover letter: ${e.message}`);
    res.status(500).json({ success: false, message: `Error generating cover letter: ${e.message}` });
  }
});

const startServer = async () => {
  try {
    console.log('Starting server...');
    await initializeApp();
    console.log('Application initialized successfully');

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