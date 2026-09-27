import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative overflow-hidden rounded-xl bg-[#f3f3f3]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            className="aspect-[0.88] w-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>
        <button
          type="button"
          className={cn(
            "absolute right-3 top-3 rounded-xl border p-2 text-white",
            movie.isBookmarked ? "border-primary bg-primary" : "border-white bg-ink",
          )}
          aria-label={`${movie.title} 북마크`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={`/icons/movie-icons/${movie.isBookmarked ? "bookmark" : "bookmark-outline"}.svg`}
            alt=""
            width="24"
            height="24"
            className="invert"
          />
        </button>
      </div>
      <div className="pt-2">
        <h2 className="text-sm leading-normal font-bold break-keep sm:text-lg">
          <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
            {movie.title}
          </Link>
        </h2>
        <time
          className="mt-1 block text-xs leading-normal text-subtle sm:text-base"
          dateTime={movie.releaseDate.replaceAll(".", "-")}
        >
          {movie.releaseDate}
        </time>
      </div>
    </article>
  );
}
