import { CandidateWritingSample } from "../../../schemas/ordo-meritum.schemas";
import { db } from "../../..";

export const createOrUpdateCandidateWritingSample = async (
  writingSample: Omit<CandidateWritingSample, 'id' | 'createdAt' | 'updatedAt'>
) => {
  return await db
    .insertInto('candidate_writing_samples')
    .values(writingSample)
    .onConflict((ocb) =>
      ocb
        .column('firebaseUid')
        .doUpdateSet({
          content: writingSample.content,
          updatedAt: new Date(),
        })
    )
    .returningAll()
    .executeTakeFirst();
};

export const getCandidateWritingSampleByUid = async (
  firebaseUid: string
): Promise<CandidateWritingSample | undefined> => {
  const sample = await db
    .selectFrom("candidate_writing_samples")
    .selectAll()
    .where("firebaseUid", "=", firebaseUid)
    .executeTakeFirst();

  return sample as CandidateWritingSample | undefined;
};

export const deleteCandidateWritingSample = async (
  firebaseUid: string
): Promise<any> => {
  return await db
    .deleteFrom('candidate_writing_samples')
    .where('firebaseUid', '=', firebaseUid)
    .executeTakeFirst();
};