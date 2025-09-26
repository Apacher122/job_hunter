import Anthropic from "@anthropic-ai/sdk";
import { ZodType } from "zod";
import { text } from 'express';
import zodToJsonSchema from "zod-to-json-schema";

const anthropic = new Anthropic();

export const messageClaude = async <T>(
  instructions: string,
  prompt: any,
  schema: ZodType<T>
): Promise<T> => {
  const rawText = await getClaudeText(instructions, prompt, schema);
  const parsed = JSON.parse(rawText);
  return schema.parse(parsed.data);
};

async function getClaudeText<T>(
  instructions: string,
  prompt: any,
  schema: ZodType<T>
): Promise<string> {
const toolInputSchema = {
  type: "object",
  properties: {
    resume: zodToJsonSchema(schema)
  },
  required: ["resume"]
};
  const res = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: instructions,
    tools: [
      {
        name: "structured_output_tool",
        description: "Returns structured data based on the provided schema",
        "input_schema": {
          type: "object",
          properties: {
            data: zodToJsonSchema(schema)
          },
          required: ["data"]
        },
      },
    ],
    messages: [
      { role: "user", content: JSON.stringify(prompt) },
    ],
  });

  const text = res.content[0].type === "text" ? res.content[0].text : null;
  if (!text) throw new Error("Claude returned no content");
  return text;
}
