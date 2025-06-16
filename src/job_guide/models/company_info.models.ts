import { z } from 'zod';

export const CompanyInfoSchema = z.object({
    company_name: z.string(),
    company_description: z.string(),
    company_website: z.string(),
    company_industry: z.string(),
    company_size: z.string(),
    company_location: z.string(),
    company_culture: z.string(),
    company_values: z.string(),
    company_benefits: z.string(),
    job_info: z.object({
        position_title: z.string(),
        position_review: z.string(),
        typical_salary_ask: z.string(),
        typical_salary_ask_reason: z.string(),
        advised_salary_ask: z.string(),
        advised_salary_ask_reason: z.string(),
        application_process: z.string(),
        expected_response_time: z.string(),
        behavioral_questions: z.array(
            z.object({ 
                question: z.string(),
                question_source: z.string(),
                answer: z.string(),
                what_they_look_for: z.string(),
                what_to_study: z.string(),
            })
        ),
        technical_questions: z.array(
            z.object({
                question: z.string(),
                question_source: z.string(),
                answer: z.string(),
                what_they_look_for: z.string(),
                what_to_study: z.string(),
            })
        ),
        coding_questions: z.array(
            z.object({
                question: z.string(),
                question_source: z.string(),
                answer: z.string(),
                what_they_look_for: z.string(),
                what_to_study: z.string(),
            })
        ),
        additional_information: z.array( 
            z.object({
                information_title: z.string(),
                text: z.string(),
            })
        ),
    }),
});

export type CompanyInfoType = z.infer<typeof CompanyInfoSchema>;