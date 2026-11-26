import type { Metadata } from "next";
import { Suspense } from "react";
import { getMovies } from "../api/movies/get-movies";
import MovieGrid from "../components/movies/movie-grid";
import Pagination from "../components/movies/pagination";
import { parsePage } from "../utils/movies/page-param";
import { toMovieCard } from "../utils/movies/to-movie-card";

export const metadata: Metadata = {
  // 루트 layout과 같은 세그먼트라 title.template이 적용되지 않으므로 전체 제목을 직접 지정한다.
  title: { absolute: "UMCine | 영화 목록" },
  description: "지금 인기 있는 영화를 확인해 보세요.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// 제목은 빌드 시 미리 만들고, 쿼리 문자열이 필요한 목록은 요청 시 서버에서 준비한다.
export default function HomePage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="mx-auto max-w-[1920px] px-5 py-8 sm:px-10 lg:px-16">
      <h1 className="mb-7 text-3xl font-bold tracking-tight sm:text-5xl">영화 목록</h1>
      <Suspense fallback={<p role="status" className="py-16 text-center">영화 목록을 불러오는 중이에요.</p>}>
        <MovieList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function MovieList({ searchParams }: { searchParams: SearchParams }) {
  const page = parsePage((await searchParams).page);
  const data = await getMovies({ page });
  if (!data.results.length) return <p className="py-16 text-center">조건에 맞는 영화가 없어요.</p>;
  return (
    <>
      <MovieGrid movies={data.results.map(toMovieCard)} />
      <Pagination currentPage={page} totalPages={Math.min(500, data.total_pages)} getHref={(nextPage) => `/?page=${nextPage}`} />
    </>
  );
}
