import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  refresh,
  register,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/refresh", refresh);
authRouter.get("/email/verify/:code", verifyEmail);
authRouter.post("/password/forgot", forgotPassword);
authRouter.post("/password/reset", resetPassword);

export default authRouter;
