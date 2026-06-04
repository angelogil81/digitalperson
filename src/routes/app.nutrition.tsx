import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, Card, SectionTitle } from "@/components/Shell";
import { useStore } from "@/lib/pd-store";
import { Droplets, Plus, Minus, Flame } from "lucide-react";
import { WeeklyGate } from "@/components/Premium";

export const Route = createFileRoute("/app/nutrition")({
  head: () => ({ meta: [{ title: "Alimentação · Personal Digital" }, { name: "description", content: "Sugestões de refeições e hidratação." }] }),
  component: Nutrition,
});

function Nutrition() {
  const { plan, profile } = useStore();
  const [glasses, setGlasses] = useState(0);
  if (!plan || !profile) return null;
  const glassesTarget = Math.round(plan.water / 250);
  const pct = Math.min(100, (glasses / glassesTarget) * 100);

  return (
    <Shell>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Hoje</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Sua alimentação</h1>

      <WeeklyGate
        feature="nutrition"
        title="Dieta e hidratação 1x por semana no Básico"
        description="Use seu acesso desta semana para ver o plano alimentar e controlar a hidratação de hoje, ou tenha tudo diário no Premium."
      >
      <Card className="mt-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground"><Flame className="h-4 w-4 text-orange-300" /> Meta calórica</div>
            <div className="mt-1 text-3xl font-bold tabular-nums">{plan.calories} <span className="text-sm font-normal text-muted-foreground">kcal/dia</span></div>
          </div>
          <div>
            <div className="text-right text-xs uppercase tracking-wider text-muted-foreground">Proteína</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{plan.protein}<span className="text-sm font-normal text-muted-foreground">g</span></div>
          </div>
        </div>
      </Card>

      <Card className="mt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500/20"><Droplets className="h-5 w-5 text-sky-300" /></div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Hidratação</div>
              <div className="text-base font-semibold">{(glasses*0.25).toFixed(2)} / {(plan.water/1000).toFixed(1)} L</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setGlasses(Math.max(0, glasses-1))} className="grid h-9 w-9 place-items-center rounded-xl bg-secondary"><Minus className="h-4 w-4" /></button>
            <button onClick={() => setGlasses(glasses+1)} className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Plus className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-gradient-to-r from-sky-400 to-sky-300 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">{glassesTarget} copos de 250 ml ao longo do dia.</p>
      </Card>

      <SectionTitle>Refeições do dia</SectionTitle>
      <div className="space-y-3">
        <Meal emoji="🌅" label="Café da manhã" text={plan.meals.breakfast} />
        <Meal emoji="🍽️" label="Almoço" text={plan.meals.lunch} />
        <Meal emoji="🥪" label="Lanche" text={plan.meals.snack} />
        <Meal emoji="🌙" label="Jantar" text={plan.meals.dinner} />
      </div>

      {profile.diet && profile.diet !== "Sem restrições" && (
        <Card className="mt-4">
          <p className="text-[11px] uppercase tracking-wider text-primary">Restrições consideradas</p>
          <p className="mt-1 text-sm">{profile.diet}</p>
        </Card>
      )}

      <p className="mt-6 px-2 text-center text-[11px] leading-relaxed text-muted-foreground">
        ⚕️ As sugestões são informativas. Consulte um nutricionista para um plano alimentar individualizado.
      </p>
    </Shell>
  );
}

function Meal({ emoji, label, text }: { emoji: string; label: string; text: string }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary text-2xl">{emoji}</div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">{label}</div>
          <div className="mt-1 text-sm text-foreground/90">{text}</div>
        </div>
      </div>
    </Card>
  );
}
