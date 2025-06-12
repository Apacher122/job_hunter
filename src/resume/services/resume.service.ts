import { appendJSONData, parseJSONData } from '../../shared/utils/documents/json/json.helpers.js';
import { countTokens, messageOpenAI } from "../../shared/libs/open_ai/openai.js";
import { formatLatexSection, formatPlaintextSection, sectionFormatters } from '../../shared/utils/formatters/resume.formatter.js'
import { replaceSectionContent, sectionToLatexEnvMap } from '../../shared/utils/documents/latex/latex.helpers.js';

import { ResumeItems } from '../models/resume.models.js';
import { cleanup } from '../../shared/utils/documents/file.helpers.js';
import { exportLatex } from '../../shared/services/export.service.js';
import { format } from 'path';
import fs from 'fs';
import { generateChangeReport } from '../../shared/services/change_report.service.js';
import { infoStore } from '../../shared/data/info.store.js';
import { logger } from '../../shared/utils/logger.js';
import paths from '../../shared/constants/paths.js';
import { prompts } from '../../shared/constants/prompts.js';

// Main body for compiling a resume.
// Cleans up all LaTeX log files, and change-summary.pdf
export const compile_resume = async (): Promise<void> => {  
  // Purge old temporary files and logs
  await cleanup();
  
  if (!infoStore.jobPosting || !infoStore.jobPosting.companyName) {
    console.error('Job posting content or company name is not available in infoStore.');
    return;
  }
  
  // Export to PDF
  try {
    console.log('Generating resume content...');
    // await generateResumeContent();
    await generateFullResume();
    let jobContent = infoStore.jobPosting;
    
    await exportLatex({
      jobNameSuffix: 'resume',
      latexFilePath: paths.latex.resume.resume,
      targetDirectory: paths.paths.dir,
      compiledPdfPath: paths.paths.compiledResume(jobContent.companyName),
      movedPdfPath: paths.paths.movedResume(jobContent.companyName)
    });
    
    const jobData = { "companyName": jobContent.rawCompanyName, "position": jobContent.position };
    await appendJSONData(paths.paths.jobList, jobData); // Append job data to the existing JSON file
    
    // Write job data to a JSON file
    
    console.log(`Resume exported successfully for ${jobContent.rawCompanyName}`);
  } catch (error) {
    const e = error as Error;
    console.error(`Error exporting resume to PDF: ${e.message} See logs for more information`);
    return;
  }
};

const generateFullResume = async (): Promise<void> => {
  const jobContent = infoStore.jobPosting;
  const curResumeData = await getCurrentResumeContent(true);
  const mistakesMade = await fs.promises.readFile(paths.paths.mistakes, 'utf-8');
  const prompt = prompts.FullPrompt(
    curResumeData,
    jobContent,
    mistakesMade,
  );
  logger.info(`Generating full resume with prompt: ${prompt}`);
  const tokenCount = countTokens(prompt);
  console.log(`Token count for full resume prompt: ${tokenCount}`);
  
  // Call OpenAI to get the full resume content
  const response = await messageOpenAI(prompt, ResumeItems);
  const parsedResponse = ResumeItems.safeParse(response);
  if (!parsedResponse.success) {
    throw new Error("Invalid response format from OpenAI");
  }
  
  for (const sectionName of ['experiences', 'skills', 'projects'] as const) {
    const data = parsedResponse.data[sectionName];
    const jsonPath = paths.paths.sectionJson(sectionName);
    await fs.promises.writeFile(jsonPath, JSON.stringify(data, null, 2));
    
    // const templatePath = paths.latex.template(sectionName);
    // const templateContent = await fs.promises.readFile(templatePath, 'utf8');
    // const formattedContent = data.map(formatLatexSection(sectionName));
    // const formattedLatexContent = replaceSectionContent(templateContent, formattedContent, sectionToLatexEnvMap[sectionName]);
    // await fs.promises.writeFile(paths.latex.resume[sectionName], formattedLatexContent);



    const latexPath = paths.latex.resume[sectionName];
    const latexEnv = sectionToLatexEnvMap[sectionName];
    const originalLatexContent = await fs.promises.readFile(latexPath, 'utf8');
    const newContent = data.map(formatLatexSection(sectionName));
    const newLatexContent = replaceSectionContent(originalLatexContent, newContent, latexEnv);
    await fs.promises.writeFile(latexPath, newLatexContent);
  }
  
  generateChangeReport(response);
}

// Read in .txt data for current resume
const getCurrentResumeContent = async (isJson = false): Promise<string | unknown> => {
  if (isJson) {
    return parseJSONData(paths.paths.currentResumeData);
  }
  // Just read and return raw text; errors will throw automatically
  return fs.promises.readFile(paths.paths.currentResumeData, 'utf-8');
};