import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { getAuth, getProfile } from "@/lib/pd-store";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!getAuth()) { navigate({ to: "/auth" }); return; }
    if (!getProfile()) { navigate({ to: "/onboarding" }); return; }
  }, [navigate]);

  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
}
