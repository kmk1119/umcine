import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../../../pages/profile/profile-page";
export const Route = createFileRoute("/(protected)/_authenticated/profile")({ component: ProfilePage });
