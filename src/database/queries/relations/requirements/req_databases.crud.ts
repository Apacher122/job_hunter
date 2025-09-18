import { db } from '../../../index';
import { JobPostingDatabase } from '../../../schemas/ordo-meritum.schemas';

export const addDatabaseToJobPosting = (dbEntry: JobPostingDatabase) =>
  db.insertInto('job_posting_databases').values(dbEntry).executeTakeFirst();

export const removeDatabaseFromJobPosting = (job_posting_id: number, database: string) =>
  db.deleteFrom('job_posting_databases')
    .where('job_posting_id', '=', job_posting_id)
    .where('database', '=', database)
    .execute();
