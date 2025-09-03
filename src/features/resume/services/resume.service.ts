import { formatLatexSection, sectionFormatters } from '../../../shared/utils/formatters/resume.formatter.js'
import { replaceSectionContent, sectionToLatexEnvMap } from '../../../shared/utils/documents/latex/latex.helpers.js';
import { resumeItemsStore, updateResumeItemsStore } from '../../../shared/data/open_ai.store.js';

import { MockResume } from '../models/resume.mocks.js';
import { ResumeItems } from '../models/resume.models.js';
import { cleanup } from '../../../shared/utils/documents/file.helpers.js';
import { exportLatex } from '../../documents/services/export.service.js';
import fs from 'fs';
import { getOpenAIResponse } from "../../../shared/libs/open_ai/openai.js";
import { infoStore } from '../../../shared/data/info.store.js';
import { loadTemplate } from '../../../shared/utils/templates/template.loader.js';
import { parseJSONData } from '../../../shared/utils/documents/json/json.helpers.js';
import paths from '../../../shared/constants/paths.js';
import { upsertResume } from '../../../database/queries/resume.queries.js';

const isTesting = true;

export const compile_resume = async (): Promise<void> => {  
  await cleanup();
  
  if (!infoStore.jobPosting || !infoStore.jobPosting.companyName) {
    console.error('Job posting content or company name is not available in infoStore.');
    return;
  }
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
  const resumeCorrections = await fs.promises.readFile(paths.paths.resumeCorrections, 'utf-8');
  
  const instructions = await loadTemplate(
    'instructions',
    'resume',
    {
      mistakes: resumeCorrections,
    }
  )

  const prompt = await loadTemplate(
    'prompts',
    'resume',
    {
      resume: curResumeData,
      jobPosting: jobContent.body,
      company: jobContent.rawCompanyName,
      position: jobContent.position,
    }
  )

  const res = isTesting
    ?  MockResume
    : await getOpenAIResponse(instructions, prompt, ResumeItems);

  // const res = await getOpenAIResponse(instructions, prompt, ResumeItems);
  if (!res) {
    throw new Error("Failed to get response from OpenAI for full resume generation");
  }
  
  updateResumeItemsStore(res);
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
  fs.appendFileSync(changeReportPath, content);
};