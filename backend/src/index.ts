import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { OK } from "./constants/http-status";
import { APP_ORIGIN, PORT } from "./constants/env";
import connectToDb from "./config/db.config";
import authRouter from "./routes/auth.route";
import errorHandler from "./middleware/error-handler";
import authenticate from "./middleware/authenticate";
import userRouter from "./routes/user.route";
import sessionRouter from "./routes/session.route";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  }),
);

app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(OK).json({
    status: "Success",
    message: "Connected Successfully",
  });
});

app.use("/auth", authRouter);
//protected routes
app.use("/user", authenticate, userRouter);
app.use("/session", authenticate, sessionRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}/`);
  await connectToDb();
});
