import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, Card, SectionTitle } from "@/components/Shell";
import { useStore, setAuth, setProfile, setPlan, syncUserScope, SUPPORT_EMAIL } from "@/lib/pd-store";
import { supabase } from "@/integrations/supabase/client";
import {
  ChevronRight, LogOut, RefreshCw, Crown, Bell, Shield, HelpCircle,
  X, Mail, FileText, Trash2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "Perfil · Personal Digital" }, { name: "description", content: "Seus dados e preferências." }] }),
  component: ProfilePage,
});

type Sheet = null | "privacy" | "help" | "terms" | "wipe";

function ProfilePage() {
  const { profile, plan } = useStore();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [notifState, setNotifState] = useState<NotificationPermission | "unsupported" | "idle">(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported"
  );

  if (!profile || !plan) return null;

  async function logout() {
    await supabase.auth.signOut().catch(() => {});
    syncUserScope(null);
    setAuth(null); setProfile(null); setPlan(null);
    navigate({ to: "/" });
  }
  function redo() {
    setPlan(null); setProfile(null);
    navigate({ to: "/onboarding" });
  }
  function wipeData() {
    setPlan(null); setProfile(null);
    setSheet(null);
    toast.success("Dados apagados. Refaça o questionário.");
    navigate({ to: "/onboarding" });
  }

  async function requestNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Seu navegador não suporta notificações.");
      return;
    }
    const perm = await Notification.requestPermission();
    setNotifState(perm);
    if (perm === "granted") {
      new Notification("Personal Digital", { body: "Notificações ativadas! Vamos te lembrar dos seus treinos." });
      toast.success("Notificações ativadas.");
    } else if (perm === "denied") {
      toast.error("Permissão negada. Habilite nas configurações do navegador.");
    }
  }

  const notifLabel =
    notifState === "granted" ? "Notificações ativas"
    : notifState === "denied" ? "Notificações bloqueadas"
    : notifState === "unsupported" ? "Sem suporte no navegador"
    : "Ativar notificações";

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
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-primary">Objetivo atual</div>
            <div className="mt-1 text-lg font-bold">{plan.goalLabel}</div>
          </div>
          <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${plan.tier === "premium" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
            {plan.tier === "premium" ? "Premium" : "Básico"}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <Stat label="Idade" value={`${profile.age}`} />
          <Stat label="Altura" value={`${profile.height}cm`} />
          <Stat label="Peso" value={`${profile.weight}kg`} />
        </div>
      </Card>

      {plan.tier !== "premium" && (
        <Link to="/app/subscription" className="mt-3 block">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 to-card p-5">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-primary" />
              <div>
                <div className="font-semibold">Tornar-se Premium</div>
                <div className="text-xs text-muted-foreground">Pagamento único vitalício</div>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </Link>
      )}

      <SectionTitle>Plano & dados</SectionTitle>
      <Card className="!p-2">
        <Row icon={RefreshCw} label="Refazer questionário" sub="Recalcular seu plano do zero" onClick={redo} />
        <Row icon={Bell} label={notifLabel} sub="Lembretes de treino e hidratação" onClick={requestNotifications} />
        <Row icon={Shield} label="Privacidade" sub="Como usamos seus dados" onClick={() => setSheet("privacy")} />
        <Row icon={FileText} label="Termos de uso" sub="Regras e responsabilidades" onClick={() => setSheet("terms")} />
        <Row icon={HelpCircle} label="Ajuda & suporte" sub="Fale com a equipe" onClick={() => setSheet("help")} />
        <Row icon={Trash2} label="Apagar meus dados" sub="Remove plano e questionário deste dispositivo" onClick={() => setSheet("wipe")} danger />
      </Card>

      <button onClick={logout} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 py-3.5 text-sm font-semibold text-destructive-foreground">
        <LogOut className="h-4 w-4" /> Sair da conta
      </button>

      <p className="mt-6 px-2 text-center text-[11px] leading-relaxed text-muted-foreground">
        ⚕️ Personal Digital fornece sugestões gerais de bem-estar e não substitui acompanhamento médico, nutricional ou de educação física. Não promete cura, diagnóstico ou resultado garantido.
      </p>

      {sheet === "privacy" && (
        <Sheet title="Privacidade" onClose={() => setSheet(null)}>
          <p>Seus dados de perfil (nome, medidas, objetivos) e plano ficam <strong>salvos localmente no seu dispositivo</strong>. Utilizamos apenas seu e-mail para autenticação segura da conta.</p>
          <p>Não vendemos, alugamos ou compartilhamos seus dados com terceiros. Não usamos suas informações pessoais para publicidade.</p>
          <p>Você pode apagar todos os seus dados a qualquer momento na opção <em>“Apagar meus dados”</em> ou solicitar a exclusão da conta pelo suporte.</p>
        </Sheet>
      )}
      {sheet === "terms" && (
        <Sheet title="Termos de uso" onClose={() => setSheet(null)}>
          <p>O Personal Digital oferece sugestões automáticas de treino, alimentação e hábitos com finalidade educacional e de bem-estar geral.</p>
          <p>O conteúdo <strong>não substitui</strong> avaliação médica, nutricional ou de um educador físico. Consulte um profissional antes de iniciar qualquer programa, especialmente em caso de lesões, gestação ou condições de saúde.</p>
          <p>Ao usar o app você confirma estar ciente dos riscos inerentes à prática de atividade física e assume responsabilidade pela sua execução.</p>
        </Sheet>
      )}
      {sheet === "help" && (
        <Sheet title="Ajuda & suporte" onClose={() => setSheet(null)}>
          <p>Precisa de ajuda? Envie um e-mail para nossa equipe. Respondemos em até 48h úteis.</p>
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Suporte · Personal Digital")}&body=${encodeURIComponent(`Olá, equipe Personal Digital,\n\nUsuário: ${profile.name} (${profile.email || "sem email"})\n\n`)}`}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lime"
          >
            <Mail className="h-4 w-4" /> {SUPPORT_EMAIL}
          </a>
          <div className="mt-2 text-xs text-muted-foreground">
            <p><strong>Dicas rápidas:</strong></p>
            <ul className="mt-1 list-disc pl-4 space-y-1">
              <li>Puxe a tela para atualizar quando dados não aparecerem.</li>
              <li>Refazer o questionário gera um plano totalmente novo.</li>
              <li>Ative as notificações para lembretes diários.</li>
            </ul>
          </div>
        </Sheet>
      )}
      {sheet === "wipe" && (
        <Sheet title="Apagar meus dados?" onClose={() => setSheet(null)}>
          <p>Isso remove seu <strong>plano, questionário e progresso</strong> deste dispositivo. Sua conta continua ativa.</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => setSheet(null)} className="flex-1 rounded-2xl border border-border py-3 text-sm font-medium">Cancelar</button>
            <button onClick={wipeData} className="flex-1 rounded-2xl bg-destructive py-3 text-sm font-semibold text-destructive-foreground">Apagar</button>
          </div>
        </Sheet>
      )}
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-secondary/60 py-3">
    <div className="text-base font-bold tabular-nums">{value}</div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
  </div>;
}
function Row({ icon: Icon, label, sub, onClick, danger }: { icon: typeof RefreshCw; label: string; sub?: string; onClick?: () => void; danger?: boolean }) {
  return <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left transition hover:bg-secondary/60 ${danger ? "text-destructive-foreground" : ""}`}>
    <Icon className={`h-5 w-5 ${danger ? "text-destructive" : "text-muted-foreground"}`} />
    <span className="flex-1">
      <span className="block text-sm font-medium">{label}</span>
      {sub && <span className="block text-[11px] text-muted-foreground">{sub}</span>}
    </span>
    <ChevronRight className="h-4 w-4 text-muted-foreground" />
  </button>;
}
function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-auto w-full max-w-md rounded-t-3xl border border-border bg-card p-5 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Fechar" className="rounded-full p-1.5 hover:bg-secondary">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}
