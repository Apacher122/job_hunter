import * as routes from '@features/routes.js';
import * as sec from '../security/index.js';

import { authenticate } from "@shared/middleware/authenticate.js";
import bodyParser from "body-parser";
import { customResponseMiddleware } from "@shared/middleware/customResponse.js";
import express from "express";

export const app = (privateKey: string) => {
  const app = express();
  app.use(bodyParser.json());
  app.use(customResponseMiddleware);

  app.get("/", (req, res) => {
    res
      .status(200)
      .json({ success: true, message: "Welcome to the Resume Compiler API" });
  });

  app.use("/public-key-stream", sec.publicKeyStreamRouter);
  app.get("/public-key", authenticate, sec.getPublicKey);

  app.use(routes.userRoutes(privateKey));
  app.use(routes.authRoutes);
  app.use(routes.applicationTrackerRoutes(privateKey));
  app.use(routes.documentRoutes(privateKey));

  return app;
};
