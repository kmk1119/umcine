# UMCine

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
$env:VITE_API_BASE_URL = "http://localhost:4010/api/"
corepack.cmd pnpm dev --host localhost --port 5173 --strictPort
```

테스트 로그인: `study@example.com` / `Study123!`. 테스트용 가짜 토큰은 실제 서버에서 사용할 수 없습니다. `/__control`과 `/__state`는 stand-in에서만 제공되는 테스트 제어 API입니다. 검증 후 로그아웃하고 두 프로세스를 종료하세요.
실제 서버를 다시 사용할 때는 새 터미널을 열거나 `Remove-Item Env:VITE_API_BASE_URL`로 테스트 환경 변수를 지웁니다.

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

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
