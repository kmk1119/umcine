import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signup } from "../api/members/signup";
import { getRequestError } from "../api/response";

export function useSignupMutation() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (body: Parameters<typeof signup>[0]) => {
      const response = await signup(body);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => { alert(response.message); void navigate({ to: "/login" }); },
    onError: (error) => alert(getRequestError(error)),
  });
}
