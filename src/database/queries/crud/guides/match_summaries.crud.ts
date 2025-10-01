import { MatchSummary } from '../../../schemas/ordo-meritum.schemas.js';
import { db } from '../../../index.js';

export const createMatchSummary = async (summary: Omit<MatchSummary, 'id' | 'created_at' | 'updated_at'>) => {
  return await db
    .insertInto('match_summaries')
    .values(summary)
    .returningAll()
    .executeTakeFirst();
};

export const updateMatchSummary = async (id: number, updates: Partial<Omit<MatchSummary, 'id' | 'created_at' | 'updated_at'>>) => {
  return await db
    .updateTable('match_summaries')
    .set(updates)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
};

export const getMatchSummaryById = async (id: number) => {
  return await db
    .selectFrom('match_summaries')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
};

export const deleteMatchSummary = async (id: number) => {
  return await db
    .deleteFrom('match_summaries')
    .where('id', '=', id)
    .execute();
};