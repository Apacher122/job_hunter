import { z } from 'zod';

export const applicationGuideResponse = z.object({
    applicationGuide: z.object({
        company: z.string(),
        position: z.string(),
        suggested_salary_ask: z.string(),
        compatibility: z.object({   
            is_compatible: z.boolean(),
            compatibility_score: z.number(),
            compatibility_reason: z.string(),
            probability_of_success: z.number(),
        }),
        resume_review: z.object({
            resume_score: z.number(),
            resume_feedback: z.string(),
        }),
        suggestions: z.array(
            z.object({
                suggestion_text: z.string(),
                justification: z.string(),
            })
        ),
    }) 
});