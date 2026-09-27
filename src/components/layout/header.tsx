import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export function Header() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const menuClass = (active: boolean) => cn("py-2 text-sm font-bold sm:text-base", active ? "text-ink underline underline-offset-4" : "text-muted hover:text-ink");
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex min-h-20 max-w-[1920px] flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 sm:gap-x-12 sm:px-10 lg:min-h-28 lg:px-16">
        <Link className="flex shrink-0 items-center gap-2 text-2xl font-extrabold tracking-tight" to="/" aria-label="UMCine 영화 목록">
          <span className="grid size-10 place-items-center rounded-lg border-2 border-ink"><img src="/icons/movie-icons/movie.svg" alt="" className="size-7" /></span>UMCine
        </Link>
        <nav aria-label="주 메뉴" className="flex items-center gap-5 sm:gap-8">
          <Link className={menuClass(pathname === "/")} to="/" aria-current={pathname === "/" ? "page" : undefined}>영화</Link>
          <Link className={menuClass(pathname === "/search")} to="/search" aria-current={pathname === "/search" ? "page" : undefined}>검색</Link>
        </nav>
      </div>
    </header>
  );
}
