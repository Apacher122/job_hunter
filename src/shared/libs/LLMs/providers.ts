import { LLMClient, LLMProvider } from "../../types/llm.types.js";

import { messageCerebras } from "./cerebras/cerebras.js";
import { messageClaude } from "./anthropic/anthropic.js";
import { messageCohere } from "./cohere/cohere.js";
import { messageGemini } from "./gemini/gemini.js";
import { messageGroq } from "./groq/groq.js";
import { messageOllama } from "./ollama/ollama.js";
import { messageOpenAI } from "./open_ai/openai.js";
import { mockLLMClient } from "../../mocks/mockLLMClient.js";

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
  }
};

export async function sendToLLM<T>(
  provider: LLMProvider,
  instructions: string,
  prompt: any,
  schema: any,
  apiKey?: string
): Promise<T> {
  console.log(`Sending to ${provider}`);
  if (process.env.NODE_ENV === "testing") {
    console.log("Using mock LLM client");
    return mockLLMClient.message(instructions, prompt, schema, apiKey);
  }
  
  const client = providers[provider];
  if (!client) throw new Error(`Unknown provider: ${provider}`);
  return client.message(instructions, prompt, schema, apiKey);
}
