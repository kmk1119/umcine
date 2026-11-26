import ky from "ky";

export interface MovieSummary { id: number; title: string; posterPath: string | null }

// 브라우저에서는 TMDB 토큰 없이 같은 출처의 Route Handler(/api/movies/{id})를 호출한다.
export function getMovieSummary(movieId: number, signal?: AbortSignal) {
  return ky.get(`/api/movies/${movieId}`, { signal, retry: 0 }).json<MovieSummary>();
}
