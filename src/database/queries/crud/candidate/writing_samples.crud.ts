import { CandidateWritingSample } from "../../../schemas/ordo-meritum.schemas";
import { db } from "../../..";

export const createOrUpdateCandidateWritingSample = async (
  writingSample: Omit<CandidateWritingSample, 'id' | 'created_at' | 'updated_at'>
) => {
  return await db
    .insertInto('candidate_writing_samples')
    .values(writingSample)
    .onConflict((ocb) =>
      ocb
        .column('firebase_uid')
        .doUpdateSet({
          content: writingSample.content,
          updated_at: new Date(),
        })
    )
    .returningAll()
    .executeTakeFirst();
};

export const getCandidateWritingSampleByUid = async (
  firebase_uid: string
): Promise<CandidateWritingSample | undefined> => {
  const sample = await db
    .selectFrom("candidate_writing_samples")
    .selectAll()
    .where("firebase_uid", "=", firebase_uid)
    .executeTakeFirst();

  return sample as CandidateWritingSample | undefined;
};

export const deleteCandidateWritingSample = async (
  firebase_uid: string
): Promise<any> => {
  return await db
    .deleteFrom('candidate_writing_samples')
    .where('firebase_uid', '=', firebase_uid)
    .executeTakeFirst();
};