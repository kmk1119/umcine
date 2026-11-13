# 8주차 필수 미션 기록

## 1. 로그인 전용 폴더 만들기 (Route Group + Layout Route)

`(protected)` 폴더는 Route Group이라 URL에 포함되지 않는다. 그 안에 pathless Layout Route `_authenticated`를 두고, 마이페이지와 내 정보 수정 페이지를 하위 라우트로 묶었다. URL은 기존과 같은 `/profile`, `/profile/edit`이다.

```
src/routes/
├── (protected)/
│   ├── _authenticated.tsx            # 공통 Layout Route
│   └── _authenticated/
│       ├── profile.tsx               # /profile
│       └── profile_.edit.tsx         # /profile/edit
├── login.tsx
└── ...
```

```tsx
// src/routes/(protected)/_authenticated.tsx
export const Route = createFileRoute("/(protected)/_authenticated")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) throw redirect({ to: "/login" });
  },
  component: AuthenticatedLayout,
});
```

```tsx
// src/components/layout/authenticated-layout.tsx
export function AuthenticatedLayout() {
  const token = useAuthStore((state) => state.accessToken);
  const me = useMeQuery();
  if (!token) return <Navigate to="/login" />;
  if (me.isPending) return <main role="status">내 정보를 불러오는 중이에요.</main>;
  if (me.isError) return <main><RequestError message="내 정보를 불러오지 못했어요." onRetry={() => void me.refetch()} /></main>;
  return <Outlet />;
}
```

- `beforeLoad`는 페이지를 그리기 전에 토큰을 검사하고, 토큰이 없으면 `/login`으로 보낸다.
- 페이지에 머무는 중 401 응답으로 토큰이 지워지면 Layout 컴포넌트가 다시 로그인 페이지로 이동시킨다.
- 내 정보 조회가 끝난 뒤에만 `<Outlet />`으로 하위 페이지를 렌더링한다. 하위 페이지에서는 로딩과 오류 분기를 반복하지 않는다.

## 2. 남은 API 연결하기

### 2-1. 공통 응답 처리

```ts
// src/api/response.ts
export interface ApiResponse<T> { isSuccess: boolean; code: string; message: string; result: T }

export async function readResult<T>(request: Promise<ApiResponse<T>>): Promise<T> {
  const response = await request;
  if (!response.isSuccess) throw new Error(response.message || "요청에 실패했어요.");
  return response.result;
}
```

모든 API는 `{ isSuccess, code, message, result }` 형태로 응답한다. `readResult`로 `result`만 꺼내고, `isSuccess`가 false이면 오류를 던진다. 그래서 mutation의 `onError`와 `isError`가 그 실패를 처리할 수 있다.

### 2-2. 즐겨찾기 (마이페이지, 영화 상세)

```ts
// src/api/favorites.ts — 백엔드 FavoriteResponse·FavoriteStatusResponse DTO와 같은 형태
export interface Favorite { favoriteId: number; movieId: number; createdAt: string }
export interface FavoriteStatus { isFavorite: boolean }

export function getFavorites(signal?: AbortSignal) {
  return readResult(authApi.get("favorites", { signal }).json<ApiResponse<Favorite[]>>());
}
export function getFavorite(movieId: number, signal?: AbortSignal) {
  return readResult(authApi.get(`favorites/${movieId}`, { signal }).json<ApiResponse<FavoriteStatus>>());
}
export function addFavorite(movieId: number) {
  return readResult(authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>());
}
export function deleteFavorite(movieId: number) {
  return readResult(authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>());
}
```

```ts
// src/hooks/use-favorites.ts
export function useFavoriteMutation(movieId: number) {
  const client = useQueryClient();
  const token = useAuthStore((state) => state.accessToken);
  return useMutation({
    mutationKey: ["favorite-toggle", movieId],
    mutationFn: async (isFavorite: boolean) => {
      if (isFavorite) await deleteFavorite(movieId);
      else await addFavorite(movieId);
      return !isFavorite;
    },
    onSuccess: async (isFavorite) => {
      if (useAuthStore.getState().accessToken !== token) return;
      await client.cancelQueries({ queryKey: ["favorites", "detail", movieId] });
      client.setQueryData(["favorites", "detail", movieId], { isFavorite });   // 상세: 직접 갱신
      await client.invalidateQueries({ queryKey: ["favorites", "list"] });     // 목록: 재조회
    },
  });
}
```

- 영화 상세의 북마크 버튼은 `GET /favorites/{movieId}`로 현재 상태를 조회한다. 버튼을 누르면 `POST` 또는 `DELETE`를 보낸다.
- 성공한 뒤에는 결과가 확실한 상세 상태를 `setQueryData`로 바꾼다. 목록은 서버 순서와 내용을 따라야 하므로 `invalidateQueries`로 다시 조회한다.
- 마이페이지는 `GET /favorites`로 받은 `movieId` 목록을 사용한다. 각 영화의 제목과 포스터는 TMDB 상세 API로 조회해 표시한다.
- 같은 영화에 대한 요청이 중복되지 않도록 `useIsMutating({ mutationKey })`로 진행 중인 요청을 확인하고 버튼을 비활성화한다.

### 2-3. 평점 (영화 상세)

```ts
// src/api/ratings.ts
export function getMemberRatings(memberId: number, signal?: AbortSignal) {
  return apiClient.get(`members/${memberId}/ratings`, { signal }).json<Rating[]>();
}
export function createRating(body: RatingInput & { movieId: number }) {
  return readResult(authApi.post("ratings", { json: body }).json<ApiResponse<Rating>>());
}
export function updateRating(ratingId: number, body: RatingInput) {
  return readResult(authApi.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<Rating>>());
}
export function deleteRating(ratingId: number) {
  return readResult(authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>());
}
```

```tsx
// src/components/movie-rating.tsx (핵심 부분)
const memberId = getMemberId(token); // JWT의 sub에서 memberId를 꺼낸다
const ratings = useQuery({
  queryKey: ["ratings", memberId],
  queryFn: ({ signal }) => getMemberRatings(memberId!, signal),
  enabled: Boolean(token && memberId),
});
const rating = ratings.data.find((item) => item.movieId === movieId);

const mutation = useMutation({
  mutationFn: async (action: { type: "save"; body: RatingInput } | { type: "delete" }) => {
    if (action.type === "delete") { await deleteRating(rating!.ratingId); return "평점을 삭제했어요."; }
    if (rating) await updateRating(rating.ratingId, action.body);
    else await createRating({ movieId, ...action.body });
    return rating ? "평점을 수정했어요." : "평점을 등록했어요.";
  },
  onSuccess: async (result) => {
    setMessage(result);
    await client.invalidateQueries({ queryKey: ["ratings", memberId] });
  },
});
```

- `GET /members/{memberId}/ratings`에는 회원 번호가 필요하다. 로그인 응답에는 회원 번호가 없으므로 토큰의 `sub` 값에서 꺼냈다. 이 값은 조회 경로에만 쓰고, 인증과 소유권 검사는 서버가 한다.
- 회원 평점 목록에서 현재 영화의 평점을 찾는다. 평점이 없으면 `POST /ratings`로 등록하고, 있으면 `PATCH /ratings/{ratingId}`로 수정하거나 `DELETE`로 삭제한다.
- 성공한 뒤에는 `invalidateQueries`로 회원 평점 목록을 다시 조회한다. 응답에는 평점 하나만 들어 있으므로, 목록 전체는 서버 기준으로 다시 맞추는 편이 안전하다.
- 실패하면 입력한 별점과 후기를 그대로 남겨 두고 오류 문구를 보여 준다. 사용자는 바로 다시 제출할 수 있다.
- 성공 문구는 부모 `MovieRating`의 상태로 관리한다. 목록을 다시 조회하면 폼이 새 `key`로 다시 마운트되는데, 문구를 폼 안에 두면 그때 함께 사라지기 때문이다.

```tsx
// MovieRating (부모)
const [notice, setNotice] = useState<{ movieId: number; text: string } | null>(null);
return <RatingForm key={`${memberId}:${movieId}:${rating?.updatedAt ?? "new"}:${rating?.ratingId ?? "new"}`}
  movieId={movieId} memberId={memberId} rating={rating}
  message={notice?.movieId === movieId ? notice.text : ""}
  setMessage={(text) => setNotice(text ? { movieId, text } : null)} />;
```

### 2-4. 로그아웃·토큰 변경 시 캐시 정리

```ts
// src/main.tsx
useAuthStore.subscribe((state, previous) => {
  if (state.accessToken === previous.accessToken) return;
  const filters = { predicate: (query: { queryKey: readonly unknown[] }) =>
    ["members", "favorites", "ratings"].includes(String(query.queryKey[0])) };
  void queryClient.cancelQueries(filters);
  queryClient.removeQueries(filters);
});
```

로그아웃하거나 다른 계정으로 로그인하면 이전 사용자의 회원 정보, 즐겨찾기와 평점 캐시가 남지 않도록 지운다. 공개 데이터인 영화 캐시는 유지한다.

## 최종 확인 결과

실제 movie 백엔드(localhost:8080)와 Vite 개발 서버(localhost:5173)를 실행해 브라우저에서 확인했다.

- `pnpm build`(tsc + vite build)와 `pnpm lint`(oxlint)가 오류 없이 통과한다.
- 로그아웃 상태에서 `/profile/edit`에 직접 접속하면 `/login`으로 이동한다.
- 잘못된 비밀번호로 로그인하면 "이메일 또는 비밀번호를 확인해 주세요."가 표시된다. 올바르게 로그인하면 토큰이 `localStorage`에 저장되고 홈으로 이동하며, 헤더에 닉네임이 표시된다.
- 로그인한 상태에서 `/profile`과 `/profile/edit`은 공통 Layout을 거쳐 `<Outlet />` 위치에 렌더링된다.
- 영화 상세에서 북마크를 추가하면 `POST /favorites`가 201을 반환하고, 마이페이지 목록에 "파이트 클럽"이 표시된다. 마이페이지에서 해제하면 `DELETE /favorites/550`이 200을 반환하고, 목록을 다시 조회해 빈 목록이 된다.
- 평점 등록은 `POST /ratings` 201, 수정은 `PATCH /ratings/{id}` 200, 삭제는 `DELETE` 200을 반환한다. 각 요청이 성공하면 `GET /members/{memberId}/ratings`로 목록을 다시 조회하고 성공 문구를 보여 준다. 새로고침한 뒤에도 수정한 별점이 그대로 남아 있다.
- 닉네임을 수정하면 `PATCH /members/me` 200 이후 `GET /members/me`를 다시 보내지 않는다. 그런데도 헤더와 마이페이지에 새 닉네임이 바로 반영된다.
