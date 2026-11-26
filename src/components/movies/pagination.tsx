import Link from "next/link";
import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  getHref: (page: number) => string;
}

// 페이지 이동을 버튼 onClick 대신 Link로 바꿔 Server Component로 렌더링한다.
export default function Pagination({ currentPage, totalPages, getHref }: PaginationProps) {
  if (totalPages <= 1) return null;
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => start + index);
  const itemClass = (active = false) => cn(
    "grid size-9 place-items-center rounded-md border text-sm sm:size-10",
    active ? "border-ink bg-ink font-bold text-white" : "border-line bg-white text-muted hover:bg-canvas",
  );
  const disabledClass = cn(itemClass(), "cursor-default opacity-30 hover:bg-white");
  return (
    <nav className="mt-9 flex justify-center gap-1 sm:mt-12 sm:gap-2" aria-label="영화 목록 페이지">
      {currentPage <= 1 ? <span className={disabledClass} aria-hidden="true">‹</span>
        : <Link className={itemClass()} href={getHref(currentPage - 1)} aria-label="이전 페이지">‹</Link>}
      {pages.map((page) => (
        <Link key={page} className={itemClass(currentPage === page)} href={getHref(page)}
          aria-label={page + "페이지"} aria-current={currentPage === page ? "page" : undefined}>{page}</Link>
      ))}
      {currentPage >= totalPages ? <span className={disabledClass} aria-hidden="true">›</span>
        : <Link className={itemClass()} href={getHref(currentPage + 1)} aria-label="다음 페이지">›</Link>}
    </nav>
  );
}
