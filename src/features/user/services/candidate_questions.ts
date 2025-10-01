import * as db from "@database/index.js";

import { CandidateQuestionnaire } from "@database/schemas/ordo-meritum.schemas.js";

export const createOrUpdateCandidateQuestionnaire = async (
  firebaseUid: string,
  questionnaireData: Omit<CandidateQuestionnaire, 'id' | 'created_at' | 'updated_at'>
) => {
  const data = { ...questionnaireData, firebaseUid };
  return await db.createOrUpdateCandidateQuestionnaire(data);
};

export const getCandidateQuestionnaireByUid = async (firebaseUid: string) => {
  return db.getCandidateQuestionnaireById(firebaseUid);
};
