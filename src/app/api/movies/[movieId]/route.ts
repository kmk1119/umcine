import { getMovieDetail } from "../../../../api/movies/get-movie-detail";
import { getTmdbPosterUrl } from "../../../../utils/movies/tmdb-image";
import { parseMovieId } from "../../../../utils/movies/movie-id";

// 마이페이지 즐겨찾기(Client Component)가 TMDB 토큰 없이 영화 제목·포스터를 받도록 서버에서 대신 조회한다.
export async function GET(_request: Request, { params }: { params: Promise<{ movieId: string }> }) {
  const id = parseMovieId((await params).movieId);
  const movie = id ? await getMovieDetail(id) : null;
  if (!movie) return Response.json({ message: "영화를 찾을 수 없어요." }, { status: 404 });
  return Response.json({ id: movie.id, title: movie.title, posterPath: getTmdbPosterUrl(movie.poster_path) });
}
