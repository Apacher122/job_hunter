import { db } from "../../index.js";

export const getResumeId = async (firebase_uid: string, role_id: number) => {
  const result =  await db.selectFrom('resumes')
    .select('id')
    .where('firebase_uid', '=', firebase_uid)
    .where('role_id', '=', role_id)
    .executeTakeFirst()

  return result?.id ?? null;
}