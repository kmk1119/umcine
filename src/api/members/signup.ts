import { apiClient } from "../api-client";

interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

interface SignupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: { memberId: number; email: string; nickname: string };
}

export function signup(body: SignupRequest) {
  return apiClient.post("members", { json: body }).json<SignupResponse>();
}
