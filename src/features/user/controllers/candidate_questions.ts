import * as service from "../services/index.js";

import { Request, Response } from "express";

import { AuthenticatedRequest } from "@shared/middleware/authenticate.js";

export const createOrUpdateCandidateQuestionnaire = async (
  req: Request, 
  res: Response
) => {
  const authReq = req as AuthenticatedRequest; 
  try {
    const result = await service.createOrUpdateCandidateQuestionnaire(
      authReq.user.uid,
      req.body
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save candidate questionnaire" });
  }
};

export const getCandidateQuestionnaire = async (
  req: Request,
  res: Response
) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const questionnaire = await service.getCandidateQuestionnaireByUid(
      authReq.user.uid
    );
    if (!questionnaire){
      res.status(404).json({ message: "Questionnaire not found" });
      return;
    }
    res.json(questionnaire);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch candidate questionnaire" });
  }
};
