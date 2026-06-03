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
};

const KEY_PROFILE = "pd_profile";
const KEY_PLAN = "pd_plan";
const KEY_AUTH = "pd_auth";

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
