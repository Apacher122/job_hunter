import * as models from '../models/index.js'
import * as service from "../services/index.js";

import { Request, Response } from "express";

import { AuthenticatedRequest } from "@shared/middleware/authenticate.js";
import { CandidateWritingSchema } from '../models/writing_samples.js';

export const createOrUpdateWritingSamples = async (
  req: Request,
  res: Response
) => {
  const authReq = req as AuthenticatedRequest;
  try {
    if (!authReq.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const data = models.CandidateWritingSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ message: "Writing samples could not be parsed"});
      return;
    }

    const result = await service.createOrUpdateCandidateWritingSample(
      authReq.user.uid,
      data.data
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save writing samples" });
  }
};

export const getWritingSamples = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  try {
    if (!authReq.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const result = await service.getCandidateWritingSampleByUid(
      authReq.user.uid
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch writing samples" });
  }
};
