import "./pagination.css";
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button type="button" aria-label="이전 페이지" disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}>
        <img src="/icons/movie-icons/chevron-left.svg" alt="" width="20" height="20" />
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button key={page} type="button" aria-label={`${page}페이지`}
          aria-current={currentPage === page ? 'page' : undefined}
          onClick={() => onPageChange(page)}>{page}</button>
      ))}
      <button type="button" aria-label="다음 페이지" disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}>
        <img src="/icons/movie-icons/chevron-right.svg" alt="" width="20" height="20" />
      </button>
    </nav>
  )
}
