import { db } from '../../../index';
import { JobPostingFramework } from '../../../schemas/ordo-meritum.schemas';

export const addFrameworkToJobPosting = (fw: JobPostingFramework) =>
  db.insertInto('job_posting_frameworks').values(fw).executeTakeFirst();

export const removeFrameworkFromJobPosting = (job_posting_id: number, framework: string) =>
  db.deleteFrom('job_posting_frameworks')
    .where('job_posting_id', '=', job_posting_id)
    .where('framework', '=', framework)
    .execute();
