import { db } from '../../../index';
import { JobPostingNiceToHaves } from '../../../schemas/ordo-meritum.schemas';

export const addMiscSkillToJobPosting = (entry: JobPostingNiceToHaves) =>
  db.insertInto('job_posting_nice_to_haves').values(entry).executeTakeFirst();

export const removeMiscSkilltFromJobPosting = (job_posting_id: number, skill: string) =>
  db.deleteFrom('job_posting_nice_to_haves')
    .where('job_posting_id', '=', job_posting_id)
    .where('skill', '=', skill)
    .execute();
