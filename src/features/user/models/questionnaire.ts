import { z } from 'zod';

export const CandidateQuestionsSchema = z.object({
  brief_history: z.string().default(''),
  questions: z.array(
    z.object({
      question_category: z.string(),
      questions: z.array(
        z.object({
          question: z.string(),
          answer: z.string().default(''),
        })
      ),
    })
  ),
});

export type CandidateQuestionsDTO = z.infer<typeof CandidateQuestionsSchema>
export const CandidateQuestionsUpdateSchema = CandidateQuestionsSchema.partial();
export type CandidateQuestionsUpdateDTO = z.infer<typeof CandidateQuestionsUpdateSchema>