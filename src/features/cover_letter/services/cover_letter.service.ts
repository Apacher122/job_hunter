import { CoverLetterSchema } from '../models/cover_letter.models.js';
import Handlebars from 'handlebars';
import { ResumeSectionNotFoundError } from '../../../shared/errors/resume_builder.errors.js';
import { ZodType } from 'zod';
import { exportLatex } from '../../documents/services/export.service.js';
import { formatLatexSection } from '../../../shared/utils/formatters/resume.formatter.js';
import fs from 'fs';
import { getOpenAIResponse } from '../../../shared/libs/open_ai/openai.js';
import { getWritingExamples } from '../../../shared/utils/formatters/string.formatter.js';
import { infoStore } from '../../../shared/data/info.store.js';
import { loadTemplate } from '../../../shared/utils/templates/template.loader.js';
import { logger } from '../../../shared/utils/logger.js';
import paths from '../../../shared/constants/paths.js';
import { replaceSectionContent } from '../../../shared/utils/documents/latex/latex.helpers.js';
import { getJobPost } from '../../../database/queries/job.queries.js';
import { JobPosting } from '../../../shared/data/info.store.js';
import { CoverLetterMock } from '../models/cover_letter.mocks.js';
import dotenv from 'dotenv';
dotenv.config();

export const compileCoverLetter = async (id: number): Promise<void> => {
  const jobPost = await getJobPost(id);
  if (!jobPost || !jobPost.companyName) {
    console.error(
      'Job posting content or company name is not available in infoStore.'
    );
    return;
  }
  let jobContent = jobPost;

  let companyName = jobContent.companyName;

  if (process.env.NODE_ENV === 'testing') {
    jobContent.companyName == 'test';
    jobContent.id == 0;
  }

  try {
    await generateCoverLetterDraft(jobContent);
    await exportLatex({
      jobNameSuffix: 'cover_letter',
      latexFilePath: paths.latex.coverLetter.letter,
      targetDirectory: paths.paths.dir,
      compiledPdfPath: paths.paths.compiledCoverLetter(
        jobContent.companyName,
        jobContent.id
      ),
      movedPdfPath: paths.paths.movedCoverLetter(
        jobContent.companyName,
        jobContent.id
      ),
      jobPost,
    });
  } catch (error) {
    const e = error as Error;
    console.error(
      `Error exporting cover letter to PDF: ${e.message} See logs for more information`
    );
    return;
  }
};

const generateCoverLetterDraft = async (content: JobPosting) => {
  try {
    console.log(
      `COVER LETTER - creating cover letter for ${content.rawCompanyName} - ${content.position}`
    );

    const resumeData = await fs.promises.readFile(
      paths.paths.jsonResume(content.companyName, content.id)
    );
    const coverLetterData = await fs.promises.readFile(
      paths.paths.currentCoverLetter,
      'utf-8'
    );
    const aboutMe = await fs.promises.readFile(paths.paths.aboutMe, 'utf-8');
    const corrections = await fs.promises.readFile(
      paths.paths.corrections,
      'utf-8'
    );
    const considerations = await fs.promises.readFile(
      paths.paths.considerations,
      'utf-8'
    );

    const writingExamples = await getWritingExamples();
    if (!writingExamples) {
      throw new Error('Writing examples not found.');
    }

    const instructions = await loadTemplate('instructions', 'coverletter', {
      corrections: corrections,
    });

    const prompt = await loadTemplate('prompts', 'coverletter', {
      resume: JSON.stringify(resumeData),
      jobPosting: content.body,
      company: content.rawCompanyName,
      position: content.position,
      aboutMe: aboutMe,
      currentCoverLetter: coverLetterData,
      examples: writingExamples,
      considerations: considerations,
    });

    const coverLetterTemplate = await fs.promises.readFile(
      paths.latex.coverLetter.template,
      'utf8'
    );

    const extraData = {
      company: content.rawCompanyName,
      position: content.position,
    };

    const coverLetterInfo = Handlebars.compile(coverLetterTemplate)({
      ...infoStore.user_info,
      ...extraData,
    });
    await fs.promises.writeFile(
      paths.latex.coverLetter.letter,
      coverLetterInfo
    );

    await loadCoverLetterContent(instructions, prompt, CoverLetterSchema);
    logger.info('Cover letter generated successfully');
  } catch (error) {
    const e = error as Error;
    logger.error(`Error generating cover letter content: ${e.message}`);
    throw error;
  }
};

const loadCoverLetterContent = async <T>(
  instructions: string,
  prompt: string,
  schema: ZodType<T>
): Promise<void> => {
  const res =
    process.env.NODE_ENV === 'testing'
      ? CoverLetterMock
      : await getOpenAIResponse(instructions, prompt, schema);

  if (!res) {
    throw new Error(
      'Failed to get response from OpenAI for cover letter generation'
    );
  }

  const parsedResponse = schema.safeParse(res);
  if (!parsedResponse.success) {
    logger.error(
      `Invalid response format for cover letter: ${JSON.stringify(
        parsedResponse.error.errors
      )}`
    );
    throw new Error('Invalid response format for cover letter');
  }

  const newContent = formatLatexSection('cover_letter')(parsedResponse.data);

  let latexContent;
  try {
    latexContent = await fs.promises.readFile(
      paths.latex.coverLetter.letter,
      'utf8'
    );
  } catch (error) {
    const e = error as Error;
    logger.error(`Error reading from cover letter file: ${e.message}`);
    throw error;
  }

  try {
    const sectionMap = {
      cover_letter: 'cvletter',
    };
    const updatedContent = replaceSectionContent(
      latexContent,
      [newContent],
      'cvletter'
    );
    await fs.promises.writeFile(
      paths.latex.coverLetter.letter,
      updatedContent,
      'utf-8'
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
