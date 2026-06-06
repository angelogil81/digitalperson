import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Flame, Droplets, Dumbbell, Heart, ArrowRight, Calendar, Sparkles, Crown, Sun, Trophy } from "lucide-react";
import { Card, SectionTitle, Shell } from "@/components/Shell";
import { useStore, todayISO } from "@/lib/pd-store";
import { quoteOfDay } from "@/lib/quotes";
import { levelFor } from "@/lib/missions";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Início · Personal Digital" }, { name: "description", content: "Seu painel diário." }] }),
  component: Dashboard,
});

function Dashboard() {
  const { profile, plan } = useStore();
  const navigate = useNavigate();
  if (!profile || !plan) return null;

  const isPremium = plan.tier === "premium";
  const today = new Date();
  const dayIdx = (today.getDay() + 6) % 7;
  const todays = plan.week[dayIdx];
  const doneToday = plan.completedDates.includes(todayISO());

  const trainedThisWeek = plan.completedDates.filter((d) => {
    const dd = new Date(d);
    const start = new Date(today); start.setDate(today.getDate() - dayIdx);
    return dd >= start;
  }).length;
  const targetDays = plan.week.filter((d) => !d.rest).length;

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {today.toLocaleDateString("pt-BR", { weekday: "long" })}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Olá, {profile.name.split(" ")[0]} 👋</h1>
        </div>
        <Link to="/app/profile" className="bg-gradient-lime grid h-11 w-11 place-items-center rounded-2xl font-semibold text-primary-foreground shadow-lime">
          {profile.name.charAt(0).toUpperCase()}
        </Link>
      </div>

      {!isPremium && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border/60 bg-secondary/40 px-3 py-2 text-[11px]">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span className="text-muted-foreground">Plano Básico:</span>
          <span className="font-semibold text-foreground">1 acesso por semana de cada seção</span>
        </div>
      )}

      {/* Coach diário hero */}
      <Link to="/app/coach" className="mt-5 block">
        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-lime grid h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-lime">
              <Sun className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-wider text-primary">Coach diário</p>
              <p className="mt-0.5 truncate text-sm font-semibold">"{quoteOfDay()}"</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>
      </Link>

      {/* Level + Missions shortcut */}
      <Link to="/app/missions" className="mt-3 block">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-lime grid h-10 w-10 place-items-center rounded-2xl text-sm font-black text-primary-foreground shadow-lime">
              {levelFor(plan.xp || 0)}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Nível {levelFor(plan.xp || 0)} · {plan.xp || 0} XP</div>
              <div className="text-[11px] text-muted-foreground">Missões diárias e desafios semanais</div>
            </div>
            <Trophy className="h-5 w-5 text-yellow-300" />
          </div>
        </Card>
      </Link>

      {/* Hero training card */}
      <Card className="mt-5 overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Treino de hoje</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">{todays.rest ? "Descanso" : todays.focus}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {todays.rest ? "Recupere bem — amanhã voltamos forte." : `${todays.exercises.length} exercícios · ${profile.minutesPerSession} min`}
            </p>
          </div>
          <div className={`grid h-12 w-12 place-items-center rounded-2xl ${doneToday ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
            <Dumbbell className="h-6 w-6" />
          </div>
        </div>
        {!todays.rest && (
          <button onClick={() => navigate({ to: "/app/workout" })} className="mt-5 flex w-full items-center justify-between rounded-2xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground shadow-lime transition active:scale-[0.98]">
            {doneToday ? "Treino concluído ✓" : "Iniciar treino"} <ArrowRight className="h-5 w-5" />
          </button>
        )}
      </Card>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <StatCard icon={Flame} label="Calorias" value={`${plan.calories}`} unit="kcal" tint="text-orange-300" />
        <StatCard icon={Droplets} label="Água" value={`${(plan.water/1000).toFixed(1)}`} unit="L" tint="text-sky-300" />
        <StatCard icon={Heart} label="Cardio" value={plan.cardio.split(",")[0]} tint="text-rose-300" />
        <StatCard icon={Sparkles} label="Proteína" value={`${plan.protein}`} unit="g" tint="text-primary" />
      </div>

      <SectionTitle action={<Link to="/app/week" className="text-xs font-medium text-primary">Ver semana</Link>}>
        Progresso da semana
      </SectionTitle>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold tabular-nums">{trainedThisWeek}<span className="text-muted-foreground">/{targetDays}</span></div>
            <p className="text-xs text-muted-foreground">treinos concluídos</p>
          </div>
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {plan.week.map((d, i) => {
            const date = new Date(today); date.setDate(today.getDate() - dayIdx + i);
            const iso = date.toISOString().slice(0,10);
            const done = plan.completedDates.includes(iso);
            const isToday = i === dayIdx;
            return (
              <div key={d.day} className={`rounded-xl border py-2 text-center ${isToday ? "border-primary" : "border-border/60"} ${done ? "bg-primary/15" : ""}`}>
                <div className="text-[10px] uppercase text-muted-foreground">{d.day.slice(0,3)}</div>
                <div className={`mt-1 text-sm font-semibold ${done ? "text-primary" : ""}`}>{date.getDate()}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <SectionTitle action={<Link to="/app/nutrition" className="text-xs font-medium text-primary">Dieta completa</Link>}>
        Hoje no prato
      </SectionTitle>
      <Card>
        <MealRow label="Café da manhã" text={plan.meals.breakfast} />
        <Divider />
        <MealRow label="Almoço" text={plan.meals.lunch} />
        <Divider />
        <MealRow label="Lanche" text={plan.meals.snack} />
        <Divider />
        <MealRow label="Jantar" text={plan.meals.dinner} />
      </Card>

      {!isPremium && (
        <Link to="/app/subscription" className="mt-5 block">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-card to-card p-5">
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-wider text-primary">Personal Digital Premium</p>
              <h3 className="mt-1 text-lg font-bold">Pagamento único de R$ 29,90 · vitalício</h3>
              <p className="mt-1 text-xs text-muted-foreground">Tudo diário, sem anúncios e para sempre.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                <Crown className="h-4 w-4" /> Tornar-se Premium <ArrowRight className="h-4 w-4" />
              </span>
            </div>
            <Sparkles className="absolute -right-4 -top-4 h-24 w-24 text-primary/20" />
          </div>
        </Link>
      )}

      <p className="mt-6 px-2 text-center text-[11px] leading-relaxed text-muted-foreground">
        ⚕️ Sugestões gerais de bem-estar. Não substituem acompanhamento médico, nutricional ou de educação física.
      </p>
    </Shell>
  );
}

function StatCard({ icon: Icon, label, value, unit, tint }: { icon: typeof Flame; label: string; value: string; unit?: string; tint?: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
      <Icon className={`h-5 w-5 ${tint || "text-primary"}`} />
      <div className="mt-3 text-xl font-bold tabular-nums">{value}{unit && <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>}</div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
function MealRow({ label, text }: { label: string; text: string }) {
  return <div className="py-2">
    <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">{label}</div>
    <div className="mt-1 text-sm text-foreground/90">{text}</div>
  </div>;
}
function Divider() { return <div className="h-px bg-border/60" />; }
