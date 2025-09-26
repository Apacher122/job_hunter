import { z } from 'zod';

export const CandidateSchema = z.object({
  first_name: z.string(),
  middle_name: z.string().optional(),
  last_name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
});

export const CandidateQuestionnaire = z.object({
  brief_history: z.string().default(''),
  questions: z.array(
    z.object({
      question_category: z.string(),
      questions: z.array(
        z.object({
          question: z.string(),
          answer: z.string().default(''),
        }),
      )
    })
  ),
})

export const CandidateWritingSamples = z.object({
  writing_samples: z.array(
    z.object({
      content: z.string(),
    })
  ),
})

export type CandidateSchemaDTO = z.infer<typeof CandidateSchema>;
export const CandidateUpdateSchema = CandidateSchema.partial();
export type CandidateUpdateSchemaDTO = z.infer<typeof CandidateUpdateSchema>;
