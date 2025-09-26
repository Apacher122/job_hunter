export type LLMProvider =
  | "openai"
  | "cohere"
  | "ollama"
  | "gemini"
  | "groq"
  | "claude"
  | "cerebras";

export interface LLMClient {
  name: LLMProvider;
  message: <T>(
    instructions: string,
    prompt: any,
    schema: any,
    apiKey?: string
  ) => Promise<T>;
}

export interface LLMHeaders {
  llmProvider:
    | "openai"
    | "cohere"
    | "ollama"
    | "gemini"
    | "groq"
    | "claude"
    | "cerebras";
  userApiKey: string;
}
