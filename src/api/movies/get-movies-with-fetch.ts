import { getTmdbEnv } from "../../config/env";
import type { TmdbMovieListResponse } from "./models";
export type GetMoviesWithFetchResponse = TmdbMovieListResponse;

export async function getMoviesWithFetch(page = 1): Promise<GetMoviesWithFetchResponse> {
  const { baseUrl, accessToken } = getTmdbEnv();
  const url = new URL("movie/popular", baseUrl);
  url.search = new URLSearchParams({ language: "ko-KR", page: String(page) }).toString();
  const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!response.ok) throw new Error(`영화 목록 요청에 실패했어요: ${response.status}`);
  return response.json();
}
