import { db } from '../../../index';
import { JobPosting } from '../../../schemas/ordo-meritum.schemas';

export const getJobPostingById = (id: number) =>
  db.selectFrom('job_postings').selectAll().where('id', '=', id).executeTakeFirst();

export const getAllJobPostings = () =>
  db.selectFrom('job_postings').selectAll().execute();

export const createJobPosting = (job: Omit<JobPosting, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) =>
  db.insertInto('job_postings').values(job).returningAll().executeTakeFirst();

export const updateJobPosting = (id: number, job: Partial<Omit<JobPosting, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>>) =>
  db.updateTable('job_postings').set(job).where('id', '=', id).returningAll().executeTakeFirst();

export const deleteJobPosting = (id: number) =>
  db.deleteFrom('job_postings').where('id', '=', id).execute();
