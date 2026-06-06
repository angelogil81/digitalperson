import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, Card, SectionTitle } from "@/components/Shell";
import {
  useStore,
  todayISO,
  daysSinceStart,
  ensureStartDate,
  getPlan,
  setPlan,
} from "@/lib/pd-store";
import { quoteOfDay, tipOfDay } from "@/lib/quotes";
import { missionsOfDay, addXP, levelFor, xpInLevel, xpToNext } from "@/lib/missions";
import { Sparkles, Dumbbell, Droplets, Apple, Trophy, Check, ArrowRight, Sun } from "lucide-react";

export const Route = createFileRoute("/app/coach")({
  head: () => ({
    meta: [
      { title: "Coach Diário · Personal Digital" },
      { name: "description", content: "Seu resumo, meta do dia, dica e motivação." },
    ],
  }),
  component: Coach,
});

function Coach() {
  const { plan, profile } = useStore();
  const [, force] = useState(0);

  useEffect(() => { ensureStartDate(); }, []);
  if (!plan || !profile) return null;

  const today = new Date();
  const dayIdx = (today.getDay() + 6) % 7;
  const todayPlan = plan.week[dayIdx];
  const doneToday = plan.completedDates?.includes(todayISO()) ?? false;
  const days = daysSinceStart(plan);
  const greeting = (() => {
    const h = today.getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  })();

  const xp = plan.xp || 0;
  const level = levelFor(xp);
  const inLvl = xpInLevel(xp);
  const toNext = xpToNext();
  const pct = (inLvl / toNext) * 100;

  const waterTargetGlasses = Math.round(plan.water / 250);
  const coachDone = plan.coachDoneDates?.includes(todayISO()) ?? false;

  const missions = missionsOfDay();
  const missionsDone = missions.filter((m) => m.isDone(plan)).length;

  function markDayComplete() {
    const p = getPlan(); if (!p) return;
    const list = p.coachDoneDates || [];
    if (!list.includes(todayISO())) {
      p.coachDoneDates = [...list, todayISO()];
      setPlan(p);
      addXP(20, "coach_complete");
      force((x) => x + 1);
    }
  }

  return (
    <Shell>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{greeting}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">
        {profile.name.split(" ")[0]}, vamos lá ✨
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Dia {days} da sua jornada · Nível {level}
      </p>

      {/* XP bar */}
      <Card className="mt-5 !p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-lime grid h-12 w-12 place-items-center rounded-2xl text-lg font-black text-primary-foreground shadow-lime">
              {level}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Seu nível</div>
              <div className="text-sm font-semibold">{xp} XP totais</div>
            </div>
          </div>
          <Link to="/app/missions" className="text-xs font-medium text-primary">
            Missões →
          </Link>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">{inLvl}/{toNext} XP para o nível {level + 1}</p>
      </Card>

      {/* Daily quote */}
      <Card className="mt-3 !p-5">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-primary">
          <Sun className="h-3.5 w-3.5" /> Motivação do dia
        </div>
        <p className="mt-2 text-base leading-relaxed">"{quoteOfDay()}"</p>
      </Card>

      <SectionTitle>Sua meta de hoje</SectionTitle>
      <div className="space-y-3">
        <CoachItem
          icon={Dumbbell}
          tint="text-primary"
          title="Treino"
          subtitle={todayPlan.rest ? "Descanso ativo" : `${todayPlan.focus} · ${plan.week[dayIdx].exercises.length} exercícios`}
          done={doneToday || todayPlan.rest}
          to="/app/workout"
        />
        <CoachItem
          icon={Droplets}
          tint="text-sky-300"
          title="Água"
          subtitle={`Meta: ${(plan.water/1000).toFixed(1)} L · ${waterTargetGlasses} copos de 250ml`}
          to="/app/nutrition"
        />
        <CoachItem
          icon={Apple}
          tint="text-rose-300"
          title="Refeição-foco do dia"
          subtitle={plan.meals.lunch}
          to="/app/nutrition"
        />
        <CoachItem
          icon={Trophy}
          tint="text-yellow-300"
          title="Missões diárias"
          subtitle={`${missionsDone}/${missions.length} concluídas`}
          done={missionsDone === missions.length}
          to="/app/missions"
        />
      </div>

      {/* Tip */}
      <SectionTitle>Dica alimentar de hoje</SectionTitle>
      <Card>
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-rose-500/20 text-lg">🥗</div>
          <p className="text-sm leading-relaxed">{tipOfDay()}</p>
        </div>
      </Card>

      <button
        onClick={markDayComplete}
        disabled={coachDone}
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold transition active:scale-[0.98] ${
          coachDone
            ? "bg-secondary text-muted-foreground"
            : "bg-primary text-primary-foreground shadow-lime"
        }`}
      >
        {coachDone ? <><Check className="h-4 w-4" /> Dia concluído · +20 XP</> : <><Sparkles className="h-4 w-4" /> Marcar dia como concluído</>}
      </button>
    </Shell>
  );
}

function CoachItem({
  icon: Icon, tint, title, subtitle, done, to,
}: {
  icon: typeof Dumbbell;
  tint: string;
  title: string;
  subtitle: string;
  done?: boolean;
  to: string;
}) {
  return (
    <Link to={to} className="block">
      <Card className="!p-4">
        <div className="flex items-center gap-3">
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary ${tint}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">{title}</div>
            <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
          </div>
          {done ? (
            <div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-4 w-4" strokeWidth={3} />
            </div>
          ) : (
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </Card>
    </Link>
  );
}
