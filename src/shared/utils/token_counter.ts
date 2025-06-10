import { encoding_for_model } from "@dqbd/tiktoken";

const enc = encoding_for_model("gpt-4"); // or "gpt-3.5-turbo", etc.

export const countTokens = (text: string): number => {
    const tokens = enc.encode(text);
    return tokens.length;
};