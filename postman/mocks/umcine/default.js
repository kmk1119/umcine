// Local-only stand-in. Login/me/ratings follow ../movie source; favorites are provisional.
const http = require("http");
const token = `eyJhbGciOiJub25lIn0.${Buffer.from(JSON.stringify({ sub: "1" })).toString("base64url")}.test-only`;
let pending = Promise.resolve();
http.createServer(async (req, res) => {
  const previous = pending;
  let release;
  pending = new Promise(resolve => { release = resolve; });
  await previous;
  res.once("finish", release);
  res.once("close", release);
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  const path = req.url.split("?")[0];
  const method = req.method;
  const body = req.body || {};
  const state = await pm.state.get("umcine:data") || {
    member: { email: "study@example.com", nickname: "영화친구", createdAt: "2026-11-11T12:00:00" },
    favorites: [], ratings: [], expire: false, failRating: false, favoritesMissing: false, requests: [],
  };
  const send = (status, data, raw = false) => {
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(raw ? data : { isSuccess: status < 400, code: `COMMON${status}`, message: status < 400 ? "성공" : String(data), result: status < 400 ? data : null }));
  };
  const save = () => pm.state.set("umcine:data", state);
  if (path === "/__control" && method === "POST") {
    Object.assign(state, body); await save(); return send(200, null);
  }
  if (path === "/__state") return send(200, state);
  state.requests.push(`${method} ${path}`);
  await save();
  // Delay demonstrates pending/duplicate-submit behavior.
  await new Promise(resolve => setTimeout(resolve, 150));
  if (path === "/auth/login" && method === "POST") {
    if (body.password !== "Study123!") return send(401, "이메일 또는 비밀번호를 확인해 주세요.");
    return send(200, { nickname: state.member.nickname, accessToken: token });
  }
  if (/^\/members\/(email|nickname)\//.test(path)) return send(200, { available: true }, true);
  if (path === "/members" && method === "POST") return send(201, { memberId: 2, email: body.email, nickname: body.nickname });
  if (path === "/members/1/ratings" && method === "GET") return send(200, state.ratings, true);
  if (state.expire || req.headers.authorization !== `Bearer ${token}`) return send(401, "로그인이 만료됐어요.");
  if (path === "/members/me") {
    if (method === "PATCH") {
      if (!body.nickname || body.nickname.trim().length < 2 || body.nickname.trim().length > 12) return send(400, "닉네임은 2~12자입니다.");
      state.member.nickname = body.nickname; await save();
    }
    return send(200, state.member);
  }
  if (path.startsWith("/favorites") && state.favoritesMissing) return send(404, "즐겨찾기 API 미구현");
  if (path === "/favorites") {
    if (method === "POST") {
      if (state.favorites.some(x => x.movieId === body.movieId)) return send(409, "이미 추가한 영화입니다.");
      state.favorites.push({ movieId: body.movieId }); await save(); return send(201, null);
    }
    return send(200, state.favorites);
  }
  if (/^\/favorites\/\d+$/.test(path)) {
    const movieId = Number(path.split("/")[2]);
    if (method === "DELETE") { state.favorites = state.favorites.filter(x => x.movieId !== movieId); await save(); return send(200, null); }
    return send(200, { isFavorite: state.favorites.some(x => x.movieId === movieId) });
  }
  if (path.startsWith("/ratings")) {
    if (state.failRating) return send(500, "테스트용 평점 저장 실패");
    const ratingId = Number(path.split("/")[2]);
    const index = state.ratings.findIndex(x => x.ratingId === ratingId);
    if (method !== "POST" && index < 0) return send(404, "평점이 없습니다.");
    if (method === "DELETE") { state.ratings.splice(index, 1); await save(); return send(200, null); }
    if (!Number.isInteger(body.score) || body.score < 1 || body.score > 5 || (body.comment || "").length > 500) return send(400, "평점 형식 오류");
    if (method === "POST" && state.ratings.some(x => x.movieId === body.movieId)) return send(409, "이미 평점을 등록했습니다.");
    const now = new Date().toISOString();
    const rating = method === "POST" ? { ratingId: Date.now(), movieId: body.movieId, createdAt: now } : state.ratings[index];
    Object.assign(rating, { score: body.score, comment: body.comment, updatedAt: now });
    if (method === "POST") state.ratings.push(rating);
    await save(); return send(method === "POST" ? 201 : 200, rating);
  }
  return send(501, "이 테스트에서 모델링하지 않은 API입니다.");
}).listen(process.env.PORT || 4010);
