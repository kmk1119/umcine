import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
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
        <BookmarkButton movieId={movie.id} movieTitle={movie.title} iconOnly className="absolute right-3 top-3" />
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
