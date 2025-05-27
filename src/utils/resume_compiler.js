import path from 'path';
import fs from 'fs';
import { loadBasicInfo, loadSections, logger } from './index.js';
import paths from '../config/paths.js';
import { exportResume } from './latex_to_pdf/export_resume.js';
import { prompts } from '../prompts/prompts.js';
import { getCurrentResumeContent, getJobPostingContent } from './helpers/info_helper.js';
import { experienceResponse, skillsResponse, projectsResponse } from '../models/resume_items_model.js';
import { getMatchSummary } from './resume_analyzer/match_summarizer.js';

// Main body for compiling a resume.
// Cleans up all LaTeX log files, and change-summary.pdf
export const compile_resume = async () => {
  // Purge old temporary files and logs
  cleanup();

  // Start compiling tex files with new info
  let companyName;
  try {
    await loadBasicInfo();
    companyName = await beginLatexFormatting();
  } catch (error) {
    console.error(`Error during LaTeX formatting: ${error.message} See logs for more information`);
    return;
  }

  // Export to PDF
  try {
    await exportResume(companyName);
    await getMatchSummary(companyName);
  } catch (error) {
    console.error(`Error exporting resume to PDF: ${error.message} See logs for more information`);
    return;
  }
};

// Main body to start building resume sections
const beginLatexFormatting = async() => {
  const {jobPostingContent, companyName} = await getJobPostingContent();
  const curResumeData = await getCurrentResumeContent(true);

  try {
    await loadSections(
      "experiences",
      prompts.experience(curResumeData, jobPostingContent),
      experienceResponse,
      paths.latex_files.experience
    );

    await loadSections(
      "skills",
      prompts.skills(curResumeData, jobPostingContent),
      skillsResponse,
      paths.latex_files.skills
    );

    await loadSections(
      "projects",
      prompts.projects(curResumeData, jobPostingContent),
      projectsResponse,
      paths.latex_files.projects
    );
  } catch (error) {
    console.error(`Error loading resume sections: ${error.message}`);
    throw error;
  }
  return companyName;
}

/* Restore "changes-made.md" to blank state. Required to ensure
/* new output is written in cleanly.*/
const cleanup = () => {
  // Clean up old change report
  if (fs.existsSync(paths.paths.change_report)) {
    fs.truncateSync(paths.paths.change_report, 0);
  }

  // Clean up temporary files and old PDFs
  const extensions = ['.aux', '.log', '.out', `.pdf`];
  const files = fs.readdirSync(paths.paths.output_dir);

  files.forEach(file => {
    const filePath = path.join(paths.paths.output_dir, file);
    if (fs.existsSync(filePath) && extensions.includes(path.extname(file))) {
      fs.unlinkSync(filePath);
    }
  })
  logger.info('Temporary LaTeX files purged');
};