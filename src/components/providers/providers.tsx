"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState, type ReactNode } from "react";
import { createQueryClient } from "../../config/query-client";
import { useAuthStore } from "../../stores/auth-store";

const USER_QUERY_KEYS = ["members", "favorites", "ratings"];

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  useEffect(() => {
    // 인증 주체가 바뀌면 이전 사용자의 요청과 캐시를 제거한다. 공개 영화 캐시는 유지한다.
    const unsubscribe = useAuthStore.subscribe((state, previous) => {
      if (state.accessToken === previous.accessToken) return;
      const filters = { predicate: (query: { queryKey: readonly unknown[] }) =>
        USER_QUERY_KEYS.includes(String(query.queryKey[0])) };
      void queryClient.cancelQueries(filters);
      queryClient.removeQueries(filters);
    });
    // 브라우저에서만 localStorage의 토큰을 복원한다.
    void useAuthStore.persist.rehydrate();
    return unsubscribe;
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
