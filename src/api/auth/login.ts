import { apiClient } from "../api-client";
import { readResult, type ApiResponse } from "../response";

export interface LoginRequest { email: string; password: string }
interface LoginResult { nickname: string; accessToken: string }
export function login(body: LoginRequest) {
  return readResult(apiClient.post("auth/login", { json: body, retry: 0 }).json<ApiResponse<LoginResult>>());
}
