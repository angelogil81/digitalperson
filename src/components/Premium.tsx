import { Link } from "@tanstack/react-router";
import { Crown, Lock, Sparkles, Calendar } from "lucide-react";
import {
  useStore,
  unlockBasicFeature,
  isBasicFeatureUnlocked,
  type BasicFeature,
} from "@/lib/pd-store";

export function usePremium() {
  const { plan } = useStore();
  return plan?.tier === "premium";
}

/**
 * Fixed footer ad banner (320x50). Sits above the BottomNav.
 * Hidden for premium users.
 */
export function AdFooter() {
  const isPremium = usePremium();
  if (isPremium) return null;
  return (
    <div className="fixed inset-x-0 bottom-[80px] z-30 mx-auto flex w-full max-w-md justify-center px-4">
      <Link
        to="/app/subscription"
        className="flex h-[50px] w-[320px] items-center justify-between gap-3 rounded-xl border border-dashed border-border/60 bg-secondary/80 px-3 backdrop-blur"
      >
        <span className="rounded-md bg-background/60 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          Anúncio
        </span>
        <span className="flex-1 truncate text-[11px] font-medium text-foreground/80">
          Remova anúncios com o Premium
        </span>
        <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
          Assinar
        </span>
      </Link>
    </div>
  );
}

/**
 * Weekly gate for the Basic plan.
 * Basic users get 1 access per week per feature; on use, content unlocks for the
 * rest of the ISO week. Premium users always see children.
 */
export function WeeklyGate({
  feature,
  title,
  description,
  children,
}: {
  feature: BasicFeature;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const { plan } = useStore();
  const isPremium = plan?.tier === "premium";
  const unlocked = isBasicFeatureUnlocked(plan, feature);

  if (isPremium || unlocked) {
    return (
      <>
        {!isPremium && <WeeklyActiveBadge />}
        {children}
      </>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-6 text-center">
      <div className="bg-gradient-lime mx-auto grid h-14 w-14 place-items-center rounded-3xl shadow-lime">
        <Lock className="h-6 w-6 text-primary-foreground" />
      </div>
      <h2 className="mt-4 text-xl font-bold tracking-tight">{title}</h2>
      <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">{description}</p>

      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Calendar className="h-3.5 w-3.5 text-primary" />
        Plano Básico: <span className="font-semibold text-foreground">1 acesso por semana</span>
      </div>

      <button
        onClick={() => unlockBasicFeature(feature)}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lime transition active:scale-[0.98]"
      >
        Usar meu acesso desta semana
      </button>

      <Link
        to="/app/subscription"
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 py-3 text-sm font-semibold text-primary"
      >
        <Crown className="h-4 w-4" /> Liberar uso diário · Premium R$ 29,90
      </Link>
      <ul className="mx-auto mt-5 max-w-xs space-y-2 text-left text-sm">
        <Bullet>Treino, dieta, hidratação e evolução diários</Bullet>
        <Bullet>Plano semanal completo</Bullet>
        <Bullet>Sem anúncios</Bullet>
        <Bullet>Pagamento único · vitalício</Bullet>
      </ul>
    </div>
  );
}

function WeeklyActiveBadge() {
  return (
    <div className="mb-3 flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-3 py-2 text-[11px] text-primary">
      <Sparkles className="h-3.5 w-3.5" />
      <span className="font-semibold">Acesso desta semana ativo</span>
      <Link to="/app/subscription" className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 font-bold">
        Premium
      </Link>
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
