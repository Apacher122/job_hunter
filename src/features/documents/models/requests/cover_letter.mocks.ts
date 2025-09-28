import { z } from 'zod';

export const CoverLetterSchema = z.object({
    type: z.literal('cover_letter'),
    about: z.string(),
    experience: z.string(),
    whatIBring: z.string(),
});

export const CoverLetterReviewSchema = z.object({
    coverLetterReview: z.object({
        metrics: z.object({
            contentScore: z.number(),
            grammarScore: z.number(),
            formatScare: z.number(),
        }),
        contentAnalysis: z.object({
            strengths_summary: z.string(),
            strengths: z.array(z.string()),
            weaknesses_summary: z.string(),
            weaknesses: z.array(z.string()),
            suggestions: z.array(z.string()),
        }),
        grammarAnalysis: z.object({
            grammar_issues: z.array(z.string()),
            suggestions: z.array(z.string()),
        }),
        formatScore: z.object({
            format_issues: z.array(z.string()),
            suggestions: z.array(z.string()),
        }),
    }),
});

export type CoverLetter = z.infer<typeof CoverLetterSchema>;
export type CoverLetterReview = z.infer<typeof CoverLetterReviewSchema>;