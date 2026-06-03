import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Shell, Card, SectionTitle } from "@/components/Shell";
import { useStore, setAuth, setProfile, setPlan } from "@/lib/pd-store";
import { ChevronRight, LogOut, RefreshCw, Crown, Bell, Shield, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "Perfil · Personal Digital" }, { name: "description", content: "Seus dados e preferências." }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, plan } = useStore();
  const navigate = useNavigate();
  if (!profile || !plan) return null;

  function logout() {
    setAuth(null); setProfile(null); setPlan(null);
    navigate({ to: "/" });
  }
  function redo() {
    setPlan(null); setProfile(null);
    navigate({ to: "/onboarding" });
  }

  return (
    <Shell>
      <div className="flex items-center gap-4">
        <div className="bg-gradient-lime grid h-16 w-16 place-items-center rounded-3xl text-2xl font-bold text-primary-foreground shadow-lime">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">{profile.email || "convidado"}</p>
        </div>
      </div>

      <Card className="mt-5">
        <div className="text-[11px] uppercase tracking-wider text-primary">Objetivo atual</div>
        <div className="mt-1 text-lg font-bold">{plan.goalLabel}</div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <Stat label="Idade" value={`${profile.age}`} />
          <Stat label="Altura" value={`${profile.height}cm`} />
          <Stat label="Peso" value={`${profile.weight}kg`} />
        </div>
      </Card>

      <Link to="/app/subscription" className="mt-3 block">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 to-card p-5">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-primary" />
            <div>
              <div className="font-semibold">Tornar-se Premium</div>
              <div className="text-xs text-muted-foreground">Relatórios, ajustes e mais</div>
            </div>
            <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </Link>

      <SectionTitle>Plano & dados</SectionTitle>
      <Card className="!p-2">
        <Row icon={RefreshCw} label="Refazer questionário" onClick={redo} />
        <Row icon={Bell} label="Notificações" />
        <Row icon={Shield} label="Privacidade" />
        <Row icon={HelpCircle} label="Ajuda & suporte" />
      </Card>

      <button onClick={logout} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 py-3.5 text-sm font-semibold text-destructive-foreground">
        <LogOut className="h-4 w-4" /> Sair da conta
      </button>

      <p className="mt-6 px-2 text-center text-[11px] leading-relaxed text-muted-foreground">
        ⚕️ Personal Digital fornece sugestões gerais de bem-estar e não substitui acompanhamento médico, nutricional ou de educação física. Não promete cura, diagnóstico ou resultado garantido.
      </p>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-secondary/60 py-3">
    <div className="text-base font-bold tabular-nums">{value}</div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
  </div>;
}
function Row({ icon: Icon, label, onClick }: { icon: typeof RefreshCw; label: string; onClick?: () => void }) {
  return <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left hover:bg-secondary/60">
    <Icon className="h-5 w-5 text-muted-foreground" />
    <span className="flex-1 text-sm font-medium">{label}</span>
    <ChevronRight className="h-4 w-4 text-muted-foreground" />
  </button>;
}
