import * as db from "../../../database";

import { CandidateWritingSample } from "../../../database/schemas/ordo-meritum.schemas";

export const createOrUpdateCandidateWritingSample = async (
  firebaseUid: string, 
  writingSamples: Omit<CandidateWritingSample, 'id' | 'createdAt' | 'updatedAt'>) => {
    const data = { ...writingSamples, firebaseUid };
  return db.createOrUpdateCandidateWritingSample(data);
};

export const getCandidateWritingSampleByUid = async (firebaseUid: string) => {
  return db.getCandidateWritingSampleByUid(firebaseUid);
};