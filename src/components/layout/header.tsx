import "./header.css";
import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="site-header">
      <div className="header-content">
        <Link className="brand" to="/" aria-label="UMCine 영화 목록">
          <img src="/icons/movie-icons/movie.svg" alt="" width="28" height="28" />
          UMCine
        </Link>
        <nav aria-label="주 메뉴">
          <Link className="nav-link" to="/">영화</Link>
          <Link className="nav-link" to="/search">검색</Link>
        </nav>
      </div>
    </header>
  )
}
