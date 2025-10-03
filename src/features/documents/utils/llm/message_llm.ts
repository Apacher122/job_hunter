import { ZodType, ZodTypeDef } from "zod";

import { LLMProvider } from "@shared/types/llm.types.js";
import { sendToLLM } from "@shared/libs/LLMs/providers.js";

export const generateAndValidateLLMResponse = async <T>(
  llm: LLMProvider,
  instructions: string,
  prompt: string,
  schema: ZodType<T, ZodTypeDef, T>,
  apiKey: string,
  mockData: T
): Promise<T> => {
  if (process.env.NODE_ENV === "testing") {
    return mockData;
  }

  const response = await sendToLLM(llm, instructions, prompt, schema, apiKey);
  if (!response) {
    throw new Error(`Failed to get a response from the LLM provider: ${llm}`);
  }

  const parsed = schema.safeParse(response);
  if (!parsed.success) {
    console.error("Zod validation failed:", parsed.error);
    throw new Error("Invalid response format from LLM.");
  }

  return parsed.data;
};