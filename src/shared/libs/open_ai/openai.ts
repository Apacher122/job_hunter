import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { encoding_for_model } from "@dqbd/tiktoken";
import { logger } from '../../utils/logger';
import { zodResponseFormat } from 'openai/helpers/zod';
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OpenAI API key is missing');
}

const openai = new OpenAI({
    apiKey: apiKey,
});


// Sends prompt to OpenAI API. Receives a zod object.
export const messageOpenAI = async(
    prompt: any, 
    zodFormat: any
) => {
    try {
        const completion = await openai.beta.chat.completions.parse({
            model: "gpt-4o-mini-2024-07-18",
            messages: [
                { role: "system", content: "You are a professional career advisor and writing assistant." },
                { role: "user", content: prompt }
            ],
            response_format: zodResponseFormat(zodFormat, "response")
        });

        const response = completion.choices[0].message;

        if (response.parsed) {
            return response.parsed;
        } else if (response.refusal) {
            throw new Error('OpenAI said it no no wanna :/');
        }
        logger.info(`Response: ${response.parsed}`);
    } catch (error) {
        const e = error as Error;
        console.error(`OpenAI API call error: ${e.message}`);
          // Handle edge cases
        if (e.constructor.name === "LengthFinishReasonError") {
            console.error("Too many tokens: ", e.message);
        } else {
            // Handle other exceptions
            console.error("OpenAI API call error: ", e.message);
        }
    }
}

export const countTokens = (text: string): number => {
    const enc = encoding_for_model("gpt-4"); // or "gpt-3.5-turbo", etc.
    const tokens = enc.encode(text);
    return tokens.length;
};