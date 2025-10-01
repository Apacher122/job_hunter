import express from "express";
import { routes } from "./routes/auth.js";

const router = express.Router();

router.use("/auth", routes);

export { router as authRoutes };
