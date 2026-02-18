import { Router } from "express";
import { deleteSession, getSessions } from "../controllers/session.controller";

const sessionRouter = Router();

sessionRouter.get("/sessions", getSessions);
sessionRouter.delete("/:id", deleteSession);

export default sessionRouter;
