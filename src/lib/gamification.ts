import type { Plan } from "./pd-store";
import { habitStreak } from "./pd-store";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  isUnlocked: (p: Plan) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_workout",
    title: "Primeiro treino",
    description: "Você concluiu seu primeiro treino.",
    emoji: "🏆",
    isUnlocked: (p) => (p.completedDates?.length || 0) >= 1,
  },
  {
    id: "streak_7",
    title: "7 dias seguidos",
    description: "Mantenha qualquer hábito por 7 dias.",
    emoji: "🔥",
    isUnlocked: (p) =>
      (["water", "sleep_early", "walk", "train", "fruits"] as const).some(
        (h) => habitStreak(p, h) >= 7,
      ),
  },
  {
    id: "streak_30",
    title: "30 dias seguidos",
    description: "Mantenha qualquer hábito por 30 dias.",
    emoji: "💎",
    isUnlocked: (p) =>
      (["water", "sleep_early", "walk", "train", "fruits"] as const).some(
        (h) => habitStreak(p, h) >= 30,
      ),
  },
  {
    id: "lost_5kg",
    title: "Perdeu 5 kg",
    description: "Diferença de 5 kg do primeiro registro.",
    emoji: "⚖️",
    isUnlocked: (p) => {
      const ps = [...(p.progress || [])].sort((a, b) => a.date.localeCompare(b.date));
      if (ps.length < 2) return false;
      return ps[0].weight - ps[ps.length - 1].weight >= 5;
    },
  },
  {
    id: "workouts_30",
    title: "30 treinos concluídos",
    description: "Você completou 30 treinos no total.",
    emoji: "🏋️",
    isUnlocked: (p) => (p.completedDates?.length || 0) >= 30,
  },
  {
    id: "water_100L",
    title: "100 litros de água",
    description: "Cumpriu a meta de água 100 vezes.",
    emoji: "💧",
    isUnlocked: (p) =>
      Object.values(p.habits || {}).filter((d) => d.water).length >= 100,
  },
  {
    id: "checkin_7",
    title: "7 check-ins diários",
    description: "Registrou seu humor por 7 dias.",
    emoji: "📝",
    isUnlocked: (p) => (p.checkins?.length || 0) >= 7,
  },
];

export type Level = { id: string; name: string; emoji: string; min: number };
export const LEVELS: Level[] = [
  { id: "iniciante", name: "Iniciante", emoji: "🥉", min: 0 },
  { id: "consistente", name: "Consistente", emoji: "🥈", min: 8 },
  { id: "evoluindo", name: "Evoluindo", emoji: "🥇", min: 20 },
  { id: "elite", name: "Elite", emoji: "💎", min: 50 },
];

export function currentLevel(p: Plan | null): Level {
  const count = p?.completedDates?.length || 0;
  return [...LEVELS].reverse().find((l) => count >= l.min) || LEVELS[0];
}

export function nextLevel(p: Plan | null): Level | null {
  const count = p?.completedDates?.length || 0;
  return LEVELS.find((l) => count < l.min) || null;
}

/** Returns array of newly unlocked achievement ids (also persists). */
export function syncAchievements(p: Plan): string[] {
  const owned = new Set(p.achievements || []);
  const newly: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (!owned.has(a.id) && a.isUnlocked(p)) {
      owned.add(a.id);
      newly.push(a.id);
    }
  }
  p.achievements = Array.from(owned);
  return newly;
}
