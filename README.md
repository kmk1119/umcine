# UMCine

## 공개 영화 화면

- `/`: 로컬 영화 10편을 모바일 2열, 태블릿 3열, 데스크톱 5열로 표시합니다.
- `/search`: 검색어 입력 안내를 표시합니다.
- `/search?query=스파이더맨`: 한글 제목·원제를 대소문자 구분 없이 부분 검색합니다. 검색어, 실제 결과 수, 포스터, 제목, 원제, 개봉일, 줄거리를 표시합니다. 공백 검색어와 결과 없음도 처리합니다.
- `/movies/1`: URL의 ID로 영화 정보를 조회합니다. 존재하지 않는 ID는 `영화를 찾을 수 없어요.`를 표시합니다.
- 카드·검색 결과에서 상세 화면으로 이동할 수 있습니다. 헤더는 현재 경로와 정확히 일치하는 메뉴에만 활성 스타일을 적용합니다.
- 공개 화면은 Tailwind CSS로 스타일링하며 조건부 클래스는 `cn`으로 조합합니다. 전역 CSS에는 Tailwind 테마와 기본 스타일만 남겼습니다.
- 카드 북마크는 노션 7.2~7.3의 조건부 스타일 예시와 기존 목록 내부 동작만 유지합니다. 상세 화면은 영화 정보만 표시합니다.

3주차 범위에 맞춰 평점·후기 UI와 저장 기능, 상세 즐겨찾기, 화면 간 북마크 공유 Context, 내 정보·마이페이지 버튼을 제외했습니다. 검색어 지우기 별도 버튼과 카드 확대 효과도 제거했습니다.

시안과의 차이: 제공된 로컬 데이터에서 스파이더맨 검색 결과는 2편입니다. 영화의 메타데이터와 배경 이미지는 기존 로컬 파일을 사용하므로 첨부 시안의 예시와 다를 수 있습니다. 실제 데이터를 바꾸지 않던 5페이지 UI는 목록에서 제거했습니다.

### 직접 URL 접속

개발 서버 및 Vite preview에서는 각 경로에 직접 접속하거나 새로고침할 수 있습니다. 정적 호스팅 배포 시에는 `/search`, `/movies/*` 요청을 `index.html`로 전달하는 SPA fallback 설정이 필요합니다.

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
