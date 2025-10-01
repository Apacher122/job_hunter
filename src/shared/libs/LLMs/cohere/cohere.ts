import { CohereClientV2 } from "cohere-ai";
import { ZodType } from "zod";
import dotenv from "dotenv";
import { zodToJsonSchema } from "zod-to-json-schema";

dotenv.config();

export const messageCohere = async <T>(
  instructions: string,
  prompt: any,
  schema: ZodType<T>,
  apiKey?: string
): Promise<T> => {
  const client = new CohereClientV2({
    token: apiKey ?? process.env.COHERE_API_KEY,
  });

  const res = await client.chat({
    model: "command-a-03-2025",
    messages: [
      { role: "system", content: instructions },
      { role: "user", content: prompt },
    ],
    responseFormat: {
      type: "json_object",
      jsonSchema: zodToJsonSchema(schema),
    },
  });

  const textItem = res.message?.content?.find(
    (item): item is { type: "text"; text: string } => item.type === "text"
  );
  if (!textItem) throw new Error("Cohere returned no text content");

  try {
    return schema.parse(JSON.parse(textItem.text));
  } catch {
    throw new Error(`Cohere returned invalid JSON:\n${textItem.text}`);
  }
};
