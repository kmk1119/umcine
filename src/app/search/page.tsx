import type { Metadata } from "next";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/bookmark-button";
import { MovieImage } from "../../components/movies/movie-image";
import Pagination from "../../components/movies/pagination";
import { cn } from "../../utils/cn";
import { parsePage } from "../../utils/movies/page-param";
import { toMovieCard } from "../../utils/movies/to-movie-card";

export const metadata: Metadata = {
  title: "영화 검색",
  description: "제목이나 원제로 영화를 검색해 보세요.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<SearchLayout query="" />}>
      <SearchScreen searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchScreen({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query.trim() : "";
  const page = parsePage(params.page);
  return (
    <SearchLayout query={query}>
      <Suspense key={`${query}:${page}`} fallback={<p role="status" className="py-20 text-center">검색 결과를 불러오는 중이에요.</p>}>
        <SearchResults query={query} page={page} />
      </Suspense>
    </SearchLayout>
  );
}

// next/form의 Form은 GET 제출을 클라이언트 이동으로 처리한다. 입력 상태를 useState로 관리하지 않아도 된다.
function SearchLayout({ query, children }: { query: string; children?: React.ReactNode }) {
  return (
    <main className={cn("mx-auto min-h-[calc(100vh-112px)] px-5 pb-16 sm:px-10 lg:px-16", query ? "max-w-[1920px] pt-8" : "max-w-[1200px] pt-20 sm:pt-24")}>
      <h1 className={cn("font-bold tracking-tight", query ? "mb-7 text-3xl sm:text-5xl" : "mb-10 text-center text-3xl sm:mb-14 sm:text-5xl")}>
        {query ? "영화 검색" : "어떤 영화를 찾고 있나요?"}
      </h1>
      <Form action="/search" role="search" className={cn("flex items-center gap-3 rounded-2xl bg-white p-3 sm:gap-5 sm:px-6", query ? "border border-line" : "border-2 border-ink py-4 shadow-xl shadow-black/5 sm:py-5")}>
        <Image src="/icons/movie-icons/search.svg" alt="" width={24} height={24} className="size-6 shrink-0 opacity-60" />
        <input key={query} type="search" name="query" aria-label="검색어" placeholder="예: 스파이더맨" defaultValue={query}
          className="min-w-0 flex-1 bg-transparent py-2 text-base placeholder:text-subtle sm:text-lg [&::-webkit-search-cancel-button]:appearance-none" />
        <button type="submit" className="shrink-0 rounded-xl bg-ink px-4 py-3 font-bold text-white hover:bg-ink/85 sm:px-6">{query ? "다시 검색" : "검색"}</button>
      </Form>
      {query ? children : <p className="mt-6 text-center text-muted">검색어를 입력해 주세요.</p>}
    </main>
  );
}

async function SearchResults({ query, page }: { query: string; page: number }) {
  const data = await searchMovies({ query, page });
  const results = data.results.map(toMovieCard);
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-line py-5" aria-live="polite">
        <h2 className="text-lg font-bold sm:text-xl">‘{query}’ 검색 결과</h2>
        <p className="text-sm text-subtle">영화 {data.total_results}편</p>
      </div>
      {results.length === 0 ? (
        <div className="py-20 text-center"><p className="text-xl font-bold">검색 결과가 없어요.</p><p className="mt-3 text-muted">다른 제목이나 원제로 검색해 보세요.</p></div>
      ) : (
        <ul className="grid gap-x-12 lg:grid-cols-2">
          {results.map((movie) => (
            <li key={movie.id} className="flex min-w-0 gap-5 border-b border-line py-7 sm:gap-6">
              <Link href={`/movies/${movie.id}`} className="w-24 shrink-0 self-start overflow-hidden rounded-xl sm:w-40">
                <MovieImage src={movie.posterPath} alt={movie.title + " 포스터"} width={500} height={750} sizes="(min-width: 640px) 160px, 96px" className="aspect-[2/3] h-auto w-full object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col items-start">
                <h3 className="text-lg font-bold break-keep sm:text-2xl"><Link href={`/movies/${movie.id}`}>{movie.title}</Link></h3>
                <div className="mt-2 flex flex-wrap gap-x-3 text-sm text-subtle sm:text-base"><p>{movie.originalTitle}</p><time dateTime={movie.releaseDate}>{movie.releaseDate || "개봉일 정보 없음"}</time></div>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{movie.overview || "줄거리 정보가 없어요."}</p>
                <BookmarkButton movieId={movie.id} movieTitle={movie.title} className="mt-4" />
                <Link href={`/movies/${movie.id}`} className="mt-auto inline-flex items-center gap-2 pt-5 font-bold text-primary">상세 보기 <span aria-hidden="true">→</span></Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Pagination currentPage={page} totalPages={Math.min(500, data.total_pages)}
        getHref={(nextPage) => `/search?${new URLSearchParams({ query, page: String(nextPage) })}`} />
    </>
  );
}
