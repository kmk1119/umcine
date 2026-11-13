import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";
import { AuthenticatedLayout } from "../../components/layout/authenticated-layout";

export const Route = createFileRoute("/(protected)/_authenticated")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) throw redirect({ to: "/login" });
  },
  component: AuthenticatedLayout,
});
