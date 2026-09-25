import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import "./movie-detail-page.css";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return <main className="movie-detail-missing">영화를 찾을 수 없어요.</main>;
  }

  return (
    <main className="movie-detail">
      <img className="movie-detail-backdrop" src={movie.backdropPath} alt="" aria-hidden="true" />
      <div className="movie-detail-content">
      <Link className="movie-detail-back" to="/">← 영화 목록</Link>
      <div className="movie-detail-layout">
      <img className="movie-detail-poster" src={movie.posterPath} alt={`${movie.title} 포스터`} />
      <div className="movie-detail-info">
      <h1>{movie.title}</h1>
      <p>{movie.originalTitle}</p>
      <p>{movie.releaseDate}</p>
      <p>{movie.genres.join(" · ")}</p>
      <p>{movie.runtime}</p>
      <h2>{movie.tagline}</h2>
      <p>{movie.overview}</p>
      </div>
      </div>
      </div>
    </main>
  );
}
