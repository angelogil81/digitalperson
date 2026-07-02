// Animated exercise tile — categorizes PT exercise name and shows a looping
// animated SVG (GIF-like) representative of the movement. No external API.

type Category = "legs" | "push" | "pull" | "shoulders" | "arms" | "core" | "cardio" | "mobility";

const KEYWORDS: [RegExp, Category][] = [
  [/agachament|leg\s*press|afundo|panturrilha|cadeira|flexora|glut|pelvic|bulg/i, "legs"],
  [/supino|flex[aã]o de bra|peito|push|desenvolv|militar/i, "push"],
  [/puxada|remada|costas|pull/i, "pull"],
  [/ombro|eleva[cç][aã]o lateral/i, "shoulders"],
  [/rosca|b[ií]ceps|tr[ií]ceps|corda/i, "arms"],
  [/prancha|abdomin|core|mountain/i, "core"],
  [/burpee|polichinelo|skipping|salto|cardio|caminhada|corrida|hiit/i, "cardio"],
  [/alongament|mobilidad|respira|quadril/i, "mobility"],
];

function categorize(name: string): Category {
  for (const [re, cat] of KEYWORDS) if (re.test(name)) return cat;
  return "push";
}

const META: Record<Category, { emoji: string; label: string; from: string; to: string }> = {
  legs:      { emoji: "🦵", label: "Pernas",     from: "hsl(140 90% 55%)", to: "hsl(160 90% 45%)" },
  push:      { emoji: "🏋️", label: "Empurrar",   from: "hsl(20 95% 60%)",  to: "hsl(0 90% 55%)"  },
  pull:      { emoji: "🤾", label: "Puxar",      from: "hsl(210 95% 60%)", to: "hsl(240 85% 60%)" },
  shoulders: { emoji: "💪", label: "Ombros",     from: "hsl(45 95% 55%)",  to: "hsl(25 95% 55%)"  },
  arms:      { emoji: "💪", label: "Braços",     from: "hsl(285 85% 60%)", to: "hsl(320 85% 55%)" },
  core:      { emoji: "🧘", label: "Core",       from: "hsl(190 90% 55%)", to: "hsl(220 85% 55%)" },
  cardio:    { emoji: "🔥", label: "Cardio",     from: "hsl(0 95% 60%)",   to: "hsl(30 95% 55%)"  },
  mobility:  { emoji: "🧎", label: "Mobilidade", from: "hsl(160 60% 50%)", to: "hsl(200 70% 50%)" },
};

type Props = { name: string; size?: "sm" | "lg"; className?: string };

export function ExerciseGif({ name, size = "lg", className = "" }: Props) {
  const cat = categorize(name);
  const meta = META[cat];
  const box = size === "lg" ? "h-28 w-28 text-5xl" : "h-16 w-16 text-3xl";

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-2xl border border-primary/20 ${box} ${className}`}
      style={{ background: `linear-gradient(135deg, ${meta.from}, ${meta.to})` }}
      aria-label={`${meta.label}: ${name}`}
    >
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.6),transparent_55%)]" />
      <div className="ex-gif-pulse absolute inset-0 grid place-items-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
        <span>{meta.emoji}</span>
      </div>
      <div className="absolute bottom-1 left-1 right-1 rounded-md bg-black/40 px-1.5 py-0.5 text-center text-[9px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
        {meta.label}
      </div>
    </div>
  );
}
