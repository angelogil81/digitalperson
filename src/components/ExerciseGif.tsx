// Unique animated tile per exercise. No repeats: each named exercise gets its
// own emoji, gradient and micro-animation. Names not in the table fall back to
// a stable hash-based variant so different names always look different.

type Variant = {
  emoji: string;
  from: string;
  to: string;
  label: string;
  anim: "pulse" | "bob" | "swing" | "spin" | "shake" | "float" | "kick" | "push";
};

// Curated per-exercise map — covers everything in plan-generator + coach.
const EXERCISES: Record<string, Variant> = {
  // Push / peito / ombros / tríceps
  "supino reto com halteres": { emoji: "🛏️", from: "hsl(0 90% 55%)",   to: "hsl(20 95% 55%)",  label: "Supino reto",     anim: "push" },
  "supino inclinado":         { emoji: "📐", from: "hsl(15 92% 58%)",  to: "hsl(35 92% 55%)",  label: "Supino inclinado",anim: "push" },
  "desenvolvimento militar":  { emoji: "🪖", from: "hsl(40 90% 55%)",  to: "hsl(20 95% 55%)",  label: "Desenvolv.",      anim: "push" },
  "elevação lateral":         { emoji: "🦅", from: "hsl(48 95% 55%)",  to: "hsl(30 95% 55%)",  label: "Elev. lateral",   anim: "swing" },
  "tríceps corda":            { emoji: "🪢", from: "hsl(285 80% 55%)", to: "hsl(320 85% 55%)", label: "Tríceps",         anim: "push" },
  "flexão de braço":          { emoji: "🤸", from: "hsl(10 90% 55%)",  to: "hsl(340 85% 55%)", label: "Flexão",          anim: "push" },

  // Pull / costas / bíceps
  "puxada frontal":           { emoji: "🧗", from: "hsl(210 90% 58%)", to: "hsl(230 85% 55%)", label: "Puxada",          anim: "bob"  },
  "remada curvada":           { emoji: "🚣", from: "hsl(200 90% 55%)", to: "hsl(220 90% 55%)", label: "Remada curv.",    anim: "swing" },
  "remada baixa":             { emoji: "⛵", from: "hsl(195 90% 50%)", to: "hsl(215 90% 55%)", label: "Remada baixa",    anim: "swing" },
  "remada invertida (toalha/mesa)": { emoji: "🪑", from: "hsl(205 85% 50%)", to: "hsl(240 80% 55%)", label: "Rem. invertida", anim: "swing" },
  "rosca direta":             { emoji: "💪", from: "hsl(300 85% 55%)", to: "hsl(260 80% 55%)", label: "Rosca direta",    anim: "bob"  },
  "rosca martelo":            { emoji: "🔨", from: "hsl(275 85% 55%)", to: "hsl(310 85% 55%)", label: "Martelo",         anim: "swing" },

  // Legs
  "agachamento livre":        { emoji: "🏋️", from: "hsl(140 90% 50%)", to: "hsl(160 90% 45%)", label: "Agachamento",     anim: "bob"  },
  "agachamento búlgaro":      { emoji: "🦩", from: "hsl(150 85% 50%)", to: "hsl(175 85% 45%)", label: "Búlgaro",         anim: "bob"  },
  "agachamento com salto":    { emoji: "🚀", from: "hsl(130 90% 55%)", to: "hsl(90 90% 50%)",  label: "Squat jump",      anim: "kick" },
  "leg press 45°":            { emoji: "🦿", from: "hsl(155 85% 45%)", to: "hsl(180 85% 45%)", label: "Leg press",       anim: "push" },
  "cadeira extensora":        { emoji: "🪑", from: "hsl(170 80% 50%)", to: "hsl(190 80% 50%)", label: "Extensora",       anim: "kick" },
  "mesa flexora":             { emoji: "🛋️", from: "hsl(160 80% 45%)", to: "hsl(140 80% 45%)", label: "Flexora",         anim: "kick" },
  "panturrilha em pé":        { emoji: "🦶", from: "hsl(120 80% 50%)", to: "hsl(100 80% 50%)", label: "Panturrilha",     anim: "bob"  },
  "panturrilha unilateral":   { emoji: "🦵", from: "hsl(115 80% 45%)", to: "hsl(95 80% 45%)",  label: "Pant. unilat.",   anim: "bob"  },
  "afundo alternado":         { emoji: "🚶", from: "hsl(145 85% 50%)", to: "hsl(165 85% 45%)", label: "Afundo",          anim: "bob"  },
  "afundo reverso":           { emoji: "🚶‍♀️", from: "hsl(150 85% 45%)", to: "hsl(170 85% 45%)", label: "Afundo reverso",  anim: "bob"  },
  "elevação pélvica":         { emoji: "🍑", from: "hsl(340 85% 55%)", to: "hsl(20 85% 55%)",  label: "Ponte glúteo",    anim: "push" },

  // Core / abdomen
  "prancha abdominal":        { emoji: "🧱", from: "hsl(190 90% 50%)", to: "hsl(210 85% 50%)", label: "Prancha",         anim: "shake" },
  "prancha":                  { emoji: "🧱", from: "hsl(190 90% 50%)", to: "hsl(210 85% 50%)", label: "Prancha",         anim: "shake" },
  "mountain climbers":        { emoji: "⛰️", from: "hsl(30 90% 55%)",  to: "hsl(15 90% 50%)",  label: "Mountain",        anim: "kick" },

  // Cardio
  "burpees":                  { emoji: "🔥", from: "hsl(0 95% 55%)",   to: "hsl(25 95% 55%)",  label: "Burpee",          anim: "kick" },
  "polichinelos":             { emoji: "🤾", from: "hsl(340 90% 55%)", to: "hsl(10 95% 55%)",  label: "Polichinelo",     anim: "swing" },
  "skipping alto":            { emoji: "🏃", from: "hsl(20 95% 55%)",  to: "hsl(40 95% 55%)",  label: "Skipping",        anim: "kick" },

  // Mobilidade
  "caminhada leve":           { emoji: "🚶‍♂️", from: "hsl(180 60% 50%)", to: "hsl(200 60% 50%)", label: "Caminhada",       anim: "bob"  },
  "alongamento dinâmico":     { emoji: "🧘", from: "hsl(190 65% 50%)", to: "hsl(220 65% 50%)", label: "Alongamento",     anim: "float" },
  "mobilidade de quadril":    { emoji: "🕺", from: "hsl(200 65% 50%)", to: "hsl(230 65% 50%)", label: "Quadril",         anim: "spin" },
  "respiração diafragmática": { emoji: "🌬️", from: "hsl(210 60% 50%)", to: "hsl(240 60% 50%)", label: "Respiração",      anim: "float" },
};

const ANIM_CLASS: Record<Variant["anim"], string> = {
  pulse: "ex-anim-pulse",
  bob:   "ex-anim-bob",
  swing: "ex-anim-swing",
  spin:  "ex-anim-spin",
  shake: "ex-anim-shake",
  float: "ex-anim-float",
  kick:  "ex-anim-kick",
  push:  "ex-anim-push",
};

// Palette + emoji pool for fallback — deterministic per name.
const FALLBACK_EMOJIS = ["💥","⚡","🎯","🔥","🌀","✨","🏆","🥇","🎽","🥊","🏹","🎾"];
const FALLBACK_HUES = [12, 40, 80, 140, 175, 205, 240, 280, 320, 350];
const ANIMS: Variant["anim"][] = ["pulse","bob","swing","spin","shake","float","kick","push"];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function variantFor(name: string): Variant {
  const key = name.trim().toLowerCase();
  if (EXERCISES[key]) return EXERCISES[key];
  const h = hash(key);
  const hueA = FALLBACK_HUES[h % FALLBACK_HUES.length];
  const hueB = FALLBACK_HUES[(h >> 3) % FALLBACK_HUES.length];
  return {
    emoji: FALLBACK_EMOJIS[h % FALLBACK_EMOJIS.length],
    from: `hsl(${hueA} 85% 55%)`,
    to:   `hsl(${hueB} 85% 50%)`,
    label: name.split(" ").slice(0, 2).join(" "),
    anim: ANIMS[h % ANIMS.length],
  };
}

type Props = { name: string; size?: "sm" | "lg"; className?: string };

export function ExerciseGif({ name, size = "lg", className = "" }: Props) {
  const v = variantFor(name);
  const box = size === "lg" ? "h-28 w-28 text-5xl" : "h-16 w-16 text-3xl";

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-2xl border border-primary/20 ${box} ${className}`}
      style={{ background: `linear-gradient(135deg, ${v.from}, ${v.to})` }}
      aria-label={name}
    >
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.6),transparent_55%)]" />
      <div className={`${ANIM_CLASS[v.anim]} absolute inset-0 grid place-items-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]`}>
        <span>{v.emoji}</span>
      </div>
      <div className="absolute bottom-1 left-1 right-1 truncate rounded-md bg-black/45 px-1.5 py-0.5 text-center text-[9px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
        {v.label}
      </div>
    </div>
  );
}
