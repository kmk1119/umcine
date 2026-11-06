export function TmdbFooter() {
  return <footer aria-label="TMDB Credits" className="flex flex-col items-center gap-4 border-t border-line px-5 py-8">
    <a href="https://www.themoviedb.org" aria-label="TMDB 홈페이지"><img src="/images/logos/tmdb-logo.svg" alt="TMDB" width="100" /></a>
    <p className="text-center text-xs leading-relaxed text-muted">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
  </footer>;
}
