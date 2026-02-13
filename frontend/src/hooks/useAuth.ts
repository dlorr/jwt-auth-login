import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getUser, type User } from "../api/api";

export const AUTH = "auth" as const;

type UseAuthOptions = Omit<
  UseQueryOptions<User, Error, User, [string]>,
  "queryKey" | "queryFn"
>;

const useAuth = (opts: UseAuthOptions = {}) => {
  const { data: user, ...rest } = useQuery({
    queryKey: [AUTH],
    queryFn: getUser,
    staleTime: Infinity,
    ...opts,
  });

  return {
    user,
    ...rest,
  };
};

export default useAuth;
