import { Role } from '../../../schemas/ordo-meritum.schemas';
import { db } from '../../..';

export const createRole = async (role: Omit<Role, 'id' | 'created_at' | 'updated_at'>) => {
  return await db
    .insertInto('roles')
    .values(role)
    .returningAll()
    .executeTakeFirst();
};

export const updateRole = async (id: number, updates: Partial<Omit<Role, 'id' | 'created_at' | 'updated_at'>>) => {
  return await db
    .updateTable('roles')
    .set(updates)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
};

export const getRoleById = async (id: number) => {
  return await db
    .selectFrom('roles')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
};

export const deleteRole = async (id: number) => {
  return await db
    .deleteFrom('roles')
    .where('id', '=', id)
    .execute();
};

