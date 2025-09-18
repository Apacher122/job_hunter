// db/jobInfo.ts
import { db } from '../../../index';
import { JobInfo } from '../../../schemas/ordo-meritum.schemas';

export const getJobInfoByJobPostingId = (job_posting_id: number) =>
  db.selectFrom('job_info').selectAll().where('job_posting_id', '=', job_posting_id).executeTakeFirst();

export const createJobInfo = (info: Omit<JobInfo, 'job_posting_id'> & { job_posting_id: number }) =>
  db.insertInto('job_info').values(info).returningAll().executeTakeFirst();

export const updateJobInfo = (job_posting_id: number, info: Partial<Omit<JobInfo, 'job_posting_id'>>) =>
  db.updateTable('job_info').set(info).where('job_posting_id', '=', job_posting_id).returningAll().executeTakeFirst();

export const deleteJobInfo = (job_posting_id: number) =>
  db.deleteFrom('job_info').where('job_posting_id', '=', job_posting_id).execute();
