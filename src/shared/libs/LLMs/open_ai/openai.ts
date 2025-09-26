import { zodResponseFormat, zodTextFormat } from "openai/helpers/zod";

import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export const messageOpenAI = async <T>(
  instructions: string,
  prompt: any,
  schema: any,
  apiKey?: string
): Promise<T> => {
  const client = new OpenAI({
    apiKey: apiKey ?? process.env.OPENAI_API_KEY,
  });

  const completion = await client.beta.chat.completions.parse({
    model: process.env.OPENAI_API_MODEL ?? "gpt-4o-mini-2024-07-18",
    messages: [
      { role: "system", content: instructions },
      { role: "user", content: prompt },
    ],
    response_format: zodResponseFormat(schema, "response"),
  });

  const response = completion.choices[0].message;
  if (response?.parsed) {
    return response.parsed as T;
  }
  throw new Error("OpenAI returned no parsed response");
};

export const getOpenAIResponse = async <T>(
  instructions: string,
  prompt: any,
  schema: any,
  apiKey?: string
): Promise<T> => {
  const client = new OpenAI({
    apiKey: apiKey ?? process.env.OPENAI_API_KEY,
  });

  const response = await client.responses.parse({
    model: process.env.OPENAI_API_MODEL ?? "gpt-4o-mini-2024-07-18",
    input: [
      { role: "system", content: instructions },
      { role: "user", content: prompt },
    ],
    text: {
      format: zodTextFormat(schema, "response"),
    },
  });

  if (response.output_parsed) {
    return response.output_parsed as T;
  }
  throw new Error("OpenAI did not return a valid response");
};
