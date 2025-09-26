import { LLMClient, LLMProvider } from "../../types/llm.types";

import { messageCerebras } from "./cerebras/cerebras";
import { messageClaude } from "./anthropic/anthropic";
import { messageCohere } from "./cohere/cohere";
import { messageGemini } from "./gemini/gemini";
import { messageGroq } from "./groq/groq";
import { messageOllama } from "./ollama/ollama";
import { messageOpenAI } from "./open_ai/openai";

export const providers: Record<LLMProvider, LLMClient> = {
  openai: {
    name: "openai",
    message: messageOpenAI,
  },
  cohere: {
    name: "cohere",
    message: messageCohere,
  },
  ollama: {
    name: "ollama",
    message: messageOllama,
  },
  gemini: {
    name: "gemini",
    message: messageGemini,
  },
  groq: {
    name: "groq",
    message: messageGroq,
  },
  claude: {
    name: "claude",
    message: messageClaude,
  },
  cerebras: {
    name: "cerebras",
    message: messageCerebras,
  },
};

export async function sendToLLM<T>(
  provider: LLMProvider,
  instructions: string,
  prompt: any,
  schema: any,
  apiKey?: string
): Promise<T> {
  const client = providers[provider];
  if (!client) throw new Error(`Unknown provider: ${provider}`);
  return client.message(instructions, prompt, schema, apiKey);
}
