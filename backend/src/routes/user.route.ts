import { Router } from "express";
import {
  getUser,
  resendVerificationEmail,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/", getUser);
userRouter.post("/resend-verification", resendVerificationEmail);

export default userRouter;
