import { getSessionsApi, deleteSessionApi } from "@/api/session";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const SESSIONS_QUERY_KEY = ["sessions"] as const;

export const useSessions = () => {
  return useQuery({
    queryKey: SESSIONS_QUERY_KEY,
    queryFn: getSessionsApi,
    refetchInterval: 60_000,
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => deleteSessionApi(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
    },
  });
};
