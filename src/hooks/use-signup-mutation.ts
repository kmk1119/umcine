import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signup } from "../api/members/signup";
import { getRequestError } from "../api/response";

export function useSignupMutation() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (body: Parameters<typeof signup>[0]) => {
      const response = await signup(body);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
    onSuccess: (response) => { alert(response.message); router.push("/login"); },
    onError: (error) => alert(getRequestError(error)),
  });
}
