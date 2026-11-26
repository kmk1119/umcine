import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { MainNav, MainNavFallback } from "./main-nav";

// 로고는 Server Component로 미리 렌더링한다. 현재 경로(usePathname)와 토큰이 필요한 메뉴만
// Client Component로 분리하고 Suspense로 감싸 요청 시점에 채운다.
export function Header() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex min-h-20 max-w-[1920px] flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 sm:gap-x-12 sm:px-10 lg:min-h-28 lg:px-16">
        <Link className="flex shrink-0 items-center gap-2 text-2xl font-extrabold tracking-tight" href="/" aria-label="UMCine 영화 목록">
          <span className="grid size-10 place-items-center rounded-lg border-2 border-ink"><Image src="/icons/movie-icons/movie.svg" alt="" width={28} height={28} /></span>UMCine
        </Link>
        <Suspense fallback={<MainNavFallback />}>
          <MainNav />
        </Suspense>
      </div>
    </header>
  );
}
