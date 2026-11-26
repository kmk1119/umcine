"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthReady, useAuthStore } from "../../stores/auth-store";
import { useMeQuery } from "../../hooks/use-me-query";
import { RequestError } from "../movies/request-error";
// 토큰이 localStorage에 있어 서버에서는 로그인 여부를 알 수 없다. 브라우저에서 토큰 복원이 끝난 뒤 검사한다.
export function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const ready = useAuthReady();
  const token = useAuthStore((state) => state.accessToken);
  const me = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (ready && !token) router.replace("/login");
  }, [ready, token, router]);
  if (!ready || !token || me.isPending) return <main role="status" className="p-10 text-center">내 정보를 불러오는 중이에요.</main>;
  if (me.isError) return <main><RequestError message="내 정보를 불러오지 못했어요." onRetry={() => void me.refetch()} /></main>;
  return children;
}
