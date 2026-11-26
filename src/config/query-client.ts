import { QueryClient } from "@tanstack/react-query";

// 서버에서 모듈 전역 QueryClient를 공유하면 요청 사이에 캐시가 섞일 수 있어, Provider에서 한 번만 생성한다.
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
      },
    },
  });
}
