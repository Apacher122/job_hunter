import { Request, Response } from 'express';
import {
  CandidateSchema,
  CandidateSchemaDTO,
  CandidateUpdateSchema,
  CandidateUpdateSchemaDTO,
} from '../models/user.model';
import { createUser, updateUserInfo } from '../services/user.service';
import bodyParser from 'body-parser';

export const newUser = async (
  req: Request<{}, {}, CandidateSchemaDTO>,
  res: Response
): Promise<void> => {
  try {
    const result = CandidateSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error?.errors });
      return;
    }

    await createUser(req.body);
    res.status(200).json({ success: true, message: 'Job marked as applied' });
  } catch (err) {
    res.status(500).json({ error: err });
    throw new Error(`${err}`);
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = Number(req.params.id);
    if (!result)
      res
        .status(400)
        .json({ error: `Could not fetch candidate for UID: ${req.params.id}` });
    res.status(200).json({ success: true, body: result });
  } catch (err) {
    res.status(500).json({ error: err });
    throw new Error(`Error Getting Candidate (UID: ${req.params.id}): ${err}`);
  }
};

export const updateUser = async (
  req: Request<{ id: string }, {}, CandidateUpdateSchemaDTO>,
  res: Response
): Promise<void> => {
    const result = CandidateUpdateSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: result.error?.errors});
        return;
    }

    const id = Number(req.params.id);

    await updateUserInfo(id, result.data);
};
