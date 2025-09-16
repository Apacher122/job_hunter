import { z } from 'zod';

export const GuidingQuestionsSchema = z.object({
    guiding_questions: z.array(
        z.object({
            question: z.string(),
            answer: z.string(),
            suggestions_and_guiding_questions: z.array(z.string()),
        })
    )
});

export type GuidingQuestionsType = z.infer<typeof GuidingQuestionsSchema>