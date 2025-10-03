import { Request, Response } from "express";

import { AuthenticatedRequest } from "@shared/middleware/authenticate.js";
import { getMatchSummary } from "../services/v2/match_summarizer.service.js";

export const handleLoadMatchSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authReq = req as AuthenticatedRequest;
  const uid = authReq.user.uid;
  const apiKey = (req as any).body.apiKey;
  const jobPostId = Number(req.query.id);
  const getNew = Boolean(req.body.options.getNew);

  if (process.env.NODE_ENV !== "testing" && jobPostId == 0) {
    console.log("Preventing creation of trash");
    return;
  }

  try {
    const matchSummary = await getMatchSummary(uid, jobPostId, getNew, apiKey, req.body.payload);
    res.json({ success: true, matchSummary });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
