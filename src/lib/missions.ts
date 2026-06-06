// Daily missions + weekly challenges
import { getPlan, setPlan, todayISO, weekKey, type Plan } from "./pd-store";

export type Mission = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xp: number;
  isDone: (p: Plan) => boolean;
};

const POOL: Mission[] = [
  {
    id: "m_water",
    title: "Hidrate-se",
    description: "Marque o hábito de beber água hoje.",
    emoji: "💧",
    xp: 15,
    isDone: (p) => !!p.habits?.[todayISO()]?.water,
  },
  {
    id: "m_train",
    title: "Treine hoje",
    description: "Conclua o treino do dia.",
    emoji: "🏋️",
    xp: 30,
    isDone: (p) => p.completedDates?.includes(todayISO()) ?? false,
  },
  {
    id: "m_checkin",
    title: "Faça seu check-in",
    description: "Registre humor, energia, sono, dor e motivação.",
    emoji: "📝",
    xp: 15,
    isDone: (p) => !!p.checkins?.some((c) => c.date === todayISO()),
  },
  {
    id: "m_walk",
    title: "Caminhe",
    description: "Marque o hábito de caminhar.",
    emoji: "🚶",
    xp: 10,
    isDone: (p) => !!p.habits?.[todayISO()]?.walk,
  },
  {
    id: "m_fruits",
    title: "Coma frutas",
    description: "Marque o hábito de comer frutas hoje.",
    emoji: "🍎",
    xp: 10,
    isDone: (p) => !!p.habits?.[todayISO()]?.fruits,
  },
  {
    id: "m_sleep_early",
    title: "Durma cedo hoje",
    description: "Marque o hábito de dormir cedo.",
    emoji: "🌙",
    xp: 10,
    isDone: (p) => !!p.habits?.[todayISO()]?.sleep_early,
  },
];

// Pick 3 missions deterministically by date (seed = dayOfYear)
export function missionsOfDay(date = new Date()): Mission[] {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86400000);
  const out: Mission[] = [];
  for (let i = 0; i < 3; i++) {
    out.push(POOL[(day + i * 2) % POOL.length]);
  }
  return out;
}

// ----- XP / Level -----
const PER_LEVEL = 100;
export function levelFor(xp: number): number {
  // Level 1 starts at 0 XP. Each level needs PER_LEVEL more.
  return Math.floor(xp / PER_LEVEL) + 1;
}
export function xpInLevel(xp: number): number {
  return xp % PER_LEVEL;
}
export function xpToNext(): number {
  return PER_LEVEL;
}

export function addXP(amount: number, sourceId?: string) {
  const p = getPlan();
  if (!p) return;
  // de-dup per-source per-day (so completing a mission twice doesn't double XP)
  if (sourceId) {
    const key = `${todayISO()}:${sourceId}`;
    const claimed = p.xpClaims || [];
    if (claimed.includes(key)) return;
    p.xpClaims = [...claimed, key].slice(-200);
  }
  p.xp = (p.xp || 0) + amount;
  setPlan(p);
}

/** Auto-claim XP for missions completed today. Safe to call on render. */
export function autoClaimMissions(p: Plan) {
  const ms = missionsOfDay();
  for (const m of ms) {
    if (m.isDone(p)) addXP(m.xp, `mission:${m.id}`);
  }
}

// ----- Weekly challenges (Premium) -----
export type WeeklyChallenge = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xp: number;
  target: number;
  progress: (p: Plan) => number;
};

export const CHALLENGES: WeeklyChallenge[] = [
  {
    id: "w_water_7",
    title: "Hidratação 7/7",
    description: "Beba água todos os dias desta semana.",
    emoji: "💧",
    xp: 100,
    target: 7,
    progress: (p) => countHabitThisWeek(p, "water"),
  },
  {
    id: "w_train_4",
    title: "4 treinos na semana",
    description: "Conclua 4 treinos antes do domingo.",
    emoji: "🏋️",
    xp: 150,
    target: 4,
    progress: (p) => countDatesThisWeek(p.completedDates || []),
  },
  {
    id: "w_checkin_5",
    title: "5 check-ins",
    description: "Registre seu humor 5 dias nesta semana.",
    emoji: "📝",
    xp: 80,
    target: 5,
    progress: (p) => countDatesThisWeek((p.checkins || []).map((c) => c.date)),
  },
];

export function challengeOfWeek(): WeeklyChallenge {
  const wk = weekKey();
  // hash weekKey to index
  let h = 0;
  for (let i = 0; i < wk.length; i++) h = (h * 31 + wk.charCodeAt(i)) | 0;
  return CHALLENGES[Math.abs(h) % CHALLENGES.length];
}

function countHabitThisWeek(p: Plan, key: "water" | "sleep_early" | "walk" | "train" | "fruits"): number {
  const dates = thisWeekDates();
  return dates.filter((d) => p.habits?.[d]?.[key]).length;
}
function countDatesThisWeek(list: string[]): number {
  const set = new Set(thisWeekDates());
  return list.filter((d) => set.has(d)).length;
}
function thisWeekDates(): string[] {
  const out: string[] = [];
  const d = new Date();
  const dow = (d.getDay() + 6) % 7; // Mon=0
  const start = new Date(d); start.setDate(d.getDate() - dow);
  for (let i = 0; i < 7; i++) {
    const x = new Date(start); x.setDate(start.getDate() + i);
    out.push(x.toISOString().slice(0, 10));
  }
  return out;
}
