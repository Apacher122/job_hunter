import { db } from '../../../index';
import { AdditionalInformation } from '../../../schemas/ordo-meritum.schemas';

export const getAdditionalInfoById = (id: number) =>
  db.selectFrom('additional_information').selectAll().where('id', '=', id).executeTakeFirst();

export const getAdditionalInfoByJobPostingId = (job_posting_id: number) =>
  db.selectFrom('additional_information').selectAll().where('job_posting_id', '=', job_posting_id).execute();

export const createAdditionalInfo = (info: Omit<AdditionalInformation, 'id' | 'created_at'>) =>
  db.insertInto('additional_information').values(info).returningAll().executeTakeFirst();

export const updateAdditionalInfo = (id: number, info: Partial<Omit<AdditionalInformation, 'id' | 'created_at'>>) =>
  db.updateTable('additional_information').set(info).where('id', '=', id).returningAll().executeTakeFirst();

export const deleteAdditionalInfo = (id: number) =>
  db.deleteFrom('additional_information').where('id', '=', id).execute();
