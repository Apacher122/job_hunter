import { Project, ProjectDescription } from '../../../schemas/ordo-meritum.schemas';

import { db } from '../../../index';

export const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
  return await db
    .insertInto('projects')
    .values(project)
    .returningAll()
    .executeTakeFirst();
};

export const updateProject = async (id: number, updates: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>) => {
  return await db
    .updateTable('projects')
    .set(updates)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
};

export const getProjectById = async (id: number) => {
  return await db
    .selectFrom('projects')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
};

export const deleteProject = async (id: number) => {
  return await db
    .deleteFrom('projects')
    .where('id', '=', id)
    .execute();
};

export const createProjectDescription = async (desc: Omit<ProjectDescription, 'id'>) => {
  return await db
    .insertInto('project_descriptions')
    .values(desc)
    .returningAll()
    .executeTakeFirst();
};

export const updateProjectDescription = async (
  id: number,
  updates: Partial<Omit<ProjectDescription, 'id'>>
) => {
  return await db
    .updateTable('project_descriptions')
    .set(updates)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
};

export const getProjectDescriptionById = async (id: number) => {
  return await db
    .selectFrom('project_descriptions')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
};

export const deleteProjectDescription = async (id: number) => {
  return await db
    .deleteFrom('project_descriptions')
    .where('id', '=', id)
    .execute();
};