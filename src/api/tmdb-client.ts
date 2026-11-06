import ky from "ky";
import { getTmdbEnv } from "../config/env";

// 요청 시점에 검사하여 설정 누락도 화면의 오류 상태로 처리한다.
export function getTmdbClient() {
  const { baseUrl, accessToken } = getTmdbEnv();
  return tmdbClient.extend({ baseUrl, headers: { Authorization: `Bearer ${accessToken}` } });
}

export const tmdbClient = ky.create();
