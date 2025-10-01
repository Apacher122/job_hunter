import * as Handlebars from "handlebars";
import * as db from "../../../database/index.js";
import * as fs from "fs";

import { CoverLetterMock } from "../models/domain/cover_letter.mocks.js";
import { CoverLetterSchema } from "../models/domain/cover_letter.js";
import { DocumentRequest } from "../models/requests/request.js";
import { JobDescription } from "../../application_tracking/models/job_description.js";
import { JobPosting } from "../../../shared/utils/data/info.store.js";
import { ResumeSectionNotFoundError } from "../../../shared/errors/resume_builder.errors.js";
import { ZodType } from "zod";
import dotenv from "dotenv";
import { exportLatex } from "./export.js";
import { formatLatexSection } from "../../../shared/utils/formatters/resume.formatter.js";
import { getJobPost } from "../../../database/queries/old/job.queries.js";
import { getWritingExamples } from "../../../shared/utils/formatters/string.formatter.js";
import { loadTemplate } from "../../../shared/utils/templates/template.loader.js";
import { logger } from "../../../shared/utils/logger.utils.js";
import paths from "../../../shared/constants/paths.js";
import { replaceSectionContent } from "../../../shared/utils/documents/latex/latex.helpers.js";
import { sendToLLM } from "../../../shared/libs/LLMs/providers.js";

dotenv.config();

export const compileCoverLetter = async (
  uid: string,
  docRequest: DocumentRequest
): Promise<void> => {
  const jobPost = await db.getFullJobPosting(docRequest.options.jobId, uid);
  if (!jobPost || !jobPost.company_name) {
    console.error(
      "Job posting content or company name is not available in infoStore."
    );
    return;
  }

  if (process.env.NODE_ENV === "testing") {
    jobPost.company_name == "test";
    docRequest.options.jobId == 0;
  }

  try {
    const tempFolder = paths.paths.tempDir(uid, docRequest.options.jobId);
    const tempPdf = paths.paths.tempPdf(uid, docRequest.options.jobId);
    const tempFolderCompiled = paths.latex.tempCompiled(uid, docRequest.options.jobId);
    fs.mkdirSync(tempFolder, { recursive: true });
    fs.mkdirSync(tempPdf, { recursive: true });

    const originalTemplatePath = paths.latex.originalTemplate;
    fs.copyFileSync(originalTemplatePath, tempFolder);
    await generateCoverLetterDraft(jobPost);
    await exportLatex({
      jobNameSuffix: "cover_letter",
      outputPath: tempPdf,
      compiledPdfPath: tempFolderCompiled,
      companyName: jobPost.company_name,
      jobId: docRequest.options.jobId
    });
  } catch (error) {
    const e = error as Error;
    console.error(
      `Error exporting cover letter to PDF: ${e.message} See logs for more information`
    );
    return;
  }
};

const generateCoverLetterDraft = async (content: db.FullJobPosting) => {
  // try {
  //   console.log(
  //     `COVER LETTER - creating cover letter for ${content.company_name} - ${content.job_title}`
  //   );

  //   const resumeData = await fs.promises.readFile(
  //     paths.paths.jsonResume(content.company_name, '')
  //   );
  //   const coverLetterData = await fs.promises.readFile(
  //     paths.paths.currentCoverLetter,
  //     "utf-8"
  //   );
  //   const aboutMe = await fs.promises.readFile(paths.paths.aboutMe, "utf-8");
  //   const corrections = await fs.promises.readFile(
  //     paths.paths.corrections,
  //     "utf-8"
  //   );
  //   const considerations = await fs.promises.readFile(
  //     paths.paths.considerations,
  //     "utf-8"
  //   );

  //   const writingExamples = await getWritingExamples();
  //   if (!writingExamples) {
  //     throw new Error("Writing examples not found.");
  //   }

  //   const instructions = await loadTemplate("instructions", "coverletter", {
  //     corrections: corrections,
  //   });

  //   const prompt = await loadTemplate("prompts", "coverletter", {
  //     resume: JSON.stringify(resumeData),
  //     jobPosting: content.description ?? "",
  //     company: content.company_name,
  //     position: content.job_title,
  //     aboutMe: aboutMe,
  //     currentCoverLetter: coverLetterData,
  //     examples: writingExamples,
  //     considerations: considerations,
  //   });

  //   const coverLetterTemplate = await fs.promises.readFile(
  //     paths.latex.coverLetter.template,
  //     "utf8"
  //   );

  //   const extraData = {
  //     company: content.company_name,
  //     position: content.job_title,
  //   };

  //   const coverLetterInfo = Handlebars.compile(coverLetterTemplate)({
  //     ...infoStore.user_info,
  //     ...extraData,
  //   });
  //   await fs.promises.writeFile(
  //     paths.latex.coverLetter.letter,
  //     coverLetterInfo
  //   );

  //   await loadCoverLetterContent(instructions, prompt, CoverLetterSchema);
  //   logger.info("Cover letter generated successfully");
  // } catch (error) {
  //   const e = error as Error;
  //   logger.error(`Error generating cover letter content: ${e.message}`);
  //   throw error;
  // }
};

const loadCoverLetterContent = async <T>(
  instructions: string,
  prompt: string,
  schema: ZodType<T>
): Promise<void> => {
  const res =
    process.env.NODE_ENV === "testing"
      ? CoverLetterMock
      : await sendToLLM("gemini", instructions, prompt, CoverLetterSchema, "");

  if (!res) {
    throw new Error(
      "Failed to get response from OpenAI for cover letter generation"
    );
  }

  const parsedResponse = schema.safeParse(res);
  if (!parsedResponse.success) {
    logger.error(
      `Invalid response format for cover letter: ${JSON.stringify(
        parsedResponse.error.errors
      )}`
    );
    throw new Error("Invalid response format for cover letter");
  }

  const newContent = formatLatexSection("cover_letter")(parsedResponse.data);

  let latexContent;
  try {
    latexContent = await fs.promises.readFile(
      paths.latex.coverLetter.letter,
      "utf8"
    );
  } catch (error) {
    const e = error as Error;
    logger.error(`Error reading from cover letter file: ${e.message}`);
    throw error;
  }

  try {
    const sectionMap = {
      cover_letter: "cvletter",
    };
    const updatedContent = replaceSectionContent(
      latexContent,
      [newContent],
      "cvletter"
    );
    await fs.promises.writeFile(
      paths.latex.coverLetter.letter,
      updatedContent,
      "utf-8"
    );
  } catch (error) {
    if (error instanceof ResumeSectionNotFoundError) {
      logger.error(
        `Error replacing cover letter content: ${error.message}\n\tCheck LaTeX syntax in ${paths.latex.coverLetter.letter}`
      );
    } else {
      const e = error as Error;
      logger.error(`Error writing to cover letter file: ${e.message}`);
    }
    throw error;
  }
};
