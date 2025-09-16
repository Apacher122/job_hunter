import {
  formatLatexSection,
  sectionFormatters,
} from '../../../shared/utils/formatters/resume.formatter.js';
import {
  replaceSectionContent,
  sectionToLatexEnvMap,
} from '../../../shared/utils/documents/latex/latex.helpers.js';
import {
  resumeItemsStore,
  updateResumeItemsStore,
} from '../../../shared/data/open_ai.store.js';
import { JobPosting } from '../../../shared/data/info.store.js';
import { MockResume } from '../models/resume.mocks.js';
import { ResumeItems } from '../models/resume.models.js';
import { cleanup } from '../../../shared/utils/documents/file.helpers.js';
import { exportLatex } from '../../documents/services/export.service.js';
import fs from 'fs';
import { getOpenAIResponse } from '../../../shared/libs/open_ai/openai.js';
import { loadTemplate } from '../../../shared/utils/templates/template.loader.js';
import { parseJSONData } from '../../../shared/utils/documents/json/json.helpers.js';
import paths from '../../../shared/constants/paths.js';
import { upsertResume } from '../../../database/queries/resume.queries.js';
import { getJobPost } from '../../../database/queries/job.queries.js';
import dotenv from 'dotenv';
dotenv.config();

export const compile_resume = async (id: number): Promise<void> => {
  const jobContent = await getJobPost(id);

  if (!jobContent || !jobContent.companyName) {
    console.error(
      'Could not compile: Job posting content or company name is not available in infoStore.'
    );
    return;
  }
  try {
    await generateFullResume(jobContent);

    if (process.env.NODE_ENV === 'testing') {
      jobContent.companyName = 'test';
      jobContent.id = 0;
    }

    await exportLatex({
      jobNameSuffix: 'resume',
      latexFilePath: paths.latex.resume.resume,
      targetDirectory: paths.paths.dir,
      compiledPdfPath: paths.paths.compiledResume(
        jobContent.companyName,
        jobContent.id
      ),
      movedPdfPath: paths.paths.movedResume(
        jobContent.companyName,
        jobContent.id
      ),
      jobPost: jobContent,
    });

    cleanup(jobContent.companyName, 'resume', jobContent.id);
  } catch (error) {
    const e = error as Error;
    console.error(
      `Error exporting resume to PDF: ${e.message} See logs for more information`
    );
    return;
  }
};

const generateFullResume = async (content: JobPosting): Promise<void> => {
  console.log(
    `RESUME - creating resume for ${content.rawCompanyName} - ${content.position}`
  );
  try {
    const [textResume, mistakesMade] = await Promise.all([
      await fs.promises.readFile(paths.paths.currentResumeTxt, 'utf-8'),
      await fs.promises.readFile(paths.paths.mistakes, 'utf-8'),
    ]);

    const instructions = await loadTemplate('instructions', 'resume', {
      mistakes: mistakesMade,
    });

    const prompt = await loadTemplate('prompts', 'resume', {
      resume: textResume,
      company: content.rawCompanyName,
      position: content.position,
      years_of_experience_required: content.yearsOfExp,
      skills_required: content.requirements,
      skills_nice_to_haves: content.niceToHaves,
      frameworks_and_libraries: content.frmwrksAndLibs,
      databases: content.databases,
      cloud_platforms: content.cloudPlatforms,
      industry_keywords: content.industryKeywords,
      certifications: content.certifications,
      company_culture: content.companyCulture,
      company_values: content.companyValues,
      salary_range: content.salary,
    });

    const res =
      process.env.NODE_ENV === 'testing'
        ? MockResume
        : await getOpenAIResponse(instructions, prompt, ResumeItems);

    if (!res)
      throw new Error(
        'Failed to get response from OpenAI for full resume generation'
      );

    updateResumeItemsStore(res);
    await upsertResume(content.id, res);

    const parsedResponse = ResumeItems.safeParse(res);
    if (!parsedResponse.success) {
      throw new Error('Invalid response format from OpenAI');
    }

    await fs.promises.writeFile(
      paths.paths.jsonResume(content.companyName, content.id),
      JSON.stringify(parsedResponse.data, null, 2)
    );

    const sectionNames = ['experiences', 'skills', 'projects'] as const;
    await Promise.all(
      sectionNames.map(async (sectionName) => {
        const data = parsedResponse.data[sectionName];
        if (!data) return;
        const latexTemplatePath = paths.latex.template(sectionName);
        const compiledLatexPath = paths.latex.resume[sectionName];
        const latexEnv = sectionToLatexEnvMap[sectionName];

        const originalLatexContent = await fs.promises.readFile(
          latexTemplatePath,
          'utf8'
        );
        const newContent = data.map(formatLatexSection(sectionName));
        const newLatexContent = replaceSectionContent(
          originalLatexContent,
          newContent,
          latexEnv
        );

        await fs.promises.writeFile(compiledLatexPath, newLatexContent);
      })
    );
  } catch (err) {
    console.error(
      `Error generating full resume for ${content.companyName}:`,
      err
    );
    throw err;
  }
};

const getCurrentResumeContent = async (isJson = false): Promise<string> => {
  if (isJson) {
    return parseJSONData(paths.paths.currentResumeData);
  }
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
  await fs.promises.appendFile(changeReportPath, content);
};
