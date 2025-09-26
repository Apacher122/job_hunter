import * as admin from "firebase-admin";

import { NextFunction, Request, Response } from "express";

export interface AuthenticatedRequest extends Request {
  user: { uid: string };
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ message: "Missing or invalid token" });
      return; // stop execution
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Attach user
    (req as AuthenticatedRequest).user = { uid: decodedToken.uid };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized" });
    return; // stop execution
  }
};
