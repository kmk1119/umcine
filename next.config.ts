import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // create-next-app 16.4 기본 설정을 그대로 가져왔다.
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // TMDB 포스터·배경 이미지를 next/image로 최적화한다.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" }],
  },
};

export default nextConfig;
