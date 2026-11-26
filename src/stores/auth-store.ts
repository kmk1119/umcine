import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(persist(
  (set) => ({ accessToken: null, setAccessToken: (accessToken) => set({ accessToken }) }),
  { name: "umcine-auth-store", storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ accessToken: state.accessToken }),
    // 서버에는 localStorage가 없다. 서버 HTML과 첫 클라이언트 렌더를 같게 맞추기 위해
    // 자동 복원을 끄고, 브라우저에서 마운트된 뒤 Providers의 useEffect에서 rehydrate()한다.
    skipHydration: true },
));

// localStorage에서 토큰 복원이 끝났는지 알려 준다. 서버 렌더와 하이드레이션 중에는 항상 false다.
export function useAuthReady() {
  return useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}

// 로컬 백엔드 JwtUtil의 sub는 memberId다. 조회 경로에만 사용하며 인증은 서버가 검증한다.
export function getMemberId(accessToken: string | null): number | null {
  if (!accessToken) return null;
  try {
    const payload = accessToken.split(".")[1];
    const normalized = payload.replaceAll("-", "+").replaceAll("_", "/");
    const { sub } = JSON.parse(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")));
    const id = Number(sub);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  } catch { return null; }
}
