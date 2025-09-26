import { User } from '../../../schemas/ordo-meritum.schemas';
import { db } from '../../../index';

type UserUpdate = Partial<Omit<User, 'firebaseUid' | 'createdAt' | 'updatedAt'>>;

export const createUser = async (user: { firebaseUid: string }) => {
  return await db
    .insertInto('users')
    .values(user)
    .returningAll()
    .executeTakeFirst();
};

export const getUserById = async (firebaseUid: string) => {
  return await db.selectFrom('users').selectAll().where('firebaseUid', '=', firebaseUid).executeTakeFirst();
};

export const updateUser = async (firebaseUid: string, updates: UserUpdate) => {
  return await db
    .updateTable('users')
    .set(updates)
    .where('firebaseUid', '=', firebaseUid)
    .returningAll()
    .executeTakeFirst();
};

export const deleteUser = async (firebaseUid: string) => {
  return await db.deleteFrom('users').where('firebaseUid', '=', firebaseUid).execute();
};