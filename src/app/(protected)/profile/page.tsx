import type { Metadata } from "next";
import { ProfilePage } from "../../../views/profile/profile-page";

export const metadata: Metadata = { title: "마이페이지", robots: { index: false } };

// 로그인 확인 전에는 보호 레이아웃이 children을 그리지 않는다. localStorage 토큰에 의존하는 화면이라
// 즉시 이동용 정적 화면을 검증할 수 없으므로 instant navigation 검증에서 제외한다.
export const instant = false;

export default function Page() {
  return <ProfilePage />;
}
