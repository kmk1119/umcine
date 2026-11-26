"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { RequestError } from "../components/movies/request-error";

// 서버에서 TMDB 요청이 실패하면 이 경계가 대신 렌더링된다. 오류 경계는 reset을 쓰므로 Client Component다.
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  return (
    <main>
      <RequestError message="정보를 불러오지 못했어요." onRetry={() => startTransition(() => { router.refresh(); reset(); })} />
    </main>
  );
}
