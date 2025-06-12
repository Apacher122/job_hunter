import bodyParser from 'body-parser';
import coverLetterRoutes from './cover_letter/routes/cover_letter.routes.js';
import express from 'express';
import { getJobPostingContent } from "./shared/utils/data/info.utils.js";
import { insertRowToSheet } from './shared/libs/google/sheets.js';
import jobGuideRoutes from './job_guide/routes/job_guide.routes.js';
import { loadUserInfoToLatex } from "./shared/utils/documents/latex/latex.helpers.js"
import resumeRoutes from './resume/routes/resume.routes.js';
import userRoutes from './user/routes/user.routes';

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

// app.use('/forms', resume_router);

// // API Endpoints
// app.post('/generate-resume', async (req, res) => {
//   try {
//     await compile_resume();
//     res.status(200).json({ success: true, message: 'Resume generated successfully' });
//   } catch (error) {
//     const e = error as Error;
//     console.error(`Error generating resume: ${e.message}`);
//     res.status(500).json({ success: false, message: `Error generating resume: ${e.message}` });
//   }
// });

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

// app.post('/generate-cover-letter', async (req, res) => {
//   try {
//     await compileCoverLetter();
//     res.status(200).json({ success: true, message: 'Cover letter generated successfully' });
//   } catch (error) {
//     const e = error as Error;
//     console.error(`Error generating cover letter: ${e.message}`);
//     res.status(500).json({ success: false, message: `Error generating cover letter: ${e.message}` });
//   }
// });

// app.post('/send-job-info', async (req, res) => {
//   try {
//     const text = req.body.text;
//     await getJobPostFromCall(text);
//     res.status(200).json({ success: true, message: 'Job info processed successfully' });
//   } catch (error) {
//     const e = error as Error;
//     console.error(`Error processing job info: ${e.message}`);
//     res.status(500).json({ success: false, message: `Error processing job info: ${e.message}` });
//   } finally {
//     console.log('New job info processed');
//   } 
// });

const initializeApp = async () => {
    try {
        // Load job posting content
        await getJobPostingContent();
        await loadUserInfoToLatex();

        // Additional initialization tasks can be added here
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