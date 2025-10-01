import { z } from "zod";

// export const DocumentRequestSchema = z.object({
//   apiKey: z.string(),
//   docType: z.enum(['resume', 'cover-letter']),
//   jobId: z.preprocess((value) => Number(value), z.number().int().positive()),
//   llm: z.enum(['openai', 'cohere', 'ollama', 'gemini', 'groq', 'claude', 'cerebras']).optional(),
//   getNew: z.preprocess((value) => value === "true" || value === true, z.boolean()).optional(),
// });

export const DocumentRequestSchema = z.object({
  apiKey: z.string(),
  payload: z.any(),
  options: z.object({
    jobId: z.preprocess((value) => Number(value), z.number().int().positive()),
    docType: z.enum(['resume', 'cover-letter']),
    llm: z.enum(['openai', 'cohere', 'ollama', 'gemini', 'groq', 'claude', 'cerebras']).optional(),
    getNew: z.preprocess((value) => value === "true" || value === true, z.boolean()).optional(),
    corrections: z.array(z.string()).optional().default([]),
  })
})

export type DocumentRequest = z.infer<typeof DocumentRequestSchema>;