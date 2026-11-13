import { authApi } from "../auth-api";
import { readResult, type ApiResponse } from "../response";

export interface MemberInfo { email: string; nickname: string; createdAt: string }
export function getMe(signal?: AbortSignal) {
  return readResult(authApi.get("members/me", { signal }).json<ApiResponse<MemberInfo>>());
}
export function updateMe(body: { nickname: string }) {
  return readResult(authApi.patch("members/me", { json: body }).json<ApiResponse<MemberInfo>>());
}
