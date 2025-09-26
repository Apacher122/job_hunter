import { CandidateQuestionnaire } from "../../../schemas/ordo-meritum.schemas";
import { db } from "../../..";

export const createCandidateQuestionnaire = async (
  questionnaire: Omit<CandidateQuestionnaire, 'id' | 'createdAt' | 'updatedAt'>
) => {
  return await db
    .insertInto('candidate_questionnaires')
    .values(questionnaire)
    .returningAll()
    .executeTakeFirst();
};

export const updateCandidateQuestionnaire = async (
  id: number,
  updates: Partial<Omit<CandidateQuestionnaire, 'id' | 'createdAt' | 'updatedAt'>>
) => {
  return await db
    .updateTable('candidate_questionnaires')
    .set(updates)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
};

export const getCandidateQuestionnaireById = async (id: number) => {
  return await db
    .selectFrom('candidate_questionnaires')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
};

export const deleteCandidateQuestionnaire = async (id: number) => {
  return await db
    .deleteFrom('candidate_questionnaires')
    .where('id', '=', id)
    .execute();
};