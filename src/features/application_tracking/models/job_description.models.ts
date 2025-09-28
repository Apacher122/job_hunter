import { z } from "zod";

export const JobDescriptionSchema = z.object({
  job_title: z.string(),
  company_name: z.string(),
  years_of_exp: z.string().default('Not Specified'),
  education_level: z.string().default('Not Specified'),
  website: z.string(),
  applicant_count: z.number().default(0),
  post_age: z.string(),
  skills_required: z.array(z.string()).default([]),
  skills_nice_to_haves: z.array(z.string()).default([]),
  tools_and_technologies: z.array(z.string()).default([]),
  programming_languages: z.array(z.string()).default([]),
  frameworks_and_libraries: z.array(z.string()).default([]),
  databases: z.array(z.string()).default([]),
  cloud_technologies: z.array(z.string()).default([]),
  industry_keywords: z.array(z.string()).default([]),
  soft_skills: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  company_culture: z.string().default(''),
  company_values: z.string().default(''),
  salary_range: z.string(),
});

export type JobDescription = z.infer<typeof JobDescriptionSchema>;
