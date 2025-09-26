import { z } from 'zod';

export const CandidateSchema = z.object({
  first_name: z.string(),
  middle_name: z.string().optional(),
  last_name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
});

export type CandidateSchemaDTO = z.infer<typeof CandidateSchema>;
export const CandidateUpdateSchema = CandidateSchema.partial();
export type CandidateUpdateSchemaDTO = z.infer<typeof CandidateUpdateSchema>;
