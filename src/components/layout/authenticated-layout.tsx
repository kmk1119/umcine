import { Navigate, Outlet } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";
import { useMeQuery } from "../../hooks/use-me-query";
import { RequestError } from "../movies/request-error";
export function AuthenticatedLayout() {
  const token = useAuthStore((state) => state.accessToken);
  const me = useMeQuery();
  if (!token) return <Navigate to="/login" />;
  if (me.isPending) return <main role="status" className="p-10 text-center">내 정보를 불러오는 중이에요.</main>;
  if (me.isError) return <main><RequestError message="내 정보를 불러오지 못했어요." onRetry={() => void me.refetch()} /></main>;
  return <Outlet />;
}
