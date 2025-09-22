import { db } from '../../../index';
import { JobPostingCertification } from '../../../schemas/ordo-meritum.schemas';

export const addCertificationToJobPosting = (entry: JobPostingCertification) =>
  db.insertInto('job_posting_certifications').values(entry).executeTakeFirst();

export const removeCertificationFromJobPosting = (job_posting_id: number, certification: string) =>
  db.deleteFrom('job_posting_certifications')
    .where('job_posting_id', '=', job_posting_id)
    .where('certification', '=', certification)
    .execute();
