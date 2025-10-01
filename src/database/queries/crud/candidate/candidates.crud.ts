import { User } from '../../../schemas/ordo-meritum.schemas.js';
import { db } from '../../../index.js';

type UserUpdate = Partial<Omit<User, 'firebase_uid' | 'created_at' | 'updated_at'>>;

export const createUser = async (user: { firebase_uid: string }) => {
  return await db
    .insertInto('users')
    .values(user)
    .returningAll()
    .executeTakeFirst();
};

export const getUserById = async (firebase_uid: string) => {
  return await db.selectFrom('users').selectAll().where('firebase_uid', '=', firebase_uid).executeTakeFirst();
};

export const updateUser = async (firebase_uid: string, updates: UserUpdate) => {
  return await db
    .updateTable('users')
    .set(updates)
    .where('firebase_uid', '=', firebase_uid)
    .returningAll()
    .executeTakeFirst();
};

export const deleteUser = async (firebase_uid: string) => {
  return await db.deleteFrom('users').where('firebase_uid', '=', firebase_uid).execute();
};