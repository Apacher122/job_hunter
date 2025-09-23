import { db } from '../../../index';
import { Resume } from '../../../schemas/ordo-meritum.schemas';

export const getResumeById = (id: number) =>
  db.selectFrom('resumes').selectAll().where('id', '=', id).executeTakeFirst();

export const getResumesByCandidateId = (candidate_id: number) =>
  db.selectFrom('resumes').selectAll().where('candidate_id', '=', candidate_id).execute();

export const createResume = (resume: Omit<Resume, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
  db.insertInto('resumes').values(resume).returningAll().executeTakeFirst();

export const updateResume = (id: number, resume: Partial<Omit<Resume, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>>) =>
  db.updateTable('resumes').set(resume).where('id', '=', id).returningAll().executeTakeFirst();

export const deleteResume = (id: number) =>
  db.deleteFrom('resumes').where('id', '=', id).execute();
