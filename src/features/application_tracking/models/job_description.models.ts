import { z } from 'zod';

export const JobDescriptionSchema = z.object({
  job_title: z.string(),
  company_name: z.string(),
  years_of_experience_required: z.string(),
  education_level: z.string(),

  skills_required: z
    .array(z.string())
    .default([])
    .transform((arr) => arr.join(', ')),

  skills_nice_to_haves: z
    .array(z.string())
    .default([])
    .transform((arr) => arr.join(', ')),

  tools_and_technologies: z
    .array(z.string())
    .default([])
    .transform((arr) => arr.join(', ')),

  programming_languages: z
    .array(z.string())
    .default([])
    .transform((arr) => arr.join(', ')),

  frameworks_and_libraries: z
    .array(z.string())
    .default([])
    .transform((arr) => arr.join(', ')),

  databases: z
    .array(z.string())
    .default([])
    .transform((arr) => arr.join(', ')),

  cloud_platforms: z
    .array(z.string())
    .default([])
    .transform((arr) => arr.join(', ')),

  industry_keywords: z
    .array(z.string())
    .default([])
    .transform((arr) => arr.join(', ')),

  soft_skills: z
    .array(z.string())
    .default([])
    .transform((arr) => arr.join(', ')),

  certifications: z
    .array(z.string())
    .default([])
    .transform((arr) => arr.join(', ')),

  company_culture: z
    .array(z.string())
    .default([])
    .transform((arr) => arr.join(', ')),

  company_values: z
    .array(z.string())
    .default([])
    .transform((arr) => arr.join(', ')),

  salary_range: z.string(),
});


export type JobDescription = z.infer<typeof JobDescriptionSchema>;