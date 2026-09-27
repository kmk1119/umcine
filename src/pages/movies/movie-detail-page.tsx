import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return <main className="mx-auto max-w-[1920px] px-5 py-16 sm:px-10 lg:px-16">영화를 찾을 수 없어요.</main>;
  }

  return (
    <main className="min-h-[calc(100vh-112px)]">
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <img src={movie.backdropPath} alt="" aria-hidden="true" className="absolute inset-0 -z-20 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/65 via-black/25 to-transparent" />
        <div className="mx-auto flex min-h-[380px] max-w-[1920px] flex-col justify-between gap-24 px-5 py-7 sm:min-h-[440px] sm:px-10 lg:px-16">
          <Link to="/" className="inline-flex w-fit items-center gap-2 font-bold"><span aria-hidden="true" className="text-3xl font-normal">‹</span> 영화 목록</Link>
          <div>
            <h1 className="text-3xl leading-tight font-bold tracking-tight break-keep sm:text-5xl">{movie.title}</h1>
            <p className="mt-3 text-base text-white/90 sm:text-lg">{movie.originalTitle}</p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm font-bold sm:text-base">
              <time dateTime={movie.releaseDate.replaceAll(".", "-")}>{movie.releaseDate}</time><span>{movie.genres.join(" · ")}</span><span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-[1920px] gap-7 px-5 py-8 sm:grid-cols-[200px_minmax(0,1fr)] sm:px-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 lg:px-16">
        <img src={movie.posterPath} alt={movie.title + " 포스터"} className="w-40 rounded-xl object-cover shadow-xl sm:w-full" />
        <section>
          <h2 className="text-2xl font-bold break-keep">{movie.tagline}</h2>
          <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted">{movie.overview}</p>

        </section>
      </div>
    </main>
  );
}
