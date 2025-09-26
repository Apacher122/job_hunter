import { CoverLetterSchema } from "./cover_letter.models";
import { ResumeSchema } from "./resume.models";
import z from "zod";

export * from "./resume.models";
export * from "./resume.mocks";
export * from "./cover_letter.models";
export * from "./cover_letter.mocks";

export const DocumentSchema = z.discriminatedUnion("type", [
  ResumeSchema,
  CoverLetterSchema,
]);


export type DocumentType = z.infer<typeof DocumentSchema>;;