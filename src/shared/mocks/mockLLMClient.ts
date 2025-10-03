import * as mockSchemas from "./schemas/index.js";

import { LLMClient, LLMProvider } from "../types/llm.types.js";

import { CompanyInfoSchema } from "../../features/job_guide/models/domain/company_info.js";
import { CoverLetterSchema } from "../../features/documents/models/domain/cover_letter.js";
import { GuidingQuestionsSchema } from "../../features/job_guide/models/domain/guiding_questions.js";
import {JobDescriptionSchema} from "../../features/application_tracking/models/job_description.js";
import { MatchSummarySchema } from "../../features/job_guide/models/domain/match_summary.js";
import { ResumeSchema } from "../../features/documents/models/domain/resume.js";
import { mock } from "node:test";

export const mockLLMClient: LLMClient = {
  name: 'mock-llm' as LLMProvider, // Cast to LLMProvider
  message: async <T>(
    instructions: string,
    prompt: any,
    schema: any,
    apiKey?: string
  ): Promise<T> => {
    if (schema === JobDescriptionSchema) {
      return schema.parse(mockSchemas.JobDescriptionMock);
    } else if (schema === ResumeSchema) {
      return schema.parse(mockSchemas.ResumeMock);
    } else if (schema === CoverLetterSchema) {
      return schema.parse(mockSchemas.CoverLetterMock);
    } else if (schema === CompanyInfoSchema) {
      return schema.parse(mockSchemas.CompanyInfoMock);
    } else if (schema === GuidingQuestionsSchema) {
      return schema.parse(mockSchemas.GuidingQuestionsMock);
    } else if (schema === MatchSummarySchema) {
      return schema.parse(mockSchemas.MatchSummaryMock);
    } else {
      throw new Error("Unknown schema");
    }
  },
};