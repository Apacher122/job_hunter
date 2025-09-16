import { z } from 'zod';

export const JobDescriptionSchema = z.object ({
    job_title: z.string(),
    company_name: z.string(),
    years_of_experience_required: z.string(),
    education_level: z.string(),
    skills_required: z.array(
        z.string()
    ).default(''),
    skills_nice_to_haves: z.array(
        z.string()
    ).default(''),
    tools_and_technologies: z.array(
        z.string()
    ).default(''),
    programming_languages: z.array(
        z.string()
    ).default(''),
    frameworks_and_libraries: z.array(
        z.string()
    ).default(''),
    databases: z.array(
        z.string()
    ).default(''),
    cloud_platforms: z.array(
        z.string()
    ).default(''),
    industry_keywords: z.array(
        z.string()
    ).default(''),
    soft_skills: z.array(
        z.string()
    ).default(''),
    certifications: z.array(
        z.string()
    ).default(''),
    company_culture: z.array(
        z.string()
    ).default(''),
    company_values: z.array(
        z.string()
    ).default(''),
    salary_range: z.string(),
})

