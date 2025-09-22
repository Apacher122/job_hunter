import { db } from '../../../index';
import { JobPostingRequirement } from '../../../schemas/ordo-meritum.schemas';

export const addRequirementToJobPosting = (entry: JobPostingRequirement) =>
  db.insertInto('job_posting_requirements').values(entry).executeTakeFirst();

export const removeRequirementFromJobPosting = (job_posting_id: number, requirement: string) =>
  db.deleteFrom('job_posting_requirements')
    .where('job_posting_id', '=', job_posting_id)
    .where('requirement', '=', requirement)
    .execute();
