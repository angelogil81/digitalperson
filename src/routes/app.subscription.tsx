import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, Card } from "@/components/Shell";
import { Check, ArrowLeft, Crown } from "lucide-react";
import { getPlan, setPlan } from "@/lib/pd-store";

export const Route = createFileRoute("/app/subscription")({
  head: () => ({ meta: [{ title: "Planos · Personal Digital" }, { name: "description", content: "Escolha seu plano." }] }),
  component: Subscription,
});

const tiers = [
  {
    id: "basic" as const,
    name: "Básico",
    price: "Grátis",
    sub: "para sempre · com anúncios",
    features: [
      "1 treino por semana",
      "1 dieta por semana",
      "1 hidratação por semana",
      "1 evolução por semana",
      "1 alimentação por semana",
      "Com banner de anúncios",
    ],
  },
  {
    id: "premium" as const,
    name: "Premium",
    price: "R$ 29,90",
    sub: "pagamento único · vitalício",
    badge: "Mais escolhido",
    features: [
      "Tudo do Básico, sem limite semanal",
      "Treino diário ilimitado",
      "Dieta e hidratação diárias",
      "Plano semanal completo",
      "Evolução com gráfico e histórico",
      "Sem anúncios",
      "Atualizações futuras incluídas",
      "Suporte prioritário",
    ],
  },
];

function Subscription() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<"basic" | "premium">("premium");

  function activate() {
    const p = getPlan(); if (!p) return;
    p.tier = selected; setPlan(p);
    navigate({ to: "/app" });
  }

  return (
    <Shell>
      <button onClick={() => navigate({ to: "/app/profile" })} className="flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="mt-6 text-center">
        <div className="bg-gradient-lime mx-auto grid h-14 w-14 place-items-center rounded-3xl shadow-lime">
          <Crown className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Acelere seus resultados</h1>
        <p className="mt-2 text-sm text-muted-foreground">Pague uma vez e tenha acesso vitalício a tudo.</p>
      </div>

      <div className="mt-6 space-y-3">
        {tiers.map((t) => {
          const active = selected === t.id;
          const isPremium = t.id === "premium";
          return (
            <button key={t.id} onClick={() => setSelected(t.id)} className={`w-full rounded-3xl border p-5 text-left transition-all ${
              active ? "border-primary shadow-lime" : "border-border/60"
            } ${isPremium ? "bg-gradient-to-br from-primary/15 via-card to-card" : "bg-card"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{t.name}</h3>
                    {t.badge && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">{t.badge}</span>}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{t.price}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.sub}</p>
                </div>
                <div className={`grid h-6 w-6 place-items-center rounded-full border-2 ${active ? "border-primary bg-primary" : "border-border"}`}>
                  {active && <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />}
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <Card className="mt-5 !p-4 text-center">
        <p className="text-xs text-muted-foreground">Pagamento único de R$ 29,90 · acesso vitalício · sem mensalidade</p>
      </Card>

      <button onClick={activate} className="mt-5 w-full rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lime transition active:scale-[0.98]">
        {selected === "premium" ? "Pagar R$ 29,90 e liberar tudo" : "Continuar no Básico"}
      </button>

      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        Integração futura com gateway de pagamento (Stripe / RevenueCat).
      </p>
    </Shell>
  );
}
