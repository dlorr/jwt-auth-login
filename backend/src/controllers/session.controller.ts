import { OK } from "../constants/http-status";
import { sessionSchema } from "../schemas/auth.schema";
import {
  deleteUserSession,
  getUserSessions,
} from "../services/session.service";
import asyncHandler from "../utils/async-handler";

export const getSessions = asyncHandler(async (req, res) => {
  const sessions = await getUserSessions(req.userId, req.sessionId);

  return res.status(OK).json(sessions);
});

export const deleteSession = asyncHandler(async (req, res) => {
  const sessionId = sessionSchema.parse(req.params.id);

  await deleteUserSession(sessionId, req.userId);

  return res.status(OK).json({
    message: "Session removed.",
  });
});
