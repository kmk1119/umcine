# 8주차 API 연결 계약과 확인 범위

## 실제 로컬 백엔드에서 확인한 계약

`../movie/src/main/java/com/umc/movie/controller`와 `dto` 기준.

| API | 요청 | 응답 |
| --- | --- | --- |
| POST /auth/login | email, password | 공통 응답 result: nickname, accessToken |
| GET /members/me | Bearer 토큰 | result: email, nickname, createdAt |
| PATCH /members/me | nickname (2~12자) | result: 수정된 회원 정보 |
| GET /members/{memberId}/ratings | JWT sub의 memberId를 조회 경로에 사용 | 공통 응답 없이 Rating[] |
| POST /ratings | movieId, score (정수 1~5), comment (최대 500자) | result: Rating |
| PATCH /ratings/{ratingId} | score, comment | result: Rating |
| DELETE /ratings/{ratingId} | 본인 토큰 | result: null |

Rating: ratingId, movieId, score, comment, createdAt, updatedAt.
JWT를 클라이언트에서 해석하는 것은 조회용 식별자 추출일 뿐이다. 서버의 서명·만료·소유권 검사를 대체하지 않는다.

## 즐겨찾기 (movie 백엔드 FavoriteController 기준)

| API | 요청 | 응답 |
| --- | --- | --- |
| GET /favorites | Bearer 토큰 | result: { favoriteId, movieId, createdAt }[] (최신순) |
| GET /favorites/{movieId} | Bearer 토큰 | result: { isFavorite: boolean } |
| POST /favorites | { movieId } | 201, result: { favoriteId, movieId, createdAt }. 중복 시 409 FAVORITE409_1 |
| DELETE /favorites/{movieId} | Bearer 토큰 | result: null. 없으면 404 FAVORITE404_1 |

목록의 제목·포스터는 movieId로 TMDB에서 조회한다.

## 상태와 캐시

- 폼 입력은 useState, 토큰만 Zustand persist, 회원·즐겨찾기·평점은 Query 캐시.
- Route Group `(protected)` 안에 pathless `_authenticated` Layout을 두고 Outlet으로 두 화면을 렌더링한다.
- URL은 기존 `/profile`, `/profile/edit`를 유지한다.
- 닉네임: 성공 응답으로 setQueryData. 별도 캐시 갱신용 GET을 보내지 않는다.
- 즐겨찾기: 상세 캐시는 성공 후 변경하고 목록 invalidateQueries.
- 평점: mutation 성공 후 회원 평점 목록 invalidateQueries. 실패 시 입력을 보존한다.
- 토큰 변경 시 회원·즐겨찾기·평점 요청 취소 및 캐시 제거. 401은 해당 요청의 토큰이 현재 토큰일 때만 로그아웃한다.

## 실행

`corepack.cmd pnpm build`, `corepack.cmd pnpm lint`

백엔드는 DB·JWT 환경 변수와 MySQL이 필요하다.

## 2026-11-11 최종 검증 기록

실제 React 앱을 Vite로 실행하고 Postman CLI 1.85.0 simulation의 HTTP 응답에 연결하여 브라우저에서 확인했다. TMDB 영화 상세는 기존 연결을 사용했다.
Postman 계정은 로그인되어 있지 않아 소유자 mock 검색은 생략했다. 로그인·내 정보·평점 stand-in은 로컬 Java DTO로 작성했으며 즐겨찾기 stand-in은 위 임시 계약을 따른다.

| 항목 | 테스트 API와 브라우저에서 관찰한 결과 |
| --- | --- |
| 보호 경로 | 로그아웃 상태에서 /profile/edit 직접 접속 → /login |
| 로그인 실패 | 401 후 오류 문구와 활성 제출 버튼 표시, 재입력 가능 |
| 로그인 성공 | 홈 이동, 회원 닉네임 표시 |
| 로그인 페이지 제한 | 로그인 상태에서 /login 직접 접속 → 홈 |
| 토큰 복원 | 새로고침과 직접 경로 이동 후에도 로그인 상태 유지 |
| 내 정보 수정 | 1자 닉네임 저장 불가, 정상 수정 후 헤더·프로필에 새 닉네임 표시 |
| 닉네임 캐시 | PATCH 성공 뒤 화면 전환에서 GET /members/me 추가 호출 없음 (이후 전체 새로고침의 GET과 구분) |
| 즐겨찾기 | 상세에서 추가 → 마이페이지에 파이트 클럽 표시 → 삭제 시 빈 목록 |
| 평점 | 등록 201 → 수정 200 → 삭제 200, 각 성공 후 회원 평점 GET과 UI 갱신 |
| 평점 실패 | PATCH 500 시 오류와 입력 내용 유지, 실패 해제 후 재시도 성공 |
| 즐겨찾기 미구현 | GET 404 주입 시 오류와 다시 시도 버튼, 로컬 저장으로 성공 처리하지 않음 |
| 토큰 만료 | GET /members/me 401 후 로그인 페이지 복귀 및 로그인 링크 표시 |

실제 localhost:8080 서버는 실행 중이 아니었다. 위 결과는 실제 DB 저장·JWT 검증·서버 CORS 동작을 입증하지 않는다. 실제 서버 실행 후 로그인·회원 수정·평점 연동을 다시 확인해야 하며, 즐겨찾기는 서버 구현과 DTO 합의부터 필요하다.

## 2026-11-13 실제 백엔드 연동 검증

localhost:8080 movie 백엔드(MySQL 3307)와 Vite 개발 서버(5173)로 확인했다. 테스트 계정을 새로 가입해 사용했다.

| 항목 | 결과 |
| --- | --- |
| API 직접 호출 | 회원가입 201, 로그인 200, 내 정보 조회·수정 200, 즐겨찾기 조회·등록(201)·중복 등록(409)·삭제, 평점 등록(201)·조회·수정·삭제 모두 프론트 타입과 일치 |
| 보호 경로 | 로그아웃 상태 /profile/edit → /login |
| 로그인 | 잘못된 비밀번호 시 오류 문구, 올바른 비밀번호 시 토큰 저장 후 홈 이동·헤더 닉네임 표시 |
| 즐겨찾기 | 상세에서 추가(POST 201) → 마이페이지 목록 표시 → 마이페이지에서 해제(DELETE 200) 후 목록 재조회로 빈 목록 |
| 평점 | 등록 POST 201·수정 PATCH 200·삭제 DELETE 200, 각 성공 후 GET /members/{id}/ratings 재조회, 새로고침 후에도 값 유지 |
| 닉네임 | PATCH 200 후 헤더·프로필에 즉시 반영, 이후 GET /members/me 추가 호출 없음 |

검증 중 평점 성공 문구가 보이지 않는 문제를 발견했다. 재조회 후 RatingForm이 새 key로 다시 마운트되어 문구 상태가 초기화됐다. 문구를 부모 MovieRating으로 옮겨 해결했다.
