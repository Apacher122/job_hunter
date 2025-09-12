import { z } from 'zod';

export const matchSummaryResponse = z.object({
    company_name: z.string(),
    match_summary: z.object({
        should_apply: z.enum(['Strong Yes', 'Yes', 'No', 'Strong No', 'Maybe']),
        should_apply_reasoning: z.string(),
        metrics: z.array ( 
            z.object({
                scoreTitle: z.string(),
                score: z.number(),
                scoreJustification: z.string(),
                isCompatible: z.boolean(),
                probabilityOfSuccess: z.number(),
                probabilityOfSuccessEquation: z.string().optional(),
                probabilityOfSuccessJustification: z.string().optional(),
            }),
        ),
        overall_match_summary: z.object({
            summary: z.array(z.string()),
            suggestions: z.array(z.string()),
        }),
        projects_section_missing_entries: z.boolean(),
    }),
});