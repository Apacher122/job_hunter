import fs from 'fs';
import paths from '../../shared/constants/paths.js';
import { exportLatex } from '../export_service.js';
import { prompts } from '../../shared/constants/prompts.js';
import { ResumeItems } from '../../models/response_models/resume_models.js';
import { parseJSONData } from '../../shared/utils/data/json_helpers.js';
import { generateChangeReport } from '../review/change_report.js';
import { infoStore } from '../../shared/data/info_store.js';
import { logger } from '../../shared/utils/logger.js';
import { formatLatexSection, replaceSectionContent, sectionToLatexEnvMap } from '../latex/latex_service.js';
import { messageOpenAI } from "../../shared/apis/open_ai/openai_services.js";
import { ResumeSectionNotFoundError } from '../../shared/errors/resume_builder_errors.js';
import { getDateToday } from '../../shared/utils/data/date_helpers';
import { countTokens } from '../../shared/utils/token_counter';
import { cleanup } from '../../shared/utils/files/file_helpers.js';


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
        latexFilePath: paths.latex_files.resume,
        targetDirectory: paths.paths.output_dir,
        compiledPdfPath: paths.paths.compiled_resume(jobContent.companyName),
        movedPdfPath: paths.paths.moved_resume(jobContent.companyName)
        });

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
  const prompt = prompts.FullPrompt(curResumeData, jobContent, mistakesMade);
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
    const jsonPath = paths.paths.section_json(sectionName);
    await fs.promises.writeFile(jsonPath, JSON.stringify(data, null, 2));
    
    const latexPath = paths.latex_files[sectionName];
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
    return parseJSONData(paths.paths.current_resume_data);
  }
  // Just read and return raw text; errors will throw automatically
  return fs.promises.readFile(paths.paths.current_resume_data, 'utf-8');
};