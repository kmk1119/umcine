import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getMovieDetail } from "../../../api/movies/get-movie-detail";
import { BookmarkButton } from "../../../components/bookmark-button";
import { MovieRating } from "../../../components/movie-rating";
import { MovieImage } from "../../../components/movies/movie-image";
import { parseMovieId } from "../../../utils/movies/movie-id";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../../utils/movies/tmdb-image";

type Params = Promise<{ movieId: string }>;

// 영화마다 다른 제목·설명·공유 이미지를 설정한다. getMovieDetail은 "use cache"라 페이지와 같은 요청을 다시 보내지 않는다.
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const id = parseMovieId((await params).movieId);
  const movie = id ? await getMovieDetail(id) : null;
  if (!movie) return { title: "영화를 찾을 수 없어요" };
  const description = movie.overview || `${movie.title}의 영화 정보`;
  const poster = getTmdbPosterUrl(movie.poster_path);
  return {
    title: movie.title,
    description,
    openGraph: { title: movie.title, description, images: poster ? [poster] : [] },
  };
}

export default function MovieDetailPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<main role="status" className="px-5 py-16 text-center">영화 정보를 불러오는 중이에요.</main>}>
      <MovieDetail params={params} />
    </Suspense>
  );
}

async function MovieDetail({ params }: { params: Params }) {
  const id = parseMovieId((await params).movieId);
  if (!id) notFound();
  const movie = await getMovieDetail(id);
  if (!movie) notFound();

  return (
    <main className="min-h-[calc(100vh-112px)]">
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <MovieImage src={getTmdbBackdropUrl(movie.backdrop_path)} alt="" width={1280} height={720} sizes="100vw" priority className="absolute inset-0 -z-20 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/65 via-black/25 to-transparent" />
        <div className="mx-auto flex min-h-[380px] max-w-[1920px] flex-col justify-between gap-24 px-5 py-7 sm:min-h-[440px] sm:px-10 lg:px-16">
          <Link href="/" className="inline-flex w-fit items-center gap-2 font-bold"><span aria-hidden="true" className="text-3xl font-normal">‹</span> 영화 목록</Link>
          <div>
            <BookmarkButton movieId={movie.id} movieTitle={movie.title} className="mb-4" />
            <h1 className="text-3xl leading-tight font-bold tracking-tight break-keep sm:text-5xl">{movie.title}</h1>
            <p className="mt-3 text-base text-white/90 sm:text-lg">{movie.original_title}</p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm font-bold sm:text-base">
              <time dateTime={movie.release_date}>{movie.release_date || "개봉일 정보 없음"}</time>
              <span>{movie.genres.map((genre) => genre.name).join(", ") || "장르 정보 없음"}</span>
              <span>{typeof movie.runtime === "number" ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분` : "상영 시간 정보가 없어요."}</span>
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-[1920px] gap-7 px-5 py-8 sm:grid-cols-[200px_minmax(0,1fr)] sm:px-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 lg:px-16">
        <MovieImage src={getTmdbPosterUrl(movie.poster_path)} alt={movie.title + " 포스터"} width={500} height={750} sizes="(min-width: 1024px) 240px, (min-width: 640px) 200px, 160px"
          className="aspect-[2/3] h-auto w-40 rounded-xl object-cover shadow-xl sm:w-full" />
        <section>
          <h2 className="text-2xl font-bold break-keep">{movie.tagline || "줄거리"}</h2>
          <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted">{movie.overview || "줄거리 정보가 없어요."}</p>
          <MovieRating movieId={movie.id} />
        </section>
      </div>
    </main>
  );
}
