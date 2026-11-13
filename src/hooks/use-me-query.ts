import { queryOptions, useQuery } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import { useAuthStore } from "../stores/auth-store";

export const meOptions = queryOptions({
  queryKey: ["members", "me"], queryFn: ({ signal }) => getMe(signal),
  staleTime: 5 * 60 * 1000, retry: false,
});
export function useMeQuery() {
  const token = useAuthStore((state) => state.accessToken);
  return useQuery({ ...meOptions, enabled: Boolean(token) });
}
