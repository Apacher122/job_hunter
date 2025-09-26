import { MatchSummary } from '../../../schemas/ordo-meritum.schemas';
import { db } from '../../../index';

export const createMatchSummary = async (summary: Omit<MatchSummary, 'id' | 'createdAt' | 'updatedAt'>) => {
  return await db
    .insertInto('match_summaries')
    .values(summary)
    .returningAll()
    .executeTakeFirst();
};

export const updateMatchSummary = async (id: number, updates: Partial<Omit<MatchSummary, 'id' | 'createdAt' | 'updatedAt'>>) => {
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