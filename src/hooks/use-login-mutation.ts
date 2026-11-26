import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      useAuthStore.getState().setAccessToken(response.accessToken);
      void queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      router.push("/");
    },
  });
}
