import { z } from 'zod';

export const MatchSummarySchema = z.object({
  company_name: z.string(),
  match_summary: z.object({
    should_apply: z.enum(['Strong Yes', 'Yes', 'No', 'Strong No', 'Maybe']),
    should_apply_reasoning: z.string(),
    metrics: z.array(
      z.object({
        score_title: z.enum([
          'Keyword & Phrases',
          'Experience Alignment',
          'Education & Credentials',
          'Skills & Competencies',
          'Achievements & Quantifiable Results',
          'Job-Specific Filters',
          'Cultural & Organizational Fit (Emerging Factor)',
        ]),
        raw_score: z.number(),
        weighted_score: z.number(),
        score_weight: z.number(),
        score_reason: z.string(),
        isCompatible: z.boolean(),
        strength: z.string(),
        weaknesses: z.string(),
      })
    ),
    overall_match_summary: z.object({
      overall_match_score: z.number(),
      summary: z.array(
        z.object({
          summary_text: z.string(),
          summary_temperature: z.enum(['Good', 'Neutral', 'Bad']),
        })
      ),
      suggestions: z.array(z.string()),
    }),
  }),
});

export type MatchSummaryType = z.infer<typeof MatchSummarySchema>;
