// NEXT_PUBLIC_ 접두사가 붙은 값만 브라우저 번들에 포함된다. 백엔드 주소는 브라우저에서 요청하므로 공개 값이다.
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
};
