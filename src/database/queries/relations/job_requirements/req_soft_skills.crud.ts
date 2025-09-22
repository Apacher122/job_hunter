import { db } from '../../../index';
import { JobPostingSoftSkill } from '../../../schemas/ordo-meritum.schemas';

export const addSoftSkillToJobPosting = (entry: JobPostingSoftSkill) =>
  db.insertInto('job_posting_soft_skills').values(entry).executeTakeFirst();

export const removeSoftSkillFromJobPosting = (job_posting_id: number, soft_skill: string) =>
  db.deleteFrom('job_posting_soft_skills')
    .where('job_posting_id', '=', job_posting_id)
    .where('soft_skill', '=', soft_skill)
    .execute();
