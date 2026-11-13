import { HTTPError } from "ky";

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export async function readResult<T>(request: Promise<ApiResponse<T>>): Promise<T> {
  const response = await request;
  if (!response.isSuccess) throw new Error(response.message || "요청에 실패했어요.");
  return response.result;
}

export function getRequestError(error: unknown): string {
  if (error instanceof HTTPError) {
    if (error.response.status === 401) {
      return new URL(error.request.url).pathname.endsWith("/auth/login")
        ? "이메일 또는 비밀번호를 확인해 주세요."
        : "로그인이 만료됐어요. 다시 로그인해 주세요.";
    }
    if (error.response.status === 404) return "요청한 API 또는 데이터를 찾을 수 없어요.";
    // ky 2는 파싱된 오류 응답을 error.data로 제공한다.
    const data = error.data as { message?: string } | undefined;
    return data?.message || "요청에 실패했어요. 다시 시도해 주세요.";
  }
  return error instanceof Error ? error.message : "요청에 실패했어요. 다시 시도해 주세요.";
}
