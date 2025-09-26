import { CandidateSchemaDTO, CandidateUpdateSchemaDTO } from '../models/user.model';
import { createCandidate, getCandidateById, updateCandidate } from '../../../database';
import { Candidate } from '../../../database/schemas/ordo-meritum.schemas';
import { CandidateRow } from '../types/user.types';
import { updateData } from '../../../shared/utils/formatters/update_object.formatter';

export const createUser = async (
  newCandidate: CandidateSchemaDTO
): Promise<CandidateRow> => {
  const candidateInput: Omit<Candidate, 'id' | 'created_at' | 'update_at'> = {
    first_name: newCandidate.first_name,
    middle_name: newCandidate.middle_name ?? '',
    last_name: newCandidate.last_name,
    email: newCandidate.email,
    phone: newCandidate.phone ?? '',
  };

  try {
    const candidate = await createCandidate(candidateInput);
    if (!candidate) throw new Error('oops');
    return candidate;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

export const getCandidate = async(
  uid: number
): Promise<CandidateSchemaDTO> => {
  const candidate = await getCandidateById(uid);
  if (!candidate) throw new Error(`No candidate found for ID: ${uid}`);
  return candidate;
};


export const updateUserInfo = async(
  uid: number,
  updatedCandidate: CandidateUpdateSchemaDTO
): Promise<CandidateRow> => {
  try {
  const cleanedData = updateData(updatedCandidate)
  const candidate = await updateCandidate(uid, cleanedData);
  if (!candidate) throw new Error('oops');
  return candidate;
  } catch (err) {
    throw new Error(`${err}`)
  }

}