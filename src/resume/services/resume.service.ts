import { Instructions, UserPrompts } from '../../shared/constants/prompts.js';
import { appendJSONData, parseJSONData } from '../../shared/utils/documents/json/json.helpers.js';
import { countTokens, getOpenAIResponse, messageOpenAI } from "../../shared/libs/open_ai/openai.js";
import { formatLatexSection, formatPlaintextSection, sectionFormatters } from '../../shared/utils/formatters/resume.formatter.js'
import { replaceSectionContent, sectionToLatexEnvMap } from '../../shared/utils/documents/latex/latex.helpers.js';
import { resumeItemsStore, updateResumeItemsStore } from '../../shared/data/open_ai.store.js';

import { ResumeItems } from '../models/resume.models.js';
import { cleanup } from '../../shared/utils/documents/file.helpers.js';
import { exportLatex } from '../../documents/services/export.service.js';
import { format } from 'path';
import fs from 'fs';
import { infoStore } from '../../shared/data/info.store.js';
import { logger } from '../../shared/utils/logger.js';
import paths from '../../shared/constants/paths.js';
import { prompts } from '../../shared/constants/prompts.js';
import { sendFileBuffer } from '../../shared/utils/documents/file.helpers.js';
import { upsertResume } from '../../database/queries/resume.queries.js';

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
  // const response = await messageOpenAI(prompt, ResumeItems);
  const instr = Instructions.Resume(mistakesMade);
  const userPrompt = UserPrompts.Resume(curResumeData, jobContent);
  const res = await getOpenAIResponse(instr, userPrompt, ResumeItems);
  if (!res) {
    throw new Error("Failed to get response from OpenAI for full resume generation");
  }
  // Update the resume items store with the response
  updateResumeItemsStore(res);

  // Add to db
  await upsertResume(jobContent.id, res);

  const parsedResponse = ResumeItems.safeParse(res);
  if (!parsedResponse.success) {
    throw new Error("Invalid response format from OpenAI");
  }
  
  for (const sectionName of ['experiences', 'skills', 'projects'] as const) {
    const data = parsedResponse.data[sectionName];
    const jsonPath = paths.paths.sectionJson(sectionName);
    await fs.promises.writeFile(jsonPath, JSON.stringify(data, null, 2));

    const latexTemplatePath = paths.latex.template(sectionName);
    const compiledLatexPath = paths.latex.resume[sectionName];
    const latexEnv = sectionToLatexEnvMap[sectionName];
    const originalLatexContent = await fs.promises.readFile(latexTemplatePath, 'utf8');
    const newContent = data.map(formatLatexSection(sectionName));
    const newLatexContent = replaceSectionContent(originalLatexContent, newContent, latexEnv);
    await fs.promises.writeFile(compiledLatexPath, newLatexContent);
  }
}

// Read in .txt data for current resume
const getCurrentResumeContent = async (isJson = false): Promise<string | unknown> => {
  if (isJson) {
    return parseJSONData(paths.paths.currentResumeData);
  }
  // Just read and return raw text; errors will throw automatically
  return fs.promises.readFile(paths.paths.currentResumeData, 'utf-8');
};

export const generateChangeReport = async () => {
  const changeReportPath = paths.paths.changeReport;
  let content = '';
  type ResumeSection = keyof typeof resumeItemsStore;
  Object.entries(sectionFormatters).forEach(([section, formatter]) => {
    if (resumeItemsStore[section as ResumeSection]) {
      content += formatter(resumeItemsStore[section as ResumeSection]);
    }
  });
  fs.appendFileSync(changeReportPath, content);
};