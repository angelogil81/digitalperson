// Wger API service — fetches exerciseinfo (with images) and matches by name.
// Docs: https://wger.de/api/v2/exerciseinfo/

const API = "https://wger.de/api/v2/exerciseinfo/?language=2&limit=200";
const CACHE_KEY = "pd_wger_cache_v1";
const CACHE_TTL = 1000 * 60 * 60 * 24 * 14; // 14 days

export type WgerImage = { image: string; is_main: boolean };
export type WgerExercise = {
  id: number;
  category?: { id: number; name: string };
  images: WgerImage[];
  translations: { language: number; name: string; aliases?: { alias: string }[] }[];
};

type Cache = { ts: number; items: WgerExercise[] };

let memory: WgerExercise[] | null = null;
let inflight: Promise<WgerExercise[]> | null = null;

function readCache(): WgerExercise[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const c: Cache = JSON.parse(raw);
    if (Date.now() - c.ts > CACHE_TTL) return null;
    return c.items;
  } catch { return null; }
}

function writeCache(items: WgerExercise[]) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), items })); } catch {}
}

async function fetchAll(): Promise<WgerExercise[]> {
  const cached = readCache();
  if (cached?.length) { memory = cached; return cached; }
  const items: WgerExercise[] = [];
  let url: string | null = API;
  let pages = 0;
  while (url && pages < 6) { // cap at ~1200 records
    const res = await fetch(url);
    if (!res.ok) break;
    const data: { results: WgerExercise[]; next: string | null } = await res.json();
    for (const r of data.results) {
      if (r.images && r.images.length > 0) {
        items.push({
          id: r.id,
          category: r.category,
          images: r.images.map((i) => ({ image: i.image, is_main: i.is_main })),
          translations: (r.translations || []).map((t) => ({
            language: t.language, name: t.name, aliases: t.aliases,
          })),
        });
      }
    }
    url = data.next;
    pages++;
  }
  writeCache(items);
  memory = items;
  return items;
}

export async function loadWger(): Promise<WgerExercise[]> {
  if (memory) return memory;
  if (!inflight) inflight = fetchAll().finally(() => { inflight = null; });
  return inflight;
}

// PT → list of EN search tokens to try
const PT_TO_EN: Record<string, string[]> = {
  "agachamento livre": ["squat", "barbell squat"],
  "agachamento com salto": ["jump squat"],
  "agachamento búlgaro": ["bulgarian split squat", "split squat"],
  "afundo alternado": ["lunge", "alternating lunge"],
  "afundo reverso": ["reverse lunge"],
  "leg press 45°": ["leg press"],
  "leg press": ["leg press"],
  "cadeira extensora": ["leg extension"],
  "mesa flexora": ["leg curl", "lying leg curl"],
  "panturrilha em pé": ["standing calf raise", "calf raise"],
  "panturrilha unilateral": ["single leg calf raise", "calf raise"],
  "elevação pélvica": ["hip thrust", "glute bridge"],
  "supino reto com halteres": ["dumbbell bench press", "bench press"],
  "supino inclinado": ["incline bench press", "incline press"],
  "flexão de braço": ["push up", "push-up"],
  "desenvolvimento militar": ["overhead press", "military press", "shoulder press"],
  "elevação lateral": ["lateral raise", "side raise"],
  "puxada frontal": ["lat pulldown", "pulldown"],
  "remada baixa": ["seated row", "cable row"],
  "remada curvada": ["bent over row", "barbell row"],
  "remada invertida (toalha/mesa)": ["inverted row", "bodyweight row"],
  "rosca direta": ["biceps curl", "barbell curl"],
  "rosca martelo": ["hammer curl"],
  "tríceps corda": ["triceps pushdown", "rope pushdown", "triceps"],
  "prancha": ["plank"],
  "prancha abdominal": ["plank"],
  "mountain climbers": ["mountain climber"],
  "burpees": ["burpee"],
  "polichinelos": ["jumping jack"],
  "skipping alto": ["high knees", "running in place"],
  "caminhada leve": ["walking"],
  "alongamento dinâmico": ["dynamic stretch", "stretching"],
  "mobilidade de quadril": ["hip mobility", "hip circle"],
  "respiração diafragmática": ["breathing", "diaphragmatic"],
};

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
}

function scoreMatch(ex: WgerExercise, tokens: string[]): number {
  const names: string[] = [];
  for (const t of ex.translations) {
    if (t.language !== 2) continue;
    names.push(normalize(t.name));
    for (const a of t.aliases || []) names.push(normalize(a.alias));
  }
  let best = 0;
  for (const name of names) {
    for (const term of tokens) {
      const nterm = normalize(term);
      if (!nterm) continue;
      if (name === nterm) best = Math.max(best, 100);
      else if (name.includes(nterm)) best = Math.max(best, 70 + Math.min(20, nterm.length));
      else {
        const tks = nterm.split(" ").filter(Boolean);
        const hits = tks.filter((tk) => name.includes(tk)).length;
        if (hits) best = Math.max(best, 30 + hits * 10);
      }
    }
  }
  return best;
}

const imageCache = new Map<string, string | null>();

export async function getExerciseImage(ptName: string): Promise<string | null> {
  const key = normalize(ptName);
  if (imageCache.has(key)) return imageCache.get(key)!;
  const tokens = PT_TO_EN[key] || [ptName];
  try {
    const items = await loadWger();
    let bestEx: WgerExercise | null = null;
    let bestScore = 0;
    for (const ex of items) {
      const s = scoreMatch(ex, tokens);
      if (s > bestScore) { bestScore = s; bestEx = ex; }
    }
    if (bestScore < 40 || !bestEx) { imageCache.set(key, null); return null; }
    const main = bestEx.images.find((i) => i.is_main) || bestEx.images[0];
    const url = main?.image || null;
    imageCache.set(key, url);
    return url;
  } catch {
    imageCache.set(key, null);
    return null;
  }
}
