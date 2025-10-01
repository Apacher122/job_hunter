import { Resume } from '../../../schemas/ordo-meritum.schemas.js';
import { db } from '../../../index.js';

export const createResume = async (resume: Omit<Resume, 'id' | 'created_at' | 'updated_at'>) => {
  return await db
    .insertInto('resumes')
    .values(resume)
    .returningAll()
    .executeTakeFirst();
};

export const updateResume = async (id: number, updates: Partial<Omit<Resume, 'id' | 'created_at' | 'updated_at'>>) => {
  return await db
    .updateTable('resumes')
    .set(updates)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
};

export const getResumeById = async (id: number) => {
  return await db
    .selectFrom('resumes')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
};

export const deleteResume = async (id: number) => {
  return await db
    .deleteFrom('resumes')
    .where('id', '=', id)
    .execute();
};

export const getResumeByUidAndRole = async (uid: string, roleId: number) => {
  return await db
    .selectFrom('resumes')
    .selectAll()
    .where('firebase_uid', '=', uid)
    .where('role_id', '=', roleId)
    .executeTakeFirst();
};