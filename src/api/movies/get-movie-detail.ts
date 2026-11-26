import "server-only";
import { isHTTPError } from "ky";
import { cacheLife } from "next/cache";
import { getTmdbClient } from "../tmdb-client";
import type { TmdbMovieDetail } from "./models";

export type GetMovieDetailResponse = TmdbMovieDetail;

// 없는 영화는 null을 반환하고, 그 밖의 오류는 error.tsx가 처리하도록 던진다.
export async function getMovieDetail(movieId: number): Promise<GetMovieDetailResponse | null> {
  "use cache";
  cacheLife("hours");
  try {
    return await getTmdbClient().get(`movie/${movieId}`, {
      searchParams: { language: "ko-KR" },
    }).json<GetMovieDetailResponse>();
  } catch (error) {
    if (isHTTPError(error) && error.response.status === 404) return null;
    throw error;
  }
}
