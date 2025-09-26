import { Skill, SkillItem } from '../../../schemas/ordo-meritum.schemas';

import { db } from '../../../index';

export const createSkill = async (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => {
  return await db
    .insertInto('skills')
    .values(skill)
    .returningAll()
    .executeTakeFirst();
};

export const updateSkill = async (id: number, updates: Partial<Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>>) => {
  return await db
    .updateTable('skills')
    .set(updates)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
};

export const getSkillById = async (id: number) => {
  return await db
    .selectFrom('skills')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
};

export const deleteSkill = async (id: number) => {
  return await db
    .deleteFrom('skills')
    .where('id', '=', id)
    .execute();
};

export const createSkillItem = async (item: Omit<SkillItem, 'id'>) => {
  return await db
    .insertInto('skill_items')
    .values(item)
    .returningAll()
    .executeTakeFirst();
};

export const updateSkillItem = async (id: number, updates: Partial<Omit<SkillItem, 'id'>>) => {
  return await db
    .updateTable('skill_items')
    .set(updates)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
};

export const getSkillItemById = async (id: number) => {
  return await db
    .selectFrom('skill_items')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
};

export const deleteSkillItem = async (id: number) => {
  return await db
    .deleteFrom('skill_items')
    .where('id', '=', id)
    .execute();
};