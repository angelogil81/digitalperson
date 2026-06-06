import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, Card, SectionTitle } from "@/components/Shell";
import {
  useStore,
  todayISO,
  saveCheckIn,
  getTodayCheckIn,
  checkInScore,
  toggleHabit,
  habitStreak,
  daysSinceStart,
  ensureStartDate,
  type HabitKey,
  getPlan,
  setPlan,
} from "@/lib/pd-store";
import { ACHIEVEMENTS, syncAchievements } from "@/lib/gamification";
import { autoClaimMissions } from "@/lib/missions";
import { Droplets, Moon, Footprints, Dumbbell, Apple, Flame, Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/daily")({
  head: () => ({
    meta: [
      { title: "Diário · Personal Digital" },
      { name: "description", content: "Check-in diário, hábitos e conquistas." },
    ],
  }),
  component: Daily,
});

const HABITS: { key: HabitKey; label: string; icon: typeof Droplets; color: string }[] = [
  { key: "water", label: "Beber água", icon: Droplets, color: "text-sky-300" },
  { key: "sleep_early", label: "Dormir cedo", icon: Moon, color: "text-indigo-300" },
  { key: "walk", label: "Caminhar", icon: Footprints, color: "text-emerald-300" },
  { key: "train", label: "Treinar", icon: Dumbbell, color: "text-primary" },
  { key: "fruits", label: "Comer frutas", icon: Apple, color: "text-rose-300" },
];

function Daily() {
  const { plan } = useStore();

  useEffect(() => {
    ensureStartDate();
    const p = getPlan();
    if (p) {
      const newly = syncAchievements(p);
      autoClaimMissions(p);
      if (newly.length) setPlan(p);
    }
  }, [plan?.checkins?.length, plan?.completedDates?.length, plan?.habits, plan?.progress?.length]);

  if (!plan) return null;

  const today = getTodayCheckIn(plan);
  const days = daysSinceStart(plan);
  const unlocked = new Set(plan.achievements || []);

  return (
    <Shell>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Seu diário</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Como você está hoje?</h1>

      {/* Days counter */}
      <Card className="mt-5 !p-5">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-lime grid h-12 w-12 place-items-center rounded-2xl shadow-lime">
            <Flame className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <div className="text-3xl font-bold leading-none tabular-nums">{days}</div>
            <div className="text-xs text-muted-foreground">
              {days === 1 ? "dia construindo sua melhor versão" : "dias construindo sua melhor versão"}
            </div>
          </div>
        </div>
      </Card>

      {/* Check-in */}
      <SectionTitle>Check-in de hoje</SectionTitle>
      <CheckInCard existing={today} />

      {/* Habits */}
      <SectionTitle>Hábitos diários</SectionTitle>
      <div className="space-y-2">
        {HABITS.map((h) => {
          const done = !!plan.habits?.[todayISO()]?.[h.key];
          const streak = habitStreak(plan, h.key);
          const Icon = h.icon;
          return (
            <button
              key={h.key}
              onClick={() => toggleHabit(h.key)}
              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition active:scale-[0.99] ${
                done ? "border-primary/60 bg-primary/10" : "border-border/60 bg-card"
              }`}
            >
              <Icon className={`h-5 w-5 ${h.color}`} />
              <div className="flex-1">
                <div className="text-sm font-semibold">{h.label}</div>
                {streak > 0 && (
                  <div className="text-[11px] text-muted-foreground">
                    🔥 {streak} {streak === 1 ? "dia" : "dias"} seguidos
                    {streak >= 30 ? " · Elite" : streak >= 7 ? " · em chamas" : ""}
                  </div>
                )}
              </div>
              <div
                className={`grid h-7 w-7 place-items-center rounded-full border-2 ${
                  done ? "border-primary bg-primary" : "border-border"
                }`}
              >
                {done && <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Achievements */}
      <SectionTitle>
        Conquistas
        <span className="ml-2 text-xs font-normal text-muted-foreground">
          {unlocked.size}/{ACHIEVEMENTS.length}
        </span>
      </SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        {ACHIEVEMENTS.map((a) => {
          const got = unlocked.has(a.id);
          return (
            <div
              key={a.id}
              className={`rounded-2xl border p-4 text-center transition ${
                got
                  ? "border-primary/40 bg-gradient-to-br from-primary/15 via-card to-card"
                  : "border-border/60 bg-card/50 opacity-60"
              }`}
            >
              <div className={`text-3xl ${got ? "" : "grayscale"}`}>{a.emoji}</div>
              <div className="mt-2 text-xs font-bold leading-tight">{a.title}</div>
              <div className="mt-1 text-[10px] leading-snug text-muted-foreground">{a.description}</div>
              {got && (
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-bold uppercase text-primary">
                  <Sparkles className="h-2.5 w-2.5" /> Conquistado
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

const QUESTIONS: { key: "mood" | "energy" | "sleep" | "soreness" | "motivation"; label: string; emoji: string }[] = [
  { key: "mood", label: "Humor", emoji: "😊" },
  { key: "energy", label: "Energia", emoji: "⚡" },
  { key: "sleep", label: "Sono", emoji: "💤" },
  { key: "soreness", label: "Dor muscular (5 = sem dor)", emoji: "💪" },
  { key: "motivation", label: "Motivação", emoji: "🚀" },
];

function CheckInCard({ existing }: { existing?: { mood: number; energy: number; sleep: number; soreness: number; motivation: number } }) {
  const [vals, setVals] = useState({
    mood: existing?.mood ?? 3,
    energy: existing?.energy ?? 3,
    sleep: existing?.sleep ?? 3,
    soreness: existing?.soreness ?? 3,
    motivation: existing?.motivation ?? 3,
  });
  const [saved, setSaved] = useState(!!existing);

  function save() {
    saveCheckIn(vals);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const score = checkInScore({ date: "", ...vals });

  return (
    <Card>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Score diário</p>
          <div className="text-4xl font-bold tabular-nums">
            {score}
            <span className="text-base font-normal text-muted-foreground">/100</span>
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          {score >= 80 ? "Excelente! 🔥" : score >= 60 ? "Bem 💪" : score >= 40 ? "Médio" : "Cuide-se hoje"}
        </div>
      </div>

      <div className="space-y-3">
        {QUESTIONS.map((q) => (
          <div key={q.key}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-semibold">
                {q.emoji} {q.label}
              </span>
              <span className="tabular-nums text-muted-foreground">{vals[q.key]}/5</span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setVals((v) => ({ ...v, [q.key]: n }))}
                  className={`h-9 flex-1 rounded-lg text-sm font-semibold transition ${
                    vals[q.key] >= n
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={save}
        className="mt-5 w-full rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-lime transition active:scale-[0.98]"
      >
        {saved ? "Salvo ✓" : existing ? "Atualizar check-in" : "Salvar check-in"}
      </button>
    </Card>
  );
}
