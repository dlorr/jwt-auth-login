import { NOT_FOUND } from "../constants/http-status";
import SessionModel from "../models/session.model";
import appAssert from "../utils/app-assert";

export const getUserSessions = async (userId: string, sessionId: string) => {
  const sessions = await SessionModel.find(
    {
      userId: userId,
      expiresAt: { $gt: new Date() },
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    },
    {
      sort: { createdAt: -1 },
    },
  );
  return sessions.map((session) => ({
    ...session.toObject(),
    ...(session.id === sessionId && {
      isCurrent: true,
    }),
  }));
};

export const deleteUserSession = async (sessionId: string, userId: string) => {
  const deletedSession = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId: userId,
  });
  appAssert(deletedSession, NOT_FOUND, "Session not found.");
};
