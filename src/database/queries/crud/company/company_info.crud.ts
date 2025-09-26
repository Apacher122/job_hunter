import { Company } from '../../../schemas/ordo-meritum.schemas';
import { db } from '../../..';

export const createCompany = async (company: Omit<Company, 'id'>) => {
  return await db
    .insertInto('companies')
    .values(company)
    .returningAll()
    .executeTakeFirst();
};

export const updateCompany = async (id: number, updates: Partial<Omit<Company, 'id'>>) => {
  return await db
    .updateTable('companies')
    .set(updates)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
};

export const getCompanyById = async (id: number) => {
  return await db
    .selectFrom('companies')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
};

export const deleteCompany = async (id: number) => {
  return await db
    .deleteFrom('companies')
    .where('id', '=', id)
    .execute();
};