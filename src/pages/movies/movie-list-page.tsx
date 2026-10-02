import MovieGrid from "../../components/movies/movie-grid";
import { movies } from "../../data/movies";

export function MovieListPage() {
  return (
    <>
      <main className="mx-auto max-w-[1920px] px-5 py-8 sm:px-10 lg:px-16">
        <h1 className="mb-7 text-3xl font-bold tracking-tight sm:text-5xl">영화 목록</h1>
        <MovieGrid movies={movies} />
      </main>
      <footer className="flex flex-col items-center gap-4 border-t border-line px-5 py-8">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" width="100" />
        <p className="text-center text-xs leading-relaxed text-muted">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </>
  );
}
