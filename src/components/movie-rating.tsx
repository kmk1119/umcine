import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createRating, deleteRating, getMemberRatings, updateRating, type Rating, type RatingInput } from "../api/ratings";
import { getRequestError } from "../api/response";
import { getMemberId, useAuthStore } from "../stores/auth-store";
import { memberButton } from "./member-form";

export function MovieRating({ movieId }: { movieId: number }) {
  const token = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(token);
  // 성공 후 목록을 다시 조회하면 RatingForm이 새 key로 다시 마운트되므로 안내 문구는 부모가 보관한다.
  const [notice, setNotice] = useState<{ movieId: number; text: string } | null>(null);
  const ratings = useQuery({ queryKey: ["ratings", memberId], queryFn: ({ signal }) => getMemberRatings(memberId!, signal), enabled: Boolean(token && memberId), retry: false });
  if (!token) return <section className="mt-8 border-t border-line pt-6"><h2 className="text-xl font-bold">내 평점과 후기</h2><p className="mt-3"><Link className="underline" to="/login">로그인</Link>하고 평점을 남겨보세요.</p></section>;
  if (!memberId) return <p role="alert" className="mt-8">회원 번호를 확인할 수 없어요. 로그아웃 후 다시 로그인해 주세요.</p>;
  if (ratings.isPending) return <p role="status" className="mt-8">내 평점을 불러오는 중이에요.</p>;
  if (ratings.isError) return <div role="alert" className="mt-8"><p>{getRequestError(ratings.error)}</p><button className="underline" onClick={() => void ratings.refetch()}>평점 다시 조회</button></div>;
  const rating = ratings.data.find((item) => item.movieId === movieId);
  return <RatingForm key={`${memberId}:${movieId}:${rating?.updatedAt ?? "new"}:${rating?.ratingId ?? "new"}`} movieId={movieId} memberId={memberId} rating={rating}
    message={notice?.movieId === movieId ? notice.text : ""} setMessage={(text) => setNotice(text ? { movieId, text } : null)} />;
}
interface RatingFormProps { movieId: number; memberId: number; rating?: Rating; message: string; setMessage: (text: string) => void }
function RatingForm({ movieId, memberId, rating, message, setMessage }: RatingFormProps) {
  const [score, setScore] = useState(rating?.score ?? 5);
  const [comment, setComment] = useState(rating?.comment ?? "");
  const token = useAuthStore((state) => state.accessToken);
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (action: { type: "save"; body: RatingInput } | { type: "delete" }) => {
      if (action.type === "delete") {
        if (!rating) throw new Error("삭제할 평점이 없어요.");
        await deleteRating(rating.ratingId);
        return "평점을 삭제했어요.";
      }
      if (rating) await updateRating(rating.ratingId, action.body);
      else await createRating({ movieId, ...action.body });
      return rating ? "평점을 수정했어요." : "평점을 등록했어요.";
    },
    onSuccess: async (result) => {
      if (useAuthStore.getState().accessToken !== token) return;
      setMessage(result);
      await client.invalidateQueries({ queryKey: ["ratings", memberId] });
    },
  });
  const valid = Number.isInteger(score) && score >= 1 && score <= 5 && comment.length <= 500;
  return <section className="mt-8 border-t border-line pt-6">
    <h2 className="mb-4 text-xl font-bold">내 평점과 후기</h2>
    <form onSubmit={(event) => {
      event.preventDefault();
      if (!valid || mutation.isPending) return;
      mutation.mutate({ type: "save", body: { score, comment: comment.trim() } });
    }}>
      <fieldset className="grid max-w-xl gap-3" disabled={mutation.isPending}>
        <label htmlFor="rating-score" className="font-bold">별점</label>
        <select id="rating-score" className="rounded-lg border border-line p-3" value={score} onChange={(event) => { setScore(Number(event.target.value)); setMessage(""); mutation.reset(); }}>
          {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}점</option>)}
        </select>
        <label htmlFor="rating-comment" className="font-bold">후기</label>
        <textarea id="rating-comment" className="min-h-28 rounded-lg border border-line p-3" maxLength={500} value={comment}
          onChange={(event) => { setComment(event.target.value); setMessage(""); mutation.reset(); }} />
        <p className="text-sm text-muted">{comment.length}/500자</p>
        <div className="flex gap-3">
          <button type="submit" className={memberButton} disabled={!valid}>{mutation.isPending ? "처리 중" : rating ? "평점 수정" : "평점 등록"}</button>
          {rating && <button type="button" className="shrink-0 rounded-lg border border-line px-4 font-bold" onClick={() => {
            if (!mutation.isPending) mutation.mutate({ type: "delete" });
          }}>평점 삭제</button>}
        </div>
        {mutation.isError && <p role="alert" className="text-red-600">{getRequestError(mutation.error)}</p>}
        {message && <p role="status">{message}</p>}
      </fieldset>
    </form>
  </section>;
}
