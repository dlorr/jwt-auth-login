import { Router } from "express";
import { deleteSession, getSessions } from "../controllers/session.controller";

const sessionRouter = Router();

sessionRouter.get("/all", getSessions);
sessionRouter.delete("/:id", deleteSession);

export default sessionRouter;
