import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { ChatCompletion } from "groq-sdk/resources/chat/completions";
import { ZodType } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

/**
 * Generic function to send a prompt to Cerebras API and return structured JSON validated with Zod
 */
export const messageCerebras = async <T>(
  instructions: string,
  prompt: any,
  schema: ZodType<T>,
  apiKey?: string
): Promise<T> => {
  const rawText = await getCerebrasText(instructions, prompt, schema, apiKey);
  const parsed = JSON.parse(rawText);
  const unwrapped = parsed.resume ?? parsed;
  return schema.parse(unwrapped);
};

/**
 * Internal function to call Cerebras chat completions
 */
async function getCerebrasText<T>(
  instructions: string,
  prompt: any,
  schema: ZodType<T>,
  apiKey?: string
): Promise<string> {
  const client = new Cerebras({ apiKey: apiKey });
  const res = (await client.chat.completions.create({
    model: "qwen-3-235b-a22b-thinking-2507",
    messages: [
      { role: "system", content: instructions },
      { role: "user", content: prompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "resume",
        strict: true,
        schema: zodToJsonSchema(schema),
      },
    },
  })) as any;

  const text = res.choices[0].message.content;
  if (!text) throw new Error("Cerebras returned no text content");
  return text;
}
