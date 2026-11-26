import "server-only";

// TMDB 토큰은 NEXT_PUBLIC_ 접두사가 없어 서버에서만 읽을 수 있다. 클라이언트에서 import하면 빌드 오류가 난다.
export function getTmdbEnv() {
  const baseUrl = process.env.TMDB_API_BASE_URL?.trim();
  const accessToken = process.env.TMDB_ACCESS_TOKEN?.trim();
  if (!baseUrl || !accessToken) throw new Error("TMDB 환경 변수가 필요해요.");
  return { baseUrl: `${baseUrl.replace(/\/+$/, "")}/`, accessToken };
}
