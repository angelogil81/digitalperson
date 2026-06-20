import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { AdFooter } from "@/components/Premium";
import { getProfile, setAuth } from "@/lib/pd-store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setAuth(null);
        navigate({ to: "/auth" });
      } else {
        setAuth({
          email: session.user.email ?? "",
          name:
            (session.user.user_metadata?.name as string) ??
            (session.user.user_metadata?.full_name as string) ??
            session.user.email?.split("@")[0] ?? "",
        });
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      setAuth({
        email: data.session.user.email ?? "",
        name:
          (data.session.user.user_metadata?.name as string) ??
          (data.session.user.user_metadata?.full_name as string) ??
          data.session.user.email?.split("@")[0] ?? "",
      });
      if (!getProfile()) {
        navigate({ to: "/onboarding" });
        return;
      }
      setChecked(true);
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  if (!checked) return null;

  return (
    <>
      <Outlet />
      <AdFooter />
      <BottomNav />
    </>
  );
}
