import { db } from '../../../index';
import { EducationInformation } from '../../../schemas/ordo-meritum.schemas';

export const getEducationById = (id: number) =>
  db.selectFrom('education_information')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();

export const getEducationByCandidateId = (candidate_id: number) =>
  db.selectFrom('education_information')
    .selectAll()
    .where('candidate_id', '=', candidate_id)
    .execute();

export const createEducation = (edu: Omit<EducationInformation, 'id'>) =>
  db.insertInto('education_information')
    .values(edu)
    .returningAll()
    .executeTakeFirst();

export const updateEducation = (id: number, edu: Partial<Omit<EducationInformation, 'id'>>) =>
  db.updateTable('education_information')
    .set(edu)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();

export const deleteEducation = (id: number) =>
  db.deleteFrom('education_information')
    .where('id', '=', id)
    .execute();
