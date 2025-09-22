import { Candidate } from "../../../database/schemas/ordo-meritum.schemas";

export type CandidateRow = Omit<Candidate, 'id' | 'created_at' | 'update_at'> & {
  id: number;
  created_at: Date;
  update_at: Date;
};
