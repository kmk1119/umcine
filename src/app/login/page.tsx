import type { Metadata } from "next";
import { LoginPage } from "../../views/auth/login-page";

// page.tsx는 Server Component로 두어 metadata를 export하고, 폼은 Client Component로 분리했다.
export const metadata: Metadata = { title: "로그인" };

export default function Page() {
  return <LoginPage />;
}
