import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useFavorites } from "../hooks/use-favorites";
import { getMovieDetail } from "../api/movies/get-movie-detail";
import { getRequestError } from "../api/response";
import { MovieImage } from "./movies/movie-image";
import { getTmdbPosterUrl } from "../utils/movies/tmdb-image";
import { BookmarkButton } from "./bookmark-button";

export function ProfileFavorites() {
  const favorites = useFavorites();
  return <section className="mt-8 border-t border-line pt-6">
    <h2 className="mb-4 text-xl font-bold">즐겨찾기 영화</h2>
    {favorites.isPending ? <p role="status">즐겨찾기를 불러오는 중이에요.</p>
      : favorites.isError ? <div role="alert"><p>{getRequestError(favorites.error)}</p><button className="mt-2 underline" onClick={() => void favorites.refetch()}>다시 시도</button></div>
      : !favorites.data.length ? <p>즐겨찾기한 영화가 없어요.</p>
      : <ul className="grid gap-5">{favorites.data.map((item) => <li key={item.movieId}><FavoriteMovie movieId={item.movieId} /></li>)}</ul>}
  </section>;
}
function FavoriteMovie({ movieId }: { movieId: number }) {
  const query = useQuery({ queryKey: ["movies", "detail", movieId], queryFn: () => getMovieDetail(movieId), staleTime: 30 * 1000 });
  return <div className="flex items-center gap-3">
    <Link className="flex min-w-0 flex-1 items-center gap-3 font-bold" to="/movies/$movieId" params={{ movieId: String(movieId) }}>
      <MovieImage src={getTmdbPosterUrl(query.data?.poster_path ?? null)} alt="" className="h-20 w-14 rounded object-cover" />
      <span>{query.data?.title ?? (query.isLoading ? "영화 정보 조회 중" : `영화 #${movieId}`)}</span>
    </Link>
    <BookmarkButton movieId={movieId} movieTitle={query.data?.title ?? `영화 ${movieId}`} iconOnly />
  </div>;
}
