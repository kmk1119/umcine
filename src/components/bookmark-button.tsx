import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  iconOnly?: boolean;
  className?: string;
}

export function BookmarkButton({ movieId, movieTitle, iconOnly = false, className }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      aria-label={`${movieTitle} 북마크 ${isBookmarked ? "해제" : "추가"}`}
      aria-pressed={isBookmarked}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border p-2 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        isBookmarked ? "border-primary bg-primary" : "border-white bg-ink",
        !iconOnly && "px-4 py-3",
        className,
      )}
      onClick={() => toggleBookmark(movieId)}
    >
      <img src={`/icons/movie-icons/${isBookmarked ? "bookmark" : "bookmark-outline"}.svg`} alt="" width="24" height="24" className="invert" />
      {!iconOnly && (isBookmarked ? "북마크 해제" : "북마크 추가")}
    </button>
  );
}
