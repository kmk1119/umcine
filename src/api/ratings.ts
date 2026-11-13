import { apiClient } from "./api-client";
import { authApi } from "./auth-api";
import { readResult, type ApiResponse } from "./response";

export interface Rating {
  ratingId: number; movieId: number; score: number; comment: string | null;
  createdAt: string; updatedAt: string;
}
export interface RatingInput { score: number; comment: string }
// 로컬 RatingController는 조회에만 공통 응답 없이 배열을 반환한다.
export function getMemberRatings(memberId: number, signal?: AbortSignal) {
  return apiClient.get(`members/${memberId}/ratings`, { signal }).json<Rating[]>();
}
export function createRating(body: RatingInput & { movieId: number }) {
  return readResult(authApi.post("ratings", { json: body }).json<ApiResponse<Rating>>());
}
export function updateRating(ratingId: number, body: RatingInput) {
  return readResult(authApi.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<Rating>>());
}
export function deleteRating(ratingId: number) {
  return readResult(authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>());
}
