import express from "express";
import { routes } from "./routes/documents.js";

export const documentRoutes = (privateKey: string) => {
  const router = express.Router();
  router.use("/documents", routes(privateKey));
  return router;
};
