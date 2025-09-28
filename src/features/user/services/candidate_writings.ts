import * as db from "../../../database";
import * as models from '../models';
import { CandidateWritingSample } from "../../../database/schemas/ordo-meritum.schemas";

export const createOrUpdateCandidateWritingSample = async (
  firebaseUid: string, 
  writingSamples: models.CandidateWritingDTO) => {
  const parsed = models.CandidateWritingSchema.parse(writingSamples);

  return parsed.writing_samples.map(sample => ({
    firebase_uid: firebaseUid,
    content: sample.content,
  }));
};

export const getCandidateWritingSampleByUid = async (firebaseUid: string) => {
  return db.getCandidateWritingSampleByUid(firebaseUid);
};