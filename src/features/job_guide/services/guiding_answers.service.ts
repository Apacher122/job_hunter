import {
  GuidingQuestionsSchema,
  GuidingQuestionsType,
} from '../models/guiding_questions.models.js';

import { GuidingQuestionsMock } from '../models/mocks/guiding_questions.mocks.js';
import fs from 'fs';
import { getJobPost } from '../../../database/queries/old/job.queries.js';
import { getOpenAIResponse } from '../../../shared/libs/open_ai/openai.js';
import { getWritingExamples } from '../../../shared/utils/formatters/string.formatter.js';
import { infoStore } from '../../../shared/data/info.store.js';
import { loadTemplate } from '../../../shared/utils/templates/template.loader.js';
import paths from '../../../shared/constants/paths.js';

export const getGuidingAnswers = async (
  id: number,
): Promise<void> => {
  try{
  const jobContent = await getJobPost(id);
  if (!jobContent || !jobContent.body) {
    throw new Error('Job posting content is not available in infoStore.');
  }
  const resumeData = await fs.promises.readFile(
    paths.paths.jsonResume(jobContent.companyName, jobContent.id)
  );
  const aboutMe = await fs.promises.readFile(paths.paths.aboutMe, 'utf-8');
  const considerations = await fs.promises.readFile(
    paths.paths.considerations,
    'utf-8'
  );
  let extra_questions = await fs.promises.readFile(
    paths.paths.possibleQuestions,
    'utf-8'
  );
  if (!extra_questions) {
    extra_questions = '';
  }
  const examples = await getWritingExamples();
  if (!examples) {
    throw new Error('Writing examples not found.');
  }

  const instructions = await loadTemplate('instructions', 'guidingquestions', {
    companyName: jobContent.rawCompanyName,
    additionalQuestions: extra_questions,
    considerations: considerations,
  });

  const prompt = await loadTemplate('prompts', 'guidingquestions', {
    resume: JSON.stringify(resumeData),
    jobPosting: jobContent.body,
    company: jobContent.rawCompanyName,
    position: jobContent.position,
    aboutMe: aboutMe,
    examples: examples,
  });

  const response =
    process.env.NODE_ENV === 'testing'
      ? GuidingQuestionsMock
      : await getOpenAIResponse(instructions, prompt, GuidingQuestionsSchema);

  const parsedResponse = GuidingQuestionsSchema.safeParse(response);

  if (!parsedResponse.success) {
    throw new Error('Invalid response format from OpenAI');
  }

  const answers = parsedResponse.data.guiding_questions;

  const markdown = generateMarkDownContent(answers);

  const filePath = paths.paths.guidingAnswers(
    jobContent.companyName,
    jobContent.id
  );


    await fs.promises.writeFile(filePath, markdown, 'utf-8');
  } catch (error) {
    const e = error as Error;
    console.error(`Error saving guiding answers: ${e.message}`);
    throw error;
  }
};

const generateMarkDownContent = (answers: any[]) => {
  return answers
    .map((item, i) => {
      const suggestions = item.suggestions_and_guiding_questions
        .map((s: any) => `- ${s}`)
        .join('\n');
      return `### ${i + 1}. ${item.question}\n\nAnswer Draft: ${
        item.answer
      }\n\n**Suggestions & Guiding-Questions:**\n${suggestions}`;
    })
    .join('\n\n');
};
