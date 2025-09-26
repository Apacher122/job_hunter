import { LLMHeaders, LLMProvider } from "../../../shared/types/llm.types.js";
import { ResumeItems, ResumeItemsType } from "../models/resume.models.js";
import {
  formatLatexSection,
  sectionFormatters,
} from "../../../shared/utils/formatters/resume.formatter.js";
import {
  replaceSectionContent,
  sectionToLatexEnvMap,
} from "../../../shared/utils/documents/latex/latex.helpers.js";
import {
  resumeItemsStore,
  updateResumeItemsStore,
} from "../../../shared/data/open_ai.store.js";

import { JobPosting } from "../../../shared/data/info.store.js";
import { MockResume } from "../models/resume.mocks.js";
import { cleanup } from "../../../shared/utils/documents/file.helpers.js";
import dotenv from "dotenv";
import { exportLatex } from "../../documents/services/export.service.js";
import fs from "fs";
import { getJobPost } from "../../../database/queries/old/job.queries.js";
import { getOpenAIResponse } from "../../../shared/libs/LLMs/open_ai/openai.js";
import { loadTemplate } from "../../../shared/utils/templates/template.loader.js";
import { parseJSONData } from "../../../shared/utils/documents/json/json.helpers.js";
import paths from "../../../shared/constants/paths.js";
import { sendToLLM } from "../../../shared/libs/LLMs/providers.js";
import { upsertResume } from "../../../database/queries/old/resume.queries.js";

dotenv.config();

export const compile_resume = async (
  id: number,
  headers?: LLMHeaders
): Promise<void> => {
  const jobContent = await getJobPost(id);

  if (!jobContent || !jobContent.companyName) {
    console.error(
      "Could not compile: Job posting content or company name is not available in infoStore."
    );
    return;
  }
  try {
    await generateFullResume(jobContent, headers);

    if (process.env.NODE_ENV === "testing") {
      jobContent.companyName = "test";
      jobContent.id = 0;
    }

    await exportLatex({
      jobNameSuffix: "resume",
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

    cleanup(jobContent.companyName, "resume", jobContent.id);
  } catch (error) {
    const e = error as Error;
    console.error(
      `Error exporting resume to PDF: ${e.message} See logs for more information`
    );
    return;
  }
};

const generateFullResume = async (
  content: JobPosting,
  headers?: LLMHeaders
): Promise<void> => {
  console.log(
    `RESUME - creating resume for ${content.rawCompanyName} - ${content.position}`
  );

  try {
    const { textResume, mistakesMade } = await loadResumeAndMistakes();
    const { instructions, prompt } = await buildResumePrompts(
      content,
      textResume,
      mistakesMade
    );

    const res = await getResumeAIResponse(instructions, prompt, headers);
    const parsedResponse = validateResumeResponse(res);

    await persistResume(content, parsedResponse);
    await generateLatexSections(parsedResponse);
  } catch (err) {
    console.error(
      `Error generating full resume for ${content.companyName}:`,
      err
    );
    throw err;
  }
};

const loadResumeAndMistakes = async () => {
  const [textResume, mistakesMade] = await Promise.all([
    fs.promises.readFile(paths.paths.currentResumeTxt, "utf-8"),
    fs.promises.readFile(paths.paths.mistakes, "utf-8"),
  ]);
  return { textResume, mistakesMade };
};

const buildResumePrompts = async (
  content: JobPosting,
  textResume: string,
  mistakesMade: string
) => {
  const instructions = await loadTemplate("instructions", "resume", {
    mistakes: mistakesMade,
  });
  const prompt = await loadTemplate("prompts", "resume", {
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
  return { instructions, prompt };
};

const getResumeAIResponse = async (instructions: string, prompt: string, headers?: LLMHeaders) => {
    const { llmProvider, userApiKey } = headers ?? {};
  return process.env.NODE_ENV === "testing"
    ? MockResume
    : await sendToLLM(
      llmProvider as LLMProvider || "cohere",
      instructions,
      prompt,
      ResumeItems,
      userApiKey || process.env.COHERE_API_KEY
    );
};

const validateResumeResponse = (res: unknown): ResumeItemsType => {
  if (!res)
    throw new Error(
      "Failed to get response from OpenAI for full resume generation"
    );

  updateResumeItemsStore(res);
  const parsedResponse = ResumeItems.safeParse(res);

  if (!parsedResponse.success) {
    throw new Error("Invalid response format from OpenAI");
  }
  return parsedResponse.data;
};

const persistResume = async (
  content: JobPosting,
  parsedResponse: ResumeItemsType
) => {
  await upsertResume(content.id, parsedResponse);
  await fs.promises.writeFile(
    paths.paths.jsonResume(content.companyName, content.id),
    JSON.stringify(parsedResponse, null, 2)
  );
};

const generateLatexSections = async (parsedResponse: ResumeItemsType) => {
  const sectionNames = ["experiences", "skills", "projects"] as const;

  await Promise.all(
    sectionNames.map(async (sectionName) => {
      const data = parsedResponse[sectionName];
      if (!data) return;

      const latexTemplatePath = paths.latex.template(sectionName);
      const compiledLatexPath = paths.latex.resume[sectionName];
      const latexEnv = sectionToLatexEnvMap[sectionName];

      const originalLatexContent = await fs.promises.readFile(
        latexTemplatePath,
        "utf8"
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
};

export const generateChangeReport = async () => {
  const changeReportPath = paths.paths.changeReport;
  let content = "";
  type ResumeSection = keyof typeof resumeItemsStore;
  Object.entries(sectionFormatters).forEach(([section, formatter]) => {
    if (resumeItemsStore[section as ResumeSection]) {
      content += formatter(resumeItemsStore[section as ResumeSection]);
    }
  });
  await fs.promises.appendFile(changeReportPath, content);
};
