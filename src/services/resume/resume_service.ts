import path from 'path';
import fs from 'fs';
import paths from '../../constants/paths.js';
import { exportLatex } from '../export_service.js';
import { prompts } from '../../constants/prompts.js';
import { ExperienceSchema, SkillSchema, ProjectSchema } from '../../models/response_models/resume_models.js';
import type { ZodType } from 'zod';
import { parseJSONData } from '../../utils/data/json_helpers.js';
import { getMatchSummary } from '../review/match_summarizer.js';
import { generateChangeReport } from '../review/change_report.js';
import { infoStore } from '../../data/info_store.js';
import { logger } from '../../utils/logger.js';
import { formatLatexSection, replaceSectionContent, sectionToLatexEnvMap } from '../latex/latex_service.js';
import { messageOpenAI } from "../../apis/open_ai/openai_services.js";
import { ResumeSectionNotFoundError } from '../../errors/resume_builder_errors.js';


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
        await generateResumeContent();
        let jobContent = infoStore.jobPosting;
        
        await exportLatex({
        jobNameSuffix: 'resume',
        latexFilePath: paths.latex_files.resume,
        targetDirectory: paths.paths.output_dir,
        compiledPdfPath: paths.paths.compiled_resume(jobContent.companyName),
        movedPdfPath: paths.paths.moved_resume(jobContent.companyName)
        });

        await getMatchSummary();

        console.log('Resume exported successfully. See ${jobContent.companyName}_match_summary.md in output directory for details.');
    } catch (error) {
      const e = error as Error;
      console.error(`Error exporting resume to PDF: ${e.message} See logs for more information`);
      return;
    }
};

// Main body to start building resume sections
const generateResumeContent = async() => {
  const jobContent = infoStore.jobPosting;
  const curResumeData = await getCurrentResumeContent(true);
  const mistakesMade = await fs.promises.readFile(paths.paths.mistakes, 'utf-8');

  try {
    await loadSection(
      "experiences",
      prompts.experience(curResumeData, jobContent.body, mistakesMade),
      ExperienceSchema,
      paths.latex_files.experience
    );

    await loadSection(
      "skills",
      prompts.skills(curResumeData, jobContent.body),
      SkillSchema,
      paths.latex_files.skills
    );

    await loadSection(
      "projects",
      prompts.projects(curResumeData, jobContent.body),
      ProjectSchema,
      paths.latex_files.projects
    );
  } catch (error) {
    const e = error as Error;
    console.error(`Error loading resume sections: ${e.message}`);
    throw error;
  }
}

// Read in .txt data for current resume
const getCurrentResumeContent = async (isJson = false): Promise<string | unknown> => {
   if (isJson) {
    return parseJSONData(paths.paths.current_resume_data);
  }
  // Just read and return raw text; errors will throw automatically
  return fs.promises.readFile(paths.paths.current_resume_data, 'utf-8');
};

// Use the correct Zod type for schema parameter
const loadSection = async <T extends Record<string, any>>(
  sectionName: string,
  prompt: string,
  schema: ZodType<T>,
  latexFilePath: string
): Promise<void> => {
  const latexEnv = sectionToLatexEnvMap[sectionName];
  if (!latexEnv) {
    throw new Error(`No LaTeX environment defined for section ${sectionName}`);
  }

  const response = await messageOpenAI(prompt, schema);
  const parsed = schema.safeParse(response);

  if (!parsed.success) {
    throw new Error(`Invalid response for section ${sectionName}: ${JSON.stringify(parsed.error.errors)}`);
  }

  // Save JSON data
  const jsonPath = paths.paths.section_json(sectionName);
  await fs.promises.writeFile(jsonPath, JSON.stringify(parsed.data, null, 2));
  logger.info(`Saved JSON for ${sectionName} to ${jsonPath}`);

  // Read existing LaTeX file
  const latexContent = await fs.promises.readFile(latexFilePath, 'utf8');

  // Format new LaTeX section content
  const newContent = parsed.data[sectionName].map(formatLatexSection(sectionName));

  // Replace section in LaTeX file
  const updatedLatex = replaceSectionContent(latexContent, newContent, latexEnv);
  await fs.promises.writeFile(latexFilePath, updatedLatex, 'utf8');

  generateChangeReport(response);
};


/* Restore "changes-made.md" to blank state. Required to ensure
/* new output is written in cleanly.*/
const cleanup = async (): Promise<void> => {
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