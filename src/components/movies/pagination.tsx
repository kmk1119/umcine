import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => start + index);
  const buttonClass = (active = false) => cn(
    "grid size-9 place-items-center rounded-md border text-sm disabled:cursor-default disabled:opacity-30 sm:size-10",
    active ? "border-ink bg-ink font-bold text-white" : "border-line bg-white text-muted enabled:hover:bg-canvas"
  );
  return (
    <nav className="mt-9 flex justify-center gap-1 sm:mt-12 sm:gap-2" aria-label="영화 목록 페이지">
      <button type="button" className={buttonClass()} aria-label="이전 페이지" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>‹</button>
      {pages.map((page) => (
        <button key={page} type="button" className={buttonClass(currentPage === page)} aria-label={page + "페이지"} aria-current={currentPage === page ? "page" : undefined} onClick={() => onPageChange(page)}>{page}</button>
      ))}
      <button type="button" className={buttonClass()} aria-label="다음 페이지" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>›</button>
    </nav>
  );
}
