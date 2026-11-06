import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { RequestError } from "../../components/movies/request-error";
import { toMovieCard } from "../../utils/movies/to-movie-card";

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });
  const data = moviesQuery.data;

  return <main className="mx-auto max-w-[1920px] px-5 py-8 sm:px-10 lg:px-16">
    <h1 className="mb-7 text-3xl font-bold tracking-tight sm:text-5xl">영화 목록</h1>
    {moviesQuery.isPending ? <p role="status" className="py-16 text-center">영화 목록을 불러오는 중이에요.</p>
      : moviesQuery.isError ? <RequestError message="영화 목록을 불러오지 못했어요." onRetry={() => { void moviesQuery.refetch(); }} />
      : !data?.results.length ? <p className="py-16 text-center">조건에 맞는 영화가 없어요.</p>
      : <MovieGrid movies={data.results.map(toMovieCard)} />}
    {moviesQuery.isSuccess && data && <Pagination currentPage={page} totalPages={Math.min(500, data.total_pages)}
      onPageChange={(nextPage) => { void navigate({ search: { page: nextPage } }); }} />}
  </main>;
}
