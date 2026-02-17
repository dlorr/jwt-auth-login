import api from "./apiClient";
import type { Session } from "@/types";

// ── Sessions ─────────────────────────────────────────────

export const getSessionsApi = async (): Promise<Session[]> => {
  const res = await api.get<Session[]>("/session/all");
  return res.data;
};

export const deleteSessionApi = async (
  sessionId: string,
): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(`/session/${sessionId}`);
  return res.data;
};
