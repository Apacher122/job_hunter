import { db } from '../../../index';
import { MatchSummary } from '../../../schemas/ordo-meritum.schemas';

export const getMatchSummaryById = (id: number) =>
  db.selectFrom('match_summaries').selectAll().where('id', '=', id).executeTakeFirst();

export const getMatchSummaryByJobPostingId = (job_posting_id: number) =>
  db.selectFrom('match_summaries').selectAll().where('job_posting_id', '=', job_posting_id).executeTakeFirst();

export const createMatchSummary = (summary: Omit<MatchSummary, 'id' | 'created_at' | 'updated_at'>) =>
  db.insertInto('match_summaries').values(summary).returningAll().executeTakeFirst();

export const updateMatchSummary = (id: number, summary: Partial<Omit<MatchSummary, 'id' | 'created_at' | 'updated_at'>>) =>
  db.updateTable('match_summaries').set(summary).where('id', '=', id).returningAll().executeTakeFirst();

export const deleteMatchSummary = (id: number) =>
  db.deleteFrom('match_summaries').where('id', '=', id).execute();
