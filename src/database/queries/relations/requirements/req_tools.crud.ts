import { db } from '../../../index';
import { JobPostingTool } from '../../../schemas/ordo-meritum.schemas';

export const addToolToJobPosting = (tool: JobPostingTool) =>
  db.insertInto('job_posting_tools').values(tool).executeTakeFirst();

export const removeToolFromJobPosting = (job_posting_id: number, tool: string) =>
  db.deleteFrom('job_posting_tools')
    .where('job_posting_id', '=', job_posting_id)
    .where('tool', '=', tool)
    .execute();
