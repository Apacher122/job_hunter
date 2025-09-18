import { db } from '../../../index';
import { JobPostingCompanyValue } from '../../../schemas/ordo-meritum.schemas';

export const addValueToJobPosting = (entry: JobPostingCompanyValue) =>
  db.insertInto('job_posting_company_values').values(entry).executeTakeFirst();

export const removeValueFromJobPosting = (job_posting_id: number, value: string) =>
  db.deleteFrom('job_posting_company_values')
    .where('job_posting_id', '=', job_posting_id)
    .where('value', '=', value)
    .execute();
