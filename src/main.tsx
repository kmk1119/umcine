import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { routeTree } from "./routeTree.gen";
import { queryClient } from "./config/query-client";

import { useAuthStore } from "./stores/auth-store";

// 인증 주체가 바뀌면 이전 요청과 캐시를 제거한다. 공개 영화 캐시는 유지한다.
useAuthStore.subscribe((state, previous) => {
  if (state.accessToken === previous.accessToken) return;
  const filters = { predicate: (query: { queryKey: readonly unknown[] }) =>
    ["members", "favorites", "ratings"].includes(String(query.queryKey[0])) };
  void queryClient.cancelQueries(filters);
  queryClient.removeQueries(filters);
});

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
);
