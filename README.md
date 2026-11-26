# UMCine

## 9주차: Next.js App Router 마이그레이션

- Vite + TanStack Router에서 Next.js 16(App Router, Turbopack)으로 옮겼습니다. 라우트는 `src/app`에 있습니다.
- 영화 목록·검색·상세는 Server Component에서 TMDB를 조회합니다. TMDB 토큰은 서버 전용 환경 변수(`TMDB_ACCESS_TOKEN`)로만 읽습니다.
- 로그인 토큰은 localStorage에 있으므로 로그인·마이페이지·북마크·평점은 Client Component에서 처리합니다.
- 백엔드 CORS가 `http://localhost:5173`만 허용하므로 `dev`/`start` 스크립트를 5173 포트로 고정했습니다.
- 환경 변수: `TMDB_API_BASE_URL`, `TMDB_ACCESS_TOKEN`(서버 전용), `NEXT_PUBLIC_API_BASE_URL`(브라우저 공개). `.env.example` 참고.

## 8주차 구현

- 회원가입 요청 상태를 useMutation으로 관리합니다.
- 로그인 API, Zustand persist 토큰 저장, 인증 헤더, 401 처리와 로그아웃을 연결했습니다.
- `/profile`, `/profile/edit`는 `(protected)` Route Group의 공통 `_authenticated` Layout과 Outlet을 사용합니다.
- 내 정보 수정 응답은 setQueryData로 반영하고, 평점 등록·수정·삭제 후에는 회원 평점 목록을 무효화합니다.
- 마이페이지 즐겨찾기와 영화 상세 북마크는 서버 API를 사용합니다. **현재 movie 백엔드에는 즐겨찾기 API가 없으므로 실제 동작은 서버 구현 후 확인해야 합니다.** 임시 계약과 확정 계약을 [API 기록](docs/week8-api.md)에 구분했습니다.
- `/`, `/search`, `/movies/$movieId`는 기존 TMDB 데이터를 사용합니다. 비로그인 사용자의 북마크·평점 작성은 로그인으로 안내합니다.

## 테스트용 API로 화면 확인

실제 백엔드가 꺼져 있을 때만 별도 터미널에서 아래 명령을 사용합니다. 로컬 전용이며 클라우드 업로드는 하지 않습니다.

```powershell
postman simulation run postman/simulations/week8.sim.yaml --port 4010 --output ndjson --no-history
```

프론트 실행 터미널에서만 API 주소를 덮어씁니다. `.env.local`은 변경하지 않습니다.

```powershell
$env:NEXT_PUBLIC_API_BASE_URL = "http://localhost:4010/api/"
corepack.cmd pnpm dev
```

테스트 로그인: `study@example.com` / `Study123!`. 테스트용 가짜 토큰은 실제 서버에서 사용할 수 없습니다. `/__control`과 `/__state`는 stand-in에서만 제공되는 테스트 제어 API입니다. 검증 후 로그아웃하고 두 프로세스를 종료하세요.
실제 서버를 다시 사용할 때는 새 터미널을 열거나 `Remove-Item Env:NEXT_PUBLIC_API_BASE_URL`로 테스트 환경 변수를 지웁니다.

## 실행 방법

Corepack이 설치된 환경에서 아래 명령을 실행하세요. 프로젝트에 지정된 pnpm과 Node.js를 사용합니다.

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

```sh
corepack pnpm build
corepack pnpm lint
```

Windows PowerShell에서 실행 정책 오류가 나면 `corepack` 대신 `corepack.cmd`를 사용하세요.

`package.json`의 `devEngines.runtime`과 lockfile로 Node.js 24 실행 환경을 관리합니다.
Node.js 24.13.0의 Windows 한글 경로 삭제 문제를 피하도록 24.13.1 이상을 사용합니다.
참고: [Node.js 24.13.1 수정 내역](https://nodejs.org/en/blog/release/v24.13.1)
