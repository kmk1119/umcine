import Link from "next/link";
import type { MovieCardModel } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";
import { MovieImage } from "./movie-image";

interface MovieCardProps {
  movie: MovieCardModel;
}

// Server Component. 상호작용이 필요한 MovieImage·BookmarkButton만 Client Component다.
export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative overflow-hidden rounded-xl bg-[#f3f3f3]">
        <Link href={`/movies/${movie.id}`}>
          <MovieImage
            className="aspect-[0.88] h-auto w-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            width={500}
            height={750}
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
          />
        </Link>
        <BookmarkButton movieId={movie.id} movieTitle={movie.title} iconOnly className="absolute right-3 top-3" />
      </div>
      <div className="pt-2">
        <h2 className="text-sm leading-normal font-bold break-keep sm:text-lg">
          <Link href={`/movies/${movie.id}`}>{movie.title}</Link>
        </h2>
        <time
          className="mt-1 block text-xs leading-normal text-subtle sm:text-base"
          dateTime={movie.releaseDate.replaceAll(".", "-")}
        >
          {movie.releaseDate || "개봉일 정보 없음"}
        </time>
      </div>
    </article>
  );
}
