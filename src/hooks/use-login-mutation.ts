import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      useAuthStore.getState().setAccessToken(response.accessToken);
      void queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      void navigate({ to: "/" });
    },
  });
}
