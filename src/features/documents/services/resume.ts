import * as db from "@database/index.js";
import * as docs from "../utils/documents/index.js";
import * as fs from "fs";
import * as latex from "../utils/latex/index.js";
import * as llm from "../utils/llm/message_llm.js";
import * as path from "path";
import * as schemas from "../models/index.js";

import { LLMProvider } from "@shared/types/llm.types.js";
import dotenv from "dotenv";
import { exportLatex } from "./export.js";
import { formatJSONResume } from "../utils/documents/formatters.js";
import { loadTemplate } from "@shared/utils/templates/template.loader.js";
import paths from "@shared/constants/paths.js";

dotenv.config();

export const compileResume = async (
  uid: string,
  docRequest: schemas.DocumentRequest
): Promise<void> => {
  try {
    const jobPost = await db.getFullJobPosting(docRequest.options.jobId, uid);
    if (!jobPost || !jobPost.company_name) {
      throw new Error("Job posting content or company name is not available.");
    }

    const { tempFolder, tempPdf, tempFolderCompiled } =
      docs.initializeDocumentWorkspace(uid, docRequest.options.jobId);

    const tempJsonPath = path.join(tempFolder, "resume.json");

    fs.cpSync(paths.latex.originalTemplate, tempFolder, { recursive: true });

    await docs.createHeader(uid, docRequest.payload, tempFolder);

    const resumeData = await generateResumeData(docRequest, jobPost);

    fs.writeFileSync(tempJsonPath, JSON.stringify(resumeData, null, 2));

    const sectionNames = [
      "experiences",
      "skills",
      "projects",
      "summary",
    ] as const;
    await Promise.all(
      sectionNames.map((sectionName) =>
        latex.generateLatexSectionFile(
          sectionName,
          resumeData[sectionName],
          tempFolder
        )
      )
    );

    await saveJsonResume(
      resumeData,
      jobPost.company_name,
      uid,
      docRequest.options.jobId
    );

    await db.upsertResume(uid, docRequest.options.jobId, resumeData);
    
    await exportLatex({
      jobNameSuffix: "resume",
      outputPath: tempPdf,
      compiledPdfPath: tempFolderCompiled,
      companyName: jobPost.company_name,
      jobId: docRequest.options.jobId,
    });
  } catch (error) {
    console.error(`Error compiling resume: ${(error as Error).message}`);
    throw error;
  }
};

const generateResumeData = async (
  docRequest: schemas.DocumentRequest,
  jobPost: db.FullJobPosting
): Promise<schemas.ResumeItemsType> => {
  const { instructions, prompt } = await buildResumePrompts(
    jobPost,
    docRequest.payload.resume,
    docRequest.payload.additionalInfo,
    docRequest.options.corrections.join("\n")
  );

  return (await llm.generateAndValidateLLMResponse(
    docRequest.options.llm as LLMProvider,
    instructions,
    prompt,
    schemas.ResumeSchema,
    docRequest.apiKey,
    schemas.MockResume 
  )) as schemas.ResumeItemsType;
};

const buildResumePrompts = async (
  content: db.FullJobPosting,
  textResume: any,
  additionalInfo: any,
  mistakesMade: string
) => {
  const resume = formatJSONResume(textResume);
  const instructions = await loadTemplate("instructions", "resume", {
    mistakes: mistakesMade,
  });
  const prompt = await loadTemplate("prompts", "resume", {
    resume: resume,
    company: content.company_name,
    position: content.job_title,
    years_of_experience_required: content.years_of_exp ?? "",
    job_post: content.description ?? "",
    skills_required: content.requirements?.join(", ") ?? "",
    skills_nice_to_haves: content.nice_to_haves?.join(", ") ?? "",
    frameworks_and_libraries:
      content.frameworks_and_libraries?.join(", ") ?? "",
    databases: content.databases?.join(", ") ?? "",
    cloud_platforms: content.cloud_technologies?.join(", ") ?? "",
    industry_keywords: content.industry_keywords?.join(", ") ?? "",
    soft_skills: content.soft_skills?.join(", ") ?? "",
    certifications: content.certifications?.join(", ") ?? "",
    company_culture: content.company_culture ?? "",
    company_values: content.company_values ?? "",
    salary_range: content.salary_range ?? "",
    additional_info: additionalInfo,
  });

  return { instructions, prompt };
};

const saveJsonResume = async (
  resume: any,
  company_name: string,
  uid: string,
  jobId: number
) => {
  const jsonPath = path.join(
    paths.paths.tempJson(uid, "resume"),
    `${company_name}_resume_${jobId}.json`
  );

  fs.writeFileSync(jsonPath, JSON.stringify(resume, null, 2));
};

const cleanup = async (resumeId: number) => {
  await db.deleteExperienceByResumeId(resumeId);
  await db.deleteExperienceDescription(resumeId);
  await db.deleteProjectByResumeId(resumeId);
  await db.deleteProjectDescription(resumeId);
  await db.deleteSkillByResumeId(resumeId);
  await db.deleteSkillItem(resumeId);
};
