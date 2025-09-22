import { db } from '../../../index';
import { JobPostingCloudPlatform } from '../../../schemas/ordo-meritum.schemas';

export const addCloudPlatformToJobPosting = (entry: JobPostingCloudPlatform) =>
  db.insertInto('job_posting_cloud_platforms').values(entry).executeTakeFirst();

export const removeCloudPlatformFromJobPosting = (job_posting_id: number, cloud: string) =>
  db.deleteFrom('job_posting_cloud_platforms')
    .where('job_posting_id', '=', job_posting_id)
    .where('cloud', '=', cloud)
    .execute();
