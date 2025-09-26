import { MatchSummaryType } from '../../../../features/job_guide/models/match_summary.models';
import prisma from '../../../prisma_client';

export async function upsertMatchSummary(
    jobPostId: number,
    matchSummary: MatchSummaryType['match_summary']
): Promise<MatchSummaryType['match_summary']> {
    return prisma.match_summaries.upsert({
        where: { job_posting_id: jobPostId },
        update: {
            should_apply: matchSummary.should_apply,
            should_apply_reasoning: matchSummary.should_apply_reasoning,
            metrics_json: JSON.stringify(matchSummary.metrics),
            overall_summary_json: JSON.stringify(matchSummary.overall_match_summary),
            projects_section_missing_entries: matchSummary.projects_section_missing_entries,
        },
        create : {
            job_posting_id: jobPostId,
            should_apply: matchSummary.should_apply,
            should_apply_reasoning: matchSummary.should_apply_reasoning,
            metrics_json: JSON.stringify(matchSummary.metrics),
            overall_summary_json: JSON.stringify(matchSummary.overall_match_summary),
        },
    });
}

export async function getMatchSummary(
    jobPostId: number,
): Promise<MatchSummaryType | null> {
    return prisma.match_summaries.findUnique({
        where: { job_posting_id: jobPostId }
    });
}