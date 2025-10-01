import { Company } from '../../../schemas/ordo-meritum.schemas.js';
import { db } from '../../../index.js';

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

export const upsertCompany = async (company: Omit<Company, 'id'>) => {
  return await db
    .insertInto('companies')
    .values(company)
    .onConflict((oc) =>
      oc.column('company_name').doUpdateSet((eb) => ({
        description: eb.ref('excluded.description'),
        website: eb.ref('excluded.website'),
        industry: eb.ref('excluded.industry'),
        size: eb.ref('excluded.size'),
        location: eb.ref('excluded.location'),
        company_culture: eb.ref('excluded.company_culture'),
        company_values: eb.ref('excluded.company_values'),
        benefits: eb.ref('excluded.benefits'),
      }))
    )
    .returningAll()
    .executeTakeFirst();
};