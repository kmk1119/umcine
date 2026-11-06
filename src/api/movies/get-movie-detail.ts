import { getTmdbClient } from "../tmdb-client";
import type { TmdbMovieDetail } from "./models";
export type GetMovieDetailResponse = TmdbMovieDetail;
export async function getMovieDetail(movieId: number) {
  return getTmdbClient().get(`movie/${movieId}`, {
    searchParams: { language: "ko-KR" },
  }).json<GetMovieDetailResponse>();
}
