import "./movie-card.css";
import { Link } from '@tanstack/react-router'
import type { Movie } from '../../types/movie'

interface MovieCardProps {
  movie: Movie
  onToggleBookmark: (movieId: number) => void
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-container">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img className="movie-poster" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        </Link>
        <button
          type="button"
          className="bookmark-button"
          aria-label={`${movie.title} 북마크`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={`/icons/movie-icons/${movie.isBookmarked ? 'bookmark' : 'bookmark-outline'}.svg`}
            alt="" width="24" height="24"
          />
        </button>
      </div>
      <div className="movie-info">
        <h2><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link></h2>
        <time dateTime={movie.releaseDate.replaceAll('.', '-')}>{movie.releaseDate}</time>
      </div>
    </article>
  )
}
