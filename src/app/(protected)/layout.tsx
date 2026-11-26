import type { ReactNode } from "react";
import { AuthenticatedLayout } from "../../components/layout/authenticated-layout";

// Route Group (protected): URL에는 포함되지 않고, 로그인이 필요한 페이지에 공통 레이아웃을 적용한다.
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
