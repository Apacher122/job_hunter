import * as CandidateService from "../services/candidate_questionnaire.service";

import { Request, Response } from "express";

import { AuthenticatedRequest } from "../../../shared/middleware/authenticate";

export const createOrUpdateCandidateQuestionnaire = async (
  req: Request, // use plain Request
  res: Response
) => {
  const authReq = req as AuthenticatedRequest; // assert type here
  try {
    const result = await CandidateService.createOrUpdateCandidateQuestionnaire(
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
    const questionnaire = await CandidateService.getCandidateQuestionnaireByUid(
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
