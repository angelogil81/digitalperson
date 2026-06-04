import { createFileRoute } from "@tanstack/react-router";
import { Shell, Card, SectionTitle } from "@/components/Shell";
import { useStore } from "@/lib/pd-store";
import { Moon, Dumbbell } from "lucide-react";
import { PremiumLock } from "@/components/Premium";

export const Route = createFileRoute("/app/week")({
  head: () => ({ meta: [{ title: "Plano semanal · Personal Digital" }, { name: "description", content: "Veja sua divisão da semana." }] }),
  component: Week,
});

function Week() {
  const { plan } = useStore();
  if (!plan) return null;
  const dayIdx = (new Date().getDay() + 6) % 7;

  if (plan.tier !== "premium") {
    return (
      <Shell>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Sua divisão</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Plano semanal</h1>
        <PremiumLock
          title="Plano semanal é Premium"
          description="No plano Básico você acessa apenas o treino diário. Desbloqueie a semana inteira no Premium."
        />
      </Shell>
    );
  }

  return (
    <Shell>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Sua divisão</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Plano semanal</h1>
      <p className="mt-2 text-sm text-muted-foreground">Foco: <span className="text-foreground">{plan.goalLabel}</span></p>

      <SectionTitle>7 dias</SectionTitle>
      <div className="space-y-3">
        {plan.week.map((d, i) => (
          <Card key={d.day} className={i === dayIdx ? "border-primary/60" : ""}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{d.day}</span>
                  {i === dayIdx && <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">Hoje</span>}
                </div>
                <h3 className="mt-1 text-lg font-bold">{d.focus}</h3>
              </div>
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${d.rest ? "bg-secondary" : "bg-primary/20"}`}>
                {d.rest ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Dumbbell className="h-5 w-5 text-primary" />}
              </div>
            </div>
            {!d.rest && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {d.exercises.slice(0,4).map((ex) => (
                  <span key={ex.name} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground">{ex.name}</span>
                ))}
                {d.exercises.length > 4 && <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground">+{d.exercises.length - 4}</span>}
              </div>
            )}
            {d.cardio && <p className="mt-3 text-xs text-rose-300">🔥 {d.cardio}</p>}
          </Card>
        ))}
      </div>
    </Shell>
  );
}
