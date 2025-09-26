import { CandidateQuestionnaire } from "../../../schemas/ordo-meritum.schemas";
import { db } from "../../..";
import { firebase } from 'googleapis/build/src/apis/firebase';

export const createOrUpdateCandidateQuestionnaire = async (
  questionnaire: Omit<CandidateQuestionnaire, 'id' | 'createdAt' | 'updatedAt'>
) => {
  return await db
    .insertInto('candidate_questionnaires')
    .values(questionnaire)
    .onConflict((ocb) =>
      ocb
        .column('firebaseUid')
        .doUpdateSet({
          questions: questionnaire.questions,
          briefHistory: questionnaire.briefHistory,
          updatedAt: new Date(),
        })
    )
    .returningAll()
    .executeTakeFirst();
};

export const getCandidateQuestionnaireById = async (firebaseUid: string) => {
  const sample = await db
    .selectFrom('candidate_questionnaires')
    .selectAll()
    .where("firebaseUid", "=", firebaseUid)
    .executeTakeFirst();

  return sample as CandidateQuestionnaire | undefined;
};

export const deleteCandidateQuestionnaire = async (firebaseUid: string) => {
  return await db
    .deleteFrom('candidate_questionnaires')
    .where('firebaseUid', '=', firebaseUid)
    .executeTakeFirst();
};