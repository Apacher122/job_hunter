import * as service from "../services/candidate_writings.service";

import { Request, Response } from "express";

import { AuthenticatedRequest } from "../../../shared/middleware/authenticate";

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

    const result = await service.createOrUpdateCandidateWritingSample(
      authReq.user.uid,
      req.body
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
