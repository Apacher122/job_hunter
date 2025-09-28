import { Education } from '../../../schemas/ordo-meritum.schemas';
import { db } from '../../../index';

export const createEducation = async (education: Omit<Education, 'id' | 'created_at' | 'updated_at'>) => {
  return await db
    .insertInto('education')
    .values(education)
    .returningAll()
    .executeTakeFirst();
};

export const updateEducation = async (id: number, updates: Partial<Omit<Education, 'id' | 'created_at' | 'updated_at'>>) => {
  return await db
    .updateTable('education')
    .set(updates)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
};

export const getEducationById = async (id: number) => {
  return await db
    .selectFrom('education')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
};

export const deleteEducation = async (id: number) => {
  return await db
    .deleteFrom('education')
    .where('id', '=', id)
    .execute();
};
