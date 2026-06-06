// Personal Digital - local state store (localStorage based, no backend)
import { useEffect, useState, useCallback } from "react";

export type Goal = "emagrecer" | "massa" | "definicao" | "condicionamento" | "saude";
export type Sex = "M" | "F" | "O";
export type Activity = "sedentario" | "leve" | "moderado" | "intenso";

export type ProgressEntry = { date: string; weight: number; waist?: number; chest?: number; hip?: number; arm?: number; note?: string };

export type Profile = {
  name: string;
  email: string;
  age: number;
  sex: Sex;
  height: number; // cm
  weight: number; // kg
  activity: Activity;
  goal: Goal;
  daysPerWeek: number;
  minutesPerSession: number;
  hasGym: boolean;
  trainsHome: boolean;
  diet: string;
  injuries: string;
};

export type Exercise = { name: string; sets: number; reps: string; rest: string };
export type DayPlan = { day: string; focus: string; rest?: boolean; exercises: Exercise[]; cardio?: string };
export type MealPlan = { breakfast: string; lunch: string; snack: string; dinner: string };
export type BasicFeature = "workout" | "nutrition" | "progress" | "week";

export type CheckIn = {
  date: string;       // YYYY-MM-DD
  mood: number;       // 1-5
  energy: number;     // 1-5
  sleep: number;      // 1-5
  soreness: number;   // 1-5 (5 = sem dor)
  motivation: number; // 1-5
};

export type HabitKey = "water" | "sleep_early" | "walk" | "train" | "fruits";
export type HabitsLog = Record<string, Partial<Record<HabitKey, boolean>>>; // date -> habit -> done

export type Plan = {
  goalLabel: string;
  calories: number;
  protein: number;
  water: number; // ml
  cardio: string;
  week: DayPlan[];
  meals: MealPlan;
  completedDates: string[]; // YYYY-MM-DD
  progress: ProgressEntry[];
  tier: "basic" | "premium";
  basicUsage?: Partial<Record<BasicFeature, string>>;
  // Phase 1 additions (optional for backwards compat with saved plans)
  startDate?: string;
  checkins?: CheckIn[];
  habits?: HabitsLog;
  achievements?: string[];
};

const KEY_PROFILE = "pd_profile";
const KEY_PLAN = "pd_plan";
const KEY_AUTH = "pd_auth";

export const SUPPORT_EMAIL = "suporte@personaldigital.app";

export function getAuth(): { email: string; name: string } | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(KEY_AUTH) || "null"); } catch { return null; }
}
export function setAuth(a: { email: string; name: string } | null) {
  if (typeof window === "undefined") return;
  if (!a) localStorage.removeItem(KEY_AUTH);
  else localStorage.setItem(KEY_AUTH, JSON.stringify(a));
  window.dispatchEvent(new Event("pd-store"));
}
export function getProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(KEY_PROFILE) || "null"); } catch { return null; }
}
export function setProfile(p: Profile | null) {
  if (typeof window === "undefined") return;
  if (!p) localStorage.removeItem(KEY_PROFILE);
  else localStorage.setItem(KEY_PROFILE, JSON.stringify(p));
  window.dispatchEvent(new Event("pd-store"));
}
export function getPlan(): Plan | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(KEY_PLAN) || "null"); } catch { return null; }
}
export function setPlan(p: Plan | null) {
  if (typeof window === "undefined") return;
  if (!p) localStorage.removeItem(KEY_PLAN);
  else localStorage.setItem(KEY_PLAN, JSON.stringify(p));
  window.dispatchEvent(new Event("pd-store"));
}

export function useStore() {
  const [, force] = useState(0);
  useEffect(() => {
    const handler = () => force((x) => x + 1);
    window.addEventListener("pd-store", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("pd-store", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return {
    auth: getAuth(),
    profile: getProfile(),
    plan: getPlan(),
    setAuth, setProfile, setPlan,
    refresh: useCallback(() => force((x) => x + 1), []),
  };
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ISO week key (e.g. "2026-W23")
export function weekKey(d: Date = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function unlockBasicFeature(feature: BasicFeature) {
  const p = getPlan(); if (!p) return;
  p.basicUsage = { ...(p.basicUsage || {}), [feature]: weekKey() };
  setPlan(p);
}

export function isBasicFeatureUnlocked(plan: Plan | null, feature: BasicFeature) {
  if (!plan) return false;
  if (plan.tier === "premium") return true;
  return plan.basicUsage?.[feature] === weekKey();
}
