import { z } from 'zod';

export const guidingAnswersResponse = z.object({
    guiding_answers: z.array(
        z.object({
            question: z.string(),
            answer: z.string(),
            suggestions_and_guiding_questions: z.array(z.string()),
        })
    )
});