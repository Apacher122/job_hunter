import { CoverLetterSchema } from "./cover_letter.mocks";
import { ResumeSchema } from "./resume";
import z from "zod";

export * from "./resume";
export * from "./resume.mocks";
export * from "./cover_letter.mocks";
export * from "./cover_letter";

export const DocumentSchema = z.discriminatedUnion("type", [
  ResumeSchema,
  CoverLetterSchema,
]);


export type DocumentType = z.infer<typeof DocumentSchema>;;