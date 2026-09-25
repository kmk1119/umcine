# UMCine

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
