import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(persist(
  (set) => ({ accessToken: null, setAccessToken: (accessToken) => set({ accessToken }) }),
  { name: "umcine-auth-store", storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ accessToken: state.accessToken }) },
));

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
