import { GoogleGenAI } from "@google/genai";
import { ZodType } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const messageGemini = async <T>(
  instructions: string,
  prompt: any,
  schema: any,
  apiKey?: string
): Promise<T> => {
  const rawText = await getGeminiText(instructions, prompt, schema, apiKey);
  const parsed = JSON.parse(rawText);
  return schema.parse(parsed);
};

async function getGeminiText<T>(
  instructions: string,
  prompt: any,
  schema: ZodType<T>,
  apiKey?: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: apiKey });
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-09-2025",
    contents: prompt,
    config: {
      systemInstruction: instructions,
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(schema),
    },
  });

  const text = res.text;
  if (!text) throw new Error("Gemini returned no text content");
  return text;
}
