import { getTmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";
export interface SearchMoviesRequest { query: string; page?: number }
export type SearchMoviesResponse = TmdbMovieListResponse;
export async function searchMovies({ query, page = 1 }: SearchMoviesRequest) {
  return getTmdbClient().get("search/movie", {
    searchParams: { language: "ko-KR", query, page, include_adult: false },
  }).json<SearchMoviesResponse>();
}
