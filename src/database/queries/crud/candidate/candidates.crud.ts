import { db } from '../../../index';
import { Candidate } from '../../../schemas/ordo-meritum.schemas';

export const getCandidateById = (id: number) =>
  db.selectFrom('candidates')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();

export const getAllCandidates = () =>
  db.selectFrom('candidates').selectAll().execute();

export const createCandidate = (candidate: Omit<Candidate, 'id' | 'created_at' | 'update_at'>) =>
  db.insertInto('candidates')
    .values(candidate)
    .returningAll()
    .executeTakeFirst();

export const updateCandidate = (id: number, candidate: Partial<Omit<Candidate, 'id' | 'created_at' | 'update_at'>>) =>
  db.updateTable('candidates')
    .set(candidate)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();

export const deleteCandidate = (id: number) =>
  db.deleteFrom('candidates').where('id', '=', id).execute();
