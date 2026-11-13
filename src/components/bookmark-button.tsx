import { useIsMutating } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useFavorite, useFavoriteMutation } from "../hooks/use-favorites";
import { useAuthStore } from "../stores/auth-store";
import { getRequestError } from "../api/response";
import { cn } from "../utils/cn";

interface BookmarkButtonProps { movieId: number; movieTitle: string; iconOnly?: boolean; className?: string }
export function BookmarkButton({ movieId, movieTitle, iconOnly = false, className }: BookmarkButtonProps) {
  const token = useAuthStore((state) => state.accessToken);
  const query = useFavorite(movieId);
  const mutation = useFavoriteMutation(movieId);
  const busy = useIsMutating({ mutationKey: ["favorite-toggle", movieId] }) > 0;
  const navigate = useNavigate();
  const active = Boolean(token && query.data?.isFavorite);
  return (
    <button type="button" aria-label={`${movieTitle} 북마크 ${active ? "해제" : "추가"}`}
      aria-pressed={active} aria-busy={busy}
      title={query.isError ? `${getRequestError(query.error)} 클릭하면 다시 조회해요.` : undefined}
      disabled={busy || Boolean(token && query.isLoading)}
      className={cn("inline-flex items-center justify-center gap-2 rounded-xl border p-2 font-bold text-white disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        active ? "border-primary bg-primary" : "border-white bg-ink", !iconOnly && "px-4 py-3", className)}
      onClick={() => {
        if (!token) { void navigate({ to: "/login" }); return; }
        if (query.isError) { void query.refetch(); return; }
        if (!query.data || busy) return;
        mutation.mutate(active, { onError: (error) => alert(getRequestError(error)) });
      }}>
      <img src={`/icons/movie-icons/${active ? "bookmark" : "bookmark-outline"}.svg`} alt="" width="24" height="24" className="invert" />
      {!iconOnly && (busy ? "변경 중" : query.isError ? "북마크 조회 재시도" : active ? "북마크 해제" : "북마크 추가")}
    </button>
  );
}
