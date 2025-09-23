import { db } from '../../../index';
import { Project, ProjectDescription } from '../../../schemas/ordo-meritum.schemas';

export const getProjectById = (id: number) =>
  db.selectFrom('projects').selectAll().where('id', '=', id).executeTakeFirst();

export const getProjectsByResumeId = (resume_id: number) =>
  db.selectFrom('projects').selectAll().where('resume_id', '=', resume_id).execute();

export const createProject = (proj: Omit<Project, 'id' | 'created_at' | 'updated_at'>) =>
  db.insertInto('projects').values(proj).returningAll().executeTakeFirst();

export const updateProject = (id: number, proj: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>) =>
  db.updateTable('projects').set(proj).where('id', '=', id).returningAll().executeTakeFirst();

export const deleteProject = (id: number) =>
  db.deleteFrom('projects').where('id', '=', id).execute();

// Project Descriptions
export const getProjectDescriptionsByProjectId = (project_id: number) =>
  db.selectFrom('project_descriptions').selectAll().where('project_id', '=', project_id).execute();

export const createProjectDescription = (desc: Omit<ProjectDescription, 'id'>) =>
  db.insertInto('project_descriptions').values(desc).returningAll().executeTakeFirst();

export const updateProjectDescription = (id: number, desc: Partial<Omit<ProjectDescription, 'id'>>) =>
  db.updateTable('project_descriptions').set(desc).where('id', '=', id).returningAll().executeTakeFirst();

export const deleteProjectDescription = (id: number) =>
  db.deleteFrom('project_descriptions').where('id', '=', id).execute();
