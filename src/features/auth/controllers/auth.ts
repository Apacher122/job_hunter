import { Request, Response } from "express";

import { AuthSchema } from "../models/auth.js";
import { AuthenticatedRequest } from "@shared/middleware/authenticate.js";
import { loginOrRegister } from "../services/auth.js";
import { z } from "zod";

export const loginController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const authReq = req as AuthenticatedRequest;

    const user = await loginOrRegister({firebase_uid: authReq.user.uid });
    res.status(200).json(user);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
