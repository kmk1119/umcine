# 10주차 필수 미션 기록: 배포한 UMCine 최종 점검

- 최종 배포 주소: https://umcine-tau.vercel.app
- 배포 환경: Vercel (GitHub `main` 브랜치 연결)
- 점검일: 2026-11-27

## 1. 배포 후 발생한 문제와 수정

### 증상

배포 직후 메인 페이지(`/`)에 "정보를 불러오지 못했어요."만 나오고 영화 목록이 보이지 않았다.

### 원인

TMDB 요청에 필요한 환경 변수가 Vercel에 없었다.

- `src/config/tmdb-env.ts`는 `TMDB_API_BASE_URL`, `TMDB_ACCESS_TOKEN`이 없으면 에러를 던진다.
- 로컬에서는 `.env.local`에서 값을 읽지만, `.gitignore`의 `*.local` 규칙 때문에 이 파일은 저장소에 올라가지 않는다. 그래서 Vercel 빌드·실행 환경에는 두 값이 없었다.

### 해결

1. Vercel 프로젝트 Settings → Environment Variables에 `TMDB_API_BASE_URL`, `TMDB_ACCESS_TOKEN`을 추가했다.
2. 환경 변수는 새 배포부터 적용되므로 Deployments에서 Redeploy했다.
3. 재배포 후 영화 목록이 정상으로 표시되는 것을 확인했다.

> 토큰은 `NEXT_PUBLIC_` 접두사가 없는 서버 전용 변수라 브라우저 번들에 포함되지 않는다.

## 2. 기능별 점검 결과

| 기능 | 경로 | 결과 |
|---|---|---|
| 인기 영화 목록 | `/` | ✅ 20개 영화 카드와 포스터 표시 |
| 목록 페이지네이션 | `/?page=2` | ✅ 다음 페이지 영화 20개 표시 |
| 영화 상세 | `/movies/1726` | ✅ 제목·포스터·배경 이미지·정보 표시, 탭 제목 `아이언맨 \| UMCine` |
| 없는 영화 ID | `/movies/999999999` | ✅ "영화를 찾을 수 없어요" 페이지 표시 |
| 영화 검색 (영문) | `/search?query=avengers` | ✅ 검색 결과 20개 표시 |
| 영화 검색 (한글) | `/search?query=기생충` | ✅ 검색 결과 표시 |
| 검색 결과 없음 | `/search?query=zzxxqqwwnotamovie` | ✅ 결과 없음 안내 표시 |
| 검색 페이지네이션 | `/search?query=love&page=2` | ✅ 2페이지 결과 표시 |
| 영화 요약 Route Handler | `/api/movies/1726` | ✅ `200`, `{ id, title, posterPath }` JSON 응답 |
| 없는 경로 | `/no-such-page` | ✅ 404 상태 코드와 Not Found 페이지 |
| 로그인·회원가입 화면 | `/login`, `/signup` | ✅ 폼 정상 표시 |
| 보호 페이지 접근 제한 | `/profile` (비로그인) | ✅ `/login`으로 이동 |
| 로그인·회원가입·평점·북마크 요청 | - | ⚠️ 백엔드 미배포로 배포 환경에서는 동작하지 않음 (아래 참고) |

## 3. 로컬과 다른 점

로그인, 회원가입, 이메일·닉네임 중복 확인, 평점, 북마크는 직접 만든 백엔드 API(`NEXT_PUBLIC_API_BASE_URL`)를 호출한다.

- 로컬에서는 `http://localhost:8080` 백엔드를 사용한다.
- 백엔드는 프론트엔드 교재 실습을 모두 마친 뒤 배포할 예정이다. 그래서 지금은 Vercel에 `NEXT_PUBLIC_API_BASE_URL`을 설정하지 않았다.
- `localhost` 주소를 그대로 넣으면 사용자의 브라우저가 자기 컴퓨터의 8080 포트로 요청하므로 의미가 없다.

백엔드 배포 후 할 일:

1. Vercel에 `NEXT_PUBLIC_API_BASE_URL=<배포된 백엔드 주소>`를 추가한다.
2. 백엔드 CORS 허용 목록에 `https://umcine-tau.vercel.app`을 추가한다.
3. `NEXT_PUBLIC_` 값은 빌드할 때 번들에 들어가므로 Redeploy한다.
4. 로그인 → 마이페이지 → 내 정보 수정 → 평점 등록·수정·삭제 흐름을 배포 주소에서 다시 확인한다.

## 4. 배운 점

- `.env.local`은 저장소에 올라가지 않으므로, 배포 플랫폼에 환경 변수를 따로 등록해야 한다.
- 환경 변수를 추가하거나 바꾸면 Redeploy해야 반영된다.
- 서버 전용 변수(`TMDB_ACCESS_TOKEN`)와 브라우저 공개 변수(`NEXT_PUBLIC_*`)는 노출 범위와 반영 시점이 다르다.
