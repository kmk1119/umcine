export function getTmdbEnv() {
  const baseUrl = import.meta.env.VITE_TMDB_API_BASE_URL?.trim();
  const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim();
  if (!baseUrl || !accessToken) throw new Error("TMDB 환경 변수가 필요해요.");
  return { baseUrl: `${baseUrl.replace(/\/+$/, "")}/`, accessToken };
}
