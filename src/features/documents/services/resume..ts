import * as db from "../../../database";

import { LLMHeaders, LLMProvider } from "../../../shared/types/llm.types";
import { ResumeItemsType, ResumeSchema } from "../models/requests/resume";
import {
  formatLatexSection,
  sectionFormatters,
} from "../../../shared/utils/formatters/resume.formatter.js";
import {
  replaceSectionContent,
  sectionToLatexEnvMap,
} from "../../../shared/utils/documents/latex/latex.helpers.js";

import { JobDescription } from "../../application_tracking/models/job_description";
import { MockResume } from "../models/requests/resume.mocks.js";
import { cleanup } from "../../../shared/utils/documents/file.helpers.js";
import dotenv from "dotenv";
import { exportLatex } from "./export.js";
import fs from "fs";
import { loadTemplate } from "../../../shared/utils/templates/template.loader.js";
import paths from "../../../shared/constants/paths.js";
import { sendToLLM } from "../../../shared/libs/LLMs/providers.js";
import { upsertResume } from "../../../database/queries/old/resume.queries.js";

dotenv.config();

export const compileResume = async (
  jobId: number,
  uid: string,
  headers?: LLMHeaders
): Promise<void> => {
  const jobPost = await db.getFullJobPosting(jobId, uid);

  if (!jobPost || !jobPost.company_name) {
    console.error(
      "Could not compile: Job posting content or company name is not available in infoStore."
    );
    return;
  }
  try {
    await generateFullResume(jobPost, headers);

    if (process.env.NODE_ENV === "testing") {
      jobContent.company_name = "test";
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
  content: JobDescription,
  headers?: LLMHeaders
): Promise<void> => {
  console.log(
    `RESUME - creating resume for ${content.company_name} - ${content.position}`
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
      `Error generating full resume for ${content.company_name}:`,
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
  content: JobDescription,
  textResume: string,
  mistakesMade: string
) => {
  const instructions = await loadTemplate("instructions", "resume", {
    mistakes: mistakesMade,
  });
  const prompt = await loadTemplate("prompts", "resume", {
    resume: textResume,
    company: content.company_name,
    position: content.job_title,
    years_of_experience_required: content.years_of_experience_required,
    skills_required: content.skills_required,
    skills_nice_to_haves: content.skills_nice_to_haves,
    frameworks_and_libraries: content.frameworks_and_libraries,
    databases: content.databases,
    cloud_platforms: content.cloud_platforms,
    industry_keywords: content.industry_keywords,
    certifications: content.certifications,
    company_culture: content.company_culture,
    company_values: content.company_values,
    salary_range: content.salary_range,
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
      ResumeSchema,
      userApiKey || process.env.COHERE_API_KEY
    );
};

const validateResumeResponse = (res: unknown): ResumeItemsType => {
  if (!res)
    throw new Error(
      "Failed to get response from OpenAI for full resume generation"
    );

  const parsedResponse = ResumeSchema.safeParse(res);

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

// export const generateChangeReport = async () => {
//   const changeReportPath = paths.paths.changeReport;
//   let content = "";
//   type ResumeSection = keyof typeof resumeItemsStore;
//   Object.entries(sectionFormatters).forEach(([section, formatter]) => {
//     if (resumeItemsStore[section as ResumeSection]) {
//       content += formatter(resumeItemsStore[section as ResumeSection]);
//     }
//   });
//   await fs.promises.appendFile(changeReportPath, content);
// };
