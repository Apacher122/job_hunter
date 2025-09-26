import * as db from "../../../database";

import { CandidateQuestionnaire } from "../../../database/schemas/ordo-meritum.schemas";

export const createOrUpdateCandidateQuestionnaire = async (
  firebaseUid: string,
  questionnaireData: Omit<CandidateQuestionnaire, 'id' | 'createdAt' | 'updatedAt'>
) => {
  // Include firebaseUid in the insert/update
  const data = { ...questionnaireData, firebaseUid };
  return await db.createOrUpdateCandidateQuestionnaire(data);
};

export const getCandidateQuestionnaireByUid = async (firebaseUid: string) => {
  return db.getCandidateQuestionnaireById(firebaseUid);
};
