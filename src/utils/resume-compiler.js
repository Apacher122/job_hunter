import path from 'path';
import fs from 'fs';
import { loadBasicInfo, loadSections, logger } from './index.js';
import config from '../config/config.js';
import { exportResume } from '../services/export-resume.js';
import { prompts } from '../prompts/prompts.js';
import { getCurrentResumeContent, getJobPostingContent } from '../helpers/info-helper.js';
import { experienceResponse, skillsResponse, projectsResponse } from '../models/resume-items.js';

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
  } catch (error) {
    console.error(`Error exporting resume to PDF: ${error.message} See logs for more information`);
    return;
  }
};

const beginLatexFormatting = async() => {
  const {jobPostingContent, companyName} = await getJobPostingContent();
  const curResumeData = await getCurrentResumeContent(true);

  try {
    await loadSections(
      "experiences",
      prompts.experience(curResumeData, jobPostingContent),
      experienceResponse,
      config.latex_files.experience
    );

    await loadSections(
      "skills",
      prompts.skills(curResumeData, jobPostingContent),
      skillsResponse,
      config.latex_files.skills
    );

    await loadSections(
      "projects",
      prompts.projects(curResumeData, jobPostingContent),
      projectsResponse,
      config.latex_files.projects
    );
  } catch (error) {
    console.error(`Error loading resume sections: ${error.message}`);
    throw error;
  }
  return companyName;
}

const cleanup = () => {
  // Clean up old change report
  if (fs.existsSync(config.paths.change_report)) {
    fs.truncateSync(config.paths.change_report, 0);
  }

  // Clean up temporary files and old PDFs
  const extensions = ['.aux', '.log', '.out', `.pdf`];
  const files = fs.readdirSync(config.paths.output_dir);

  files.forEach(file => {
    const filePath = path.join(config.paths.output_dir, file);
    if (fs.existsSync(filePath) && extensions.includes(path.extname(file))) {
      fs.unlinkSync(filePath);
    }
  })
  logger.info('Temporary LaTeX files purged');
};