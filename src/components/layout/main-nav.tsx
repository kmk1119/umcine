"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../../utils/cn";
import { useAuthReady, useAuthStore } from "../../stores/auth-store";
import { useMeQuery } from "../../hooks/use-me-query";

const menuClass = (active: boolean) => cn("py-2 text-sm font-bold sm:text-base", active ? "text-ink underline underline-offset-4" : "text-muted hover:text-ink");
const skeleton = <span role="status" className="h-10 w-24 animate-pulse rounded-lg bg-gray-200"><span className="sr-only">조회 중</span></span>;

// 현재 경로와 localStorage 토큰에 따라 메뉴가 바뀌므로 Client Component다.
export function MainNav() {
  const pathname = usePathname();
  const ready = useAuthReady();
  const token = useAuthStore((state) => state.accessToken);
  const me = useMeQuery();
  const router = useRouter();
  return (
    <nav aria-label="주 메뉴" className="flex flex-wrap items-center gap-5 sm:gap-8">
      <Link className={menuClass(pathname === "/")} href="/">영화</Link>
      <Link className={menuClass(pathname === "/search")} href="/search">검색</Link>
      {!ready || (token && me.isLoading) ? skeleton
        : !token ? <Link className={menuClass(pathname === "/login")} href="/login">로그인</Link>
        : <>
          <Link className={menuClass(pathname.startsWith("/profile"))} href="/profile">{me.data?.nickname ? `${me.data.nickname}님` : "마이페이지"}</Link>
          <button className={menuClass(false)} onClick={() => {
            useAuthStore.getState().setAccessToken(null);
            router.push("/login");
          }}>로그아웃</button>
        </>}
    </nav>
  );
}

// 미리 렌더링되는 정적 메뉴. 경로와 로그인 상태를 알기 전까지 보여 준다.
export function MainNavFallback() {
  return (
    <nav aria-label="주 메뉴" className="flex flex-wrap items-center gap-5 sm:gap-8">
      <Link className={menuClass(false)} href="/">영화</Link>
      <Link className={menuClass(false)} href="/search">검색</Link>
      {skeleton}
    </nav>
  );
}
