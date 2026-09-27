import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  return <SearchContent key={query ?? ""} query={query} />;
}

function SearchContent({ query }: { query?: string }) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  const displayQuery = query?.trim() ?? "";
  const normalizedQuery = displayQuery.toLowerCase();
  const searchResults = normalizedQuery ? movies.filter((movie) =>
    movie.title.toLowerCase().includes(normalizedQuery) ||
    movie.originalTitle.toLowerCase().includes(normalizedQuery)
  ) : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    void navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  return (
    <main className={cn("mx-auto min-h-[calc(100vh-112px)] px-5 pb-16 sm:px-10 lg:px-16", normalizedQuery ? "max-w-[1920px] pt-8" : "max-w-[1200px] pt-20 sm:pt-24")}>
      <h1 className={cn("font-bold tracking-tight", normalizedQuery ? "mb-7 text-3xl sm:text-5xl" : "mb-10 text-center text-3xl sm:mb-14 sm:text-5xl")}>
        {normalizedQuery ? "영화 검색" : "어떤 영화를 찾고 있나요?"}
      </h1>
      <form onSubmit={handleSubmit} role="search" className={cn("flex items-center gap-3 rounded-2xl bg-white p-3 sm:gap-5 sm:px-6", normalizedQuery ? "border border-line" : "border-2 border-ink py-4 shadow-xl shadow-black/5 sm:py-5")}>
        <img src="/icons/movie-icons/search.svg" alt="" className="size-6 shrink-0 opacity-60" />
        <input type="search" aria-label="검색어" placeholder="예: 스파이더맨" value={searchText} onChange={(event) => setSearchText(event.target.value)}
          className="min-w-0 flex-1 bg-transparent py-2 text-base placeholder:text-subtle sm:text-lg [&::-webkit-search-cancel-button]:appearance-none" />
        <button type="submit" className="shrink-0 rounded-xl bg-ink px-4 py-3 font-bold text-white hover:bg-ink/85 sm:px-6">{normalizedQuery ? "다시 검색" : "검색"}</button>
      </form>
      {!normalizedQuery ? <p className="mt-6 text-center text-muted">검색어를 입력해 주세요.</p> : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 border-y border-line py-5" aria-live="polite">
            <h2 className="text-lg font-bold sm:text-xl">‘{displayQuery}’ 검색 결과</h2>
            <p className="text-sm text-subtle">영화 {searchResults.length}편</p>
          </div>
          {searchResults.length === 0 ? (
            <div className="py-20 text-center"><p className="text-xl font-bold">검색 결과가 없어요.</p><p className="mt-3 text-muted">다른 제목이나 원제로 검색해 보세요.</p></div>
          ) : (
            <ul className="grid gap-x-12 lg:grid-cols-2">
              {searchResults.map((movie) => (
                <li key={movie.id} className="flex min-w-0 gap-5 border-b border-line py-7 sm:gap-6">
                  <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="w-24 shrink-0 self-start overflow-hidden rounded-xl sm:w-40">
                    <img src={movie.posterPath} alt={movie.title + " 포스터"} className="aspect-[2/3] w-full object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col items-start">
                    <h3 className="text-lg font-bold break-keep sm:text-2xl"><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link></h3>
                    <div className="mt-2 flex flex-wrap gap-x-3 text-sm text-subtle sm:text-base"><p>{movie.originalTitle}</p><time dateTime={movie.releaseDate.replaceAll(".", "-")}>{movie.releaseDate}</time></div>
                    <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{movie.overview}</p>
                    <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="mt-auto inline-flex items-center gap-2 pt-5 font-bold text-primary">상세 보기 <span aria-hidden="true">→</span></Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
