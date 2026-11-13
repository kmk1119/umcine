import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../api/members/me";
import { useAuthStore } from "../stores/auth-store";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.accessToken);
  return useMutation({
    mutationFn: updateMe,
    onSuccess: async (member) => {
      if (useAuthStore.getState().accessToken !== token) return;
      await queryClient.cancelQueries({ queryKey: ["members", "me"] });
      if (useAuthStore.getState().accessToken !== token) return;
      queryClient.setQueryData(["members", "me"], member);
    },
  });
}
