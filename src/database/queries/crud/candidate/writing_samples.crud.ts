import { CandidateWritingSample } from "../../../schemas/ordo-meritum.schemas";
import { db } from "../../..";

export const createCandidateWritingSample = async (
  sample: Omit<CandidateWritingSample, 'id' | 'createdAt' | 'updatedAt'>
) => {
  return await db
    .insertInto('candidate_writing_samples')
    .values(sample)
    .returningAll()
    .executeTakeFirst();
};

export const updateCandidateWritingSample = async (
  id: number,
  updates: Partial<Omit<CandidateWritingSample, 'id' | 'createdAt' | 'updatedAt'>>
) => {
  return await db
    .updateTable('candidate_writing_samples')
    .set(updates)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
};

export const getCandidateWritingSampleById = async (id: number) => {
  return await db
    .selectFrom('candidate_writing_samples')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
};

export const deleteCandidateWritingSample = async (id: number) => {
  return await db
    .deleteFrom('candidate_writing_samples')
    .where('id', '=', id)
    .execute();
};