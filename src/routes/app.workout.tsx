import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Timer, Repeat, Flame } from "lucide-react";
import { Card, Shell, SectionTitle } from "@/components/Shell";
import { useStore, getPlan, setPlan, todayISO } from "@/lib/pd-store";
import { WeeklyGate } from "@/components/Premium";

export const Route = createFileRoute("/app/workout")({
  head: () => ({ meta: [{ title: "Treino · Personal Digital" }, { name: "description", content: "Seu treino de hoje." }] }),
  component: Workout,
});

function Workout() {
  const { plan } = useStore();
  const [done, setDone] = useState<Set<number>>(new Set());
  if (!plan) return null;

  const dayIdx = (new Date().getDay() + 6) % 7;
  const today = plan.week[dayIdx];

  function toggle(i: number) {
    const s = new Set(done); s.has(i) ? s.delete(i) : s.add(i); setDone(s);
  }
  function complete() {
    const p = getPlan(); if (!p) return;
    const iso = todayISO();
    if (!p.completedDates.includes(iso)) p.completedDates.push(iso);
    setPlan(p);
    setDone(new Set(today.exercises.map((_, i) => i)));
  }

  const completedToday = plan.completedDates.includes(todayISO());

  return (
    <Shell>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{today.day}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">{today.rest ? "Dia de descanso" : today.focus}</h1>

      <WeeklyGate
        feature="workout"
        title="Treino é 1 vez por semana no Básico"
        description="Use seu acesso desta semana para liberar o treino completo de hoje, ou desbloqueie o uso diário com o Premium."
      >
        {today.rest ? (
          <Card className="mt-6 text-center">
            <div className="bg-gradient-lime mx-auto grid h-16 w-16 place-items-center rounded-3xl">
              <Flame className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="mt-4 text-xl font-bold">Recuperação ativa</h2>
            <p className="mt-2 text-sm text-muted-foreground">Hidrate-se bem, durma 7-9h e, se quiser, faça uma caminhada leve de 20 minutos.</p>
            {today.cardio && <p className="mt-3 text-xs text-primary">{today.cardio}</p>}
          </Card>
        ) : (
          <>
            {today.cardio && (
              <Card className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/20"><Flame className="h-5 w-5 text-rose-300" /></div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Cardio do dia</p>
                  <p className="text-sm font-medium">{today.cardio}</p>
                </div>
              </Card>
            )}

            <SectionTitle>Exercícios</SectionTitle>
            <div className="space-y-3">
              {today.exercises.map((ex, i) => {
                const isDone = done.has(i) || completedToday;
                return (
                  <button key={i} onClick={() => toggle(i)} className={`w-full rounded-2xl border p-4 text-left transition ${isDone ? "border-primary/60 bg-primary/10" : "border-border/60 bg-card/60"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${isDone ? "border-primary bg-primary" : "border-border"}`}>
                        {isDone && <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />}
                      </div>
                      <div className="flex-1">
                        <div className={`text-base font-semibold ${isDone ? "line-through opacity-60" : ""}`}>{ex.name}</div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <Pill icon={Repeat}>{ex.sets} séries</Pill>
                          <Pill>{ex.reps} reps</Pill>
                          <Pill icon={Timer}>{ex.rest}</Pill>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button onClick={complete} disabled={completedToday} className="mt-6 w-full rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lime transition active:scale-[0.98] disabled:opacity-60">
              {completedToday ? "Treino concluído ✓" : "Concluir treino"}
            </button>
          </>
        )}
      </WeeklyGate>
    </Shell>
  );
}

function Pill({ children, icon: Icon }: { children: React.ReactNode; icon?: typeof Timer }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-muted-foreground">
    {Icon && <Icon className="h-3 w-3" />}{children}
  </span>;
}
