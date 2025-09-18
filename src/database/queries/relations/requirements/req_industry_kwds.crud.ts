import { db } from '../../../index';
import { JobPostingIndustryKeyword } from '../../../schemas/ordo-meritum.schemas';

export const addIndustryKeywordToJobPosting = (entry: JobPostingIndustryKeyword) =>
  db.insertInto('job_posting_industry_keywords').values(entry).executeTakeFirst();

export const removeIndustryKeywordFromJobPosting = (job_posting_id: number, keyword: string) =>
  db.deleteFrom('job_posting_industry_keywords')
    .where('job_posting_id', '=', job_posting_id)
    .where('keyword', '=', keyword)
    .execute();
