import { JobRequirements } from '../../../schemas/ordo-meritum.schemas';
import { db } from '../../..';

export const createJobRequirements = async (req: Omit<JobRequirements, 'id' | 'created_at' | 'updated_at'>) => {
  return await db
    .insertInto('job_requirements')
    .values(req)
    .returningAll()
    .executeTakeFirst();
};

export const updateJobRequirements = async (id: number, updates: Partial<Omit<JobRequirements, 'id' | 'created_at' | 'updated_at'>>) => {
  return await db
    .updateTable('job_requirements')
    .set(updates)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
};

export const getJobRequirementsById = async (id: number) => {
  return await db
    .selectFrom('job_requirements')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
};

export const deleteJobRequirements = async (id: number) => {
  return await db
    .deleteFrom('job_requirements')
    .where('id', '=', id)
    .execute();
};