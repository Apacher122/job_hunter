import { sum } from "pdf-lib";
import { z } from "zod";

export const MatchRequestSchema = z.object({
  apiKey: z.string(),
  payload: z.any(),
  options: z.object({
    jobId: z.preprocess((value) => Number(value), z.number().int().positive()),
    llm: z.enum(['openai', 'cohere', 'ollama', 'gemini', 'groq', 'claude', 'cerebras']).optional(),
    getNew: z.preprocess((value) => value === "true" || value === true, z.boolean()).optional(),
  })
})