import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import type { ReactNode } from "react";
import { Header } from "../components/layout/header";
import { TmdbFooter } from "../components/layout/tmdb-footer";
import { Providers } from "../components/providers/providers";
import "./globals.css";

// next/font가 폰트 파일을 빌드 시 내려받아 같은 출처에서 제공한다. 한글은 용량이 커서 미리 불러오지 않는다.
const notoSansKr = Noto_Sans_KR({
  weight: ["400", "700", "800"],
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: false,
});

// 모든 페이지에 공통으로 적용할 메타데이터. 각 page.tsx의 title은 template에 들어간다.
export const metadata: Metadata = {
  title: { default: "UMCine", template: "%s | UMCine" },
  description: "TMDB 영화 정보를 검색하고 즐겨찾기와 평점을 남기는 UMCine",
  icons: { icon: "/icons/favicon.svg" },
  openGraph: { siteName: "UMCine", locale: "ko_KR", type: "website" },
};

// 레이아웃은 Server Component다. 상호작용이 필요한 Providers·Header만 Client Component다.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body>
        <Providers>
          <Header />
          {children}
          <TmdbFooter />
        </Providers>
      </body>
    </html>
  );
}
