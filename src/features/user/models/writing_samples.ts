import { z } from 'zod';

export const CandidateWritingSchema = z.object({
  writing_samples: z.array(
    z.object({
      content: z.string(),
    })
  ),
});

export type CandidateWritingDTO = z.infer<typeof CandidateWritingSchema>;
export const CandidateUpdateWritingSchema = CandidateWritingSchema.partial();
export type CandidateUpdateWritingDTO = z.infer<typeof CandidateUpdateWritingSchema>