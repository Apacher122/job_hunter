import { db } from '../../../index';
import { Experience, ExperienceDescription } from '../../../schemas/ordo-meritum.schemas';

// Experiences
export const getExperienceById = (id: number) =>
  db.selectFrom('experiences').selectAll().where('id', '=', id).executeTakeFirst();

export const getExperiencesByResumeId = (resume_id: number) =>
  db.selectFrom('experiences').selectAll().where('resume_id', '=', resume_id).execute();

export const createExperience = (exp: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) =>
  db.insertInto('experiences').values(exp).returningAll().executeTakeFirst();

export const updateExperience = (id: number, exp: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>) =>
  db.updateTable('experiences').set(exp).where('id', '=', id).returningAll().executeTakeFirst();

export const deleteExperience = (id: number) =>
  db.deleteFrom('experiences').where('id', '=', id).execute();

// Experience Descriptions
export const getDescriptionsByExperienceId = (experience_id: number) =>
  db.selectFrom('experience_descriptions').selectAll().where('experience_id', '=', experience_id).execute();

export const createExperienceDescription = (desc: Omit<ExperienceDescription, 'id'>) =>
  db.insertInto('experience_descriptions').values(desc).returningAll().executeTakeFirst();

export const updateExperienceDescription = (id: number, desc: Partial<Omit<ExperienceDescription, 'id'>>) =>
  db.updateTable('experience_descriptions').set(desc).where('id', '=', id).returningAll().executeTakeFirst();

export const deleteExperienceDescription = (id: number) =>
  db.deleteFrom('experience_descriptions').where('id', '=', id).execute();
