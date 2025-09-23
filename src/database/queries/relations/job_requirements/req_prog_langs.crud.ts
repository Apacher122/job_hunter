import { db } from '../../../index';
import { JobPostingProgLanguage } from '../../../schemas/ordo-meritum.schemas';

export const addProgLanguageToJobPosting = (lang: JobPostingProgLanguage) =>
  db.insertInto('job_posting_prog_languages').values(lang).executeTakeFirst();

export const removeProgLanguageFromJobPosting = (job_posting_id: number, language: string) =>
  db.deleteFrom('job_posting_prog_languages')
    .where('job_posting_id', '=', job_posting_id)
    .where('language', '=', language)
    .execute();
