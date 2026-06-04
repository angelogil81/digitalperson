import { Link } from "@tanstack/react-router";
import { Crown, Lock, Sparkles } from "lucide-react";
import { useStore } from "@/lib/pd-store";

export function usePremium() {
  const { plan } = useStore();
  return plan?.tier === "premium";
}

export function AdBanner({ slot = "Anúncio" }: { slot?: string }) {
  const isPremium = usePremium();
  if (isPremium) return null;
  return (
    <div className="my-4 rounded-2xl border border-dashed border-border/60 bg-secondary/40 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Publicidade
          </div>
          <div className="mt-1 text-sm font-medium text-foreground/80">{slot}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Espaço reservado para anúncio (AdMob / AdSense).
          </p>
        </div>
        <Link
          to="/app/subscription"
          className="shrink-0 rounded-full bg-primary/15 px-3 py-1.5 text-[11px] font-semibold text-primary"
        >
          Remover anúncios
        </Link>
      </div>
    </div>
  );
}

export function PremiumLock({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-6 text-center">
      <div className="bg-gradient-lime mx-auto grid h-14 w-14 place-items-center rounded-3xl shadow-lime">
        <Lock className="h-6 w-6 text-primary-foreground" />
      </div>
      <h2 className="mt-4 text-xl font-bold tracking-tight">{title}</h2>
      <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">{description}</p>
      <ul className="mx-auto mt-5 max-w-xs space-y-2 text-left text-sm">
        <Bullet>Plano semanal completo de treino</Bullet>
        <Bullet>Sugestões alimentares e hidratação</Bullet>
        <Bullet>Evolução com gráfico e histórico</Bullet>
        <Bullet>Sem anúncios</Bullet>
      </ul>
      <Link
        to="/app/subscription"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lime"
      >
        <Crown className="h-4 w-4" /> Desbloquear com Premium
      </Link>
      <p className="mt-3 text-[11px] text-muted-foreground">7 dias grátis · cancele quando quiser</p>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span>{children}</span>
    </li>
  );
}
