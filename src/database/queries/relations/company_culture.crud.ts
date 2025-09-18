import { db } from '../../index';
import { JobPostingCompanyCulture } from '../../schemas/ordo-meritum.schemas';

export const addCultureToJobPosting = (entry: JobPostingCompanyCulture) =>
  db.insertInto('job_posting_company_cultures').values(entry).executeTakeFirst();

export const removeCultureFromJobPosting = (job_posting_id: number, culture: string) =>
  db.deleteFrom('job_posting_company_cultures')
    .where('job_posting_id', '=', job_posting_id)
    .where('culture', '=', culture)
    .execute();
