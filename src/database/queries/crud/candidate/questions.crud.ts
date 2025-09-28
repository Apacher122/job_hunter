import { CandidateQuestionnaire } from "../../../schemas/ordo-meritum.schemas";
import { db } from "../../..";
import { firebase } from 'googleapis/build/src/apis/firebase';

export const createOrUpdateCandidateQuestionnaire = async (
  questionnaire: Omit<CandidateQuestionnaire, 'id' | 'created_at' | 'updated_at'>
) => {
  return await db
    .insertInto('candidate_questionnaires')
    .values(questionnaire)
    .onConflict((ocb) =>
      ocb
        .column('firebase_uid')
        .doUpdateSet({
          questions: questionnaire.questions,
          brief_history: questionnaire.brief_history,
          updated_at: new Date(),
        })
    )
    .returningAll()
    .executeTakeFirst();
};

export const getCandidateQuestionnaireById = async (firebase_uid: string) => {
  const sample = await db
    .selectFrom('candidate_questionnaires')
    .selectAll()
    .where("firebase_uid", "=", firebase_uid)
    .executeTakeFirst();

  return sample as CandidateQuestionnaire | undefined;
};

export const deleteCandidateQuestionnaire = async (firebase_uid: string) => {
  return await db
    .deleteFrom('candidate_questionnaires')
    .where('firebase_uid', '=', firebase_uid)
    .executeTakeFirst();
};