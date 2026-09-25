import { useState } from "react";
import "./movie-page.css";
import "./movie-list-page.css";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  const [movieList, setMovieList] = useState(movies);
  const [currentPage, setCurrentPage] = useState(1);

  function toggleBookmark(movieId: number) {
    setMovieList((previous) =>
      previous.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <>
      <main id="movie-list" className="main-content">
        <div className="page-heading">
          <h1>영화 목록</h1>
          <p>다양한 영화를 만나보고, 좋아하는 영화를 북마크해 보세요.</p>
        </div>
        <MovieGrid movies={movieList} onToggleBookmark={toggleBookmark} />
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
      </main>
      <footer className="site-footer">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" width="100" />
        <p>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
    </>
  );
}
