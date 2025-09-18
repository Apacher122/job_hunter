import { db } from '../../../index';
import { Skill, SkillItem } from '../../../schemas/ordo-meritum.schemas';

// Skills
export const getSkillById = (id: number) =>
  db.selectFrom('skills').selectAll().where('id', '=', id).executeTakeFirst();

export const getSkillsByResumeId = (resume_id: number) =>
  db.selectFrom('skills').selectAll().where('resume_id', '=', resume_id).execute();

export const createSkill = (skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>) =>
  db.insertInto('skills').values(skill).returningAll().executeTakeFirst();

export const updateSkill = (id: number, skill: Partial<Omit<Skill, 'id' | 'created_at' | 'updated_at'>>) =>
  db.updateTable('skills').set(skill).where('id', '=', id).returningAll().executeTakeFirst();

export const deleteSkill = (id: number) =>
  db.deleteFrom('skills').where('id', '=', id).execute();

// Skill Items
export const getSkillItemsBySkillId = (skill_id: number) =>
  db.selectFrom('skill_items').selectAll().where('skill_id', '=', skill_id).execute();

export const createSkillItem = (item: Omit<SkillItem, 'id'>) =>
  db.insertInto('skill_items').values(item).returningAll().executeTakeFirst();

export const updateSkillItem = (id: number, item: Partial<Omit<SkillItem, 'id'>>) =>
  db.updateTable('skill_items').set(item).where('id', '=', id).returningAll().executeTakeFirst();

export const deleteSkillItem = (id: number) =>
  db.deleteFrom('skill_items').where('id', '=', id).execute();
