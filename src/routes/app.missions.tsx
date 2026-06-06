import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, Card, SectionTitle } from "@/components/Shell";
import { useStore, getPlan, setPlan, weekKey } from "@/lib/pd-store";
import {
  missionsOfDay,
  challengeOfWeek,
  addXP,
  levelFor,
  xpInLevel,
  xpToNext,
  autoClaimMissions,
} from "@/lib/missions";
import { usePremium } from "@/components/Premium";
import { Trophy, Crown, Check, Lock, Sparkles, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app/missions")({
  head: () => ({
    meta: [
      { title: "Missões · Personal Digital" },
      { name: "description", content: "Missões diárias, XP, níveis e desafios semanais." },
    ],
  }),
  component: Missions,
});

function Missions() {
  const { plan } = useStore();
  const isPremium = usePremium();
  const [, force] = useState(0);

  useEffect(() => {
    const p = getPlan();
    if (p) {
      const before = p.xp || 0;
      autoClaimMissions(p);
      if ((getPlan()?.xp || 0) !== before) force((x) => x + 1);
    }
  }, [plan?.completedDates?.length, plan?.checkins?.length, plan?.habits]);

  if (!plan) return null;
  const xp = plan.xp || 0;
  const level = levelFor(xp);
  const inLvl = xpInLevel(xp);
  const toNext = xpToNext();
  const missions = missionsOfDay();

  const challenge = challengeOfWeek();
  const wk = weekKey();
  const challengeKey = `${wk}:${challenge.id}`;
  const challengeProgress = challenge.progress(plan);
  const challengeDone = challengeProgress >= challenge.target;
  const challengeClaimed = (plan.challengeClaims || []).includes(challengeKey);

  function claimChallenge() {
    if (!challengeDone || challengeClaimed) return;
    const p = getPlan(); if (!p) return;
    p.challengeClaims = [...(p.challengeClaims || []), challengeKey];
    setPlan(p);
    addXP(challenge.xp, `challenge:${challenge.id}:${wk}`);
    force((x) => x + 1);
  }

  return (
    <Shell>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Gamificação</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Missões & XP</h1>

      {/* Level card */}
      <Card className="mt-5 !p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-lime grid h-14 w-14 place-items-center rounded-3xl text-xl font-black text-primary-foreground shadow-lime">
              {level}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Nível atual</div>
              <div className="text-lg font-bold">{xp} XP</div>
            </div>
          </div>
          <Zap className="h-7 w-7 text-primary" />
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-gradient-to-r from-primary/80 to-primary" style={{ width: `${(inLvl / toNext) * 100}%` }} />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">{inLvl}/{toNext} XP para o nível {level + 1}</p>
      </Card>

      {/* Daily missions */}
      <SectionTitle>Missões de hoje</SectionTitle>
      <div className="space-y-2">
        {missions.map((m) => {
          const done = m.isDone(plan);
          return (
            <Card key={m.id} className="!p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary text-xl">{m.emoji}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{m.title}</div>
                  <div className="text-xs text-muted-foreground">{m.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold text-primary">+{m.xp} XP</div>
                  <div className={`mt-1 grid h-6 w-6 place-items-center rounded-full ${done ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}>
                    {done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Weekly challenge */}
      <SectionTitle>
        Desafio da semana
        {!isPremium && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-bold uppercase text-primary"><Crown className="h-2.5 w-2.5" /> Premium</span>}
      </SectionTitle>

      {!isPremium ? (
        <Card className="text-center">
          <div className="bg-gradient-lime mx-auto grid h-12 w-12 place-items-center rounded-3xl shadow-lime">
            <Lock className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="mt-3 text-base font-bold">Desafios exclusivos do Premium</h3>
          <p className="mt-1 text-xs text-muted-foreground">Cumpra metas semanais e ganhe XP em massa.</p>
          <Link to="/app/subscription" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lime">
            <Crown className="h-4 w-4" /> Liberar por R$ 29,90
          </Link>
        </Card>
      ) : (
        <Card>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-2xl">{challenge.emoji}</div>
            <div className="flex-1">
              <div className="text-sm font-bold">{challenge.title}</div>
              <div className="text-xs text-muted-foreground">{challenge.description}</div>
            </div>
            <div className="text-right text-[11px] font-bold text-primary">+{challenge.xp} XP</div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-gradient-to-r from-primary/80 to-primary" style={{ width: `${Math.min(100, (challengeProgress / challenge.target) * 100)}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">{Math.min(challengeProgress, challenge.target)}/{challenge.target}</p>
          <button
            onClick={claimChallenge}
            disabled={!challengeDone || challengeClaimed}
            className={`mt-4 w-full rounded-2xl py-3 text-sm font-semibold transition active:scale-[0.98] ${
              challengeClaimed
                ? "bg-secondary text-muted-foreground"
                : challengeDone
                ? "bg-primary text-primary-foreground shadow-lime"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {challengeClaimed ? "Recompensa coletada ✓" : challengeDone ? <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Coletar +{challenge.xp} XP</span> : "Continue progredindo"}
          </button>
        </Card>
      )}

      <p className="mt-6 px-2 text-center text-[11px] leading-relaxed text-muted-foreground">
        <Trophy className="mb-0.5 mr-1 inline h-3 w-3" /> XP é creditado automaticamente quando você completa hábitos, treinos e check-ins.
      </p>
    </Shell>
  );
}
