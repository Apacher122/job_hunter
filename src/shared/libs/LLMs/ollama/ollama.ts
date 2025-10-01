import { Ollama } from "ollama";
import { ZodType } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const messageOllama = async <T>(
  instructions: string,
  prompt: any,
  schema: ZodType<T>,
  _apiKey?: string // not used, Ollama is local
): Promise<T> => {
  const ollama = new Ollama({ host: "http://host.docker.internal:11434" });

  const completion = await ollama.chat({
    model: "llama3.1:8b",
    messages: [
      { role: "system", content: instructions },
      { role: "user", content: prompt },
    ],
    format: zodToJsonSchema(schema),
  });

  return schema.parse(JSON.parse(completion.message.content));
};
