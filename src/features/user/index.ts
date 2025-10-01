import express from "express";
import { routes } from "./routes/user.js";

export const userRoutes = (privateKey?: string) => {
  const router = express.Router();
  router.use("/user", routes(privateKey));
  return router;
};
