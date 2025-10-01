import { authenticate } from "@shared/middleware/authenticate.js";
import express from "express";
import { loginController } from "../controllers/auth.js";

export const routes = () => {
  const router = express.Router();

  router.post("/login", authenticate, loginController);

  return router;
};
