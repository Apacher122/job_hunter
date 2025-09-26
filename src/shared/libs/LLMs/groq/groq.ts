import Groq from "groq-sdk";
import { ZodType } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

/**
 * Generic function to send a prompt to Groq API and return structured JSON validated with Zod
 */
export const messageGroq = async <T>(
  instructions: string,
  prompt: any,
  schema: ZodType<T>,
  apiKey?: string
): Promise<T> => {
  const rawText = await getGroqText(instructions, prompt, schema, apiKey);
  const parsed = JSON.parse(rawText);
  return schema.parse(parsed);
};

/**
 * Internal function to call Groq chat completions
 */
async function getGroqText<T>(
  instructions: string,
  prompt: any,
  schema: ZodType<T>,
  apiKey?: string,
): Promise<string> {
  const groq = new Groq({ apiKey: apiKey });
  const res = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct", // Use your chosen Groq model
    messages: [
      {
        role: "system",
        content: instructions,
      },
      {
        role: "user",
        content: prompt, // Pass prompt as JSON for structured output
      },
    ],
    temperature: 0,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "resume",
        schema: zodToJsonSchema(schema),
      }
    }
  });

  const text = res.choices?.[0]?.message?.content;
  if (!text) throw new Error("Groq returned no text content");

  return text;
}
