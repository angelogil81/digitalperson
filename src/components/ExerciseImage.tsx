import { useEffect, useState } from "react";
import { Dumbbell } from "lucide-react";
import { getExerciseImage } from "@/lib/wger";

type Props = { name: string; className?: string };

export function ExerciseImage({ name, className = "" }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "empty">("loading");

  useEffect(() => {
    let alive = true;
    setState("loading"); setUrl(null);
    getExerciseImage(name).then((u) => {
      if (!alive) return;
      if (u) { setUrl(u); setState("ok"); } else { setState("empty"); }
    }).catch(() => alive && setState("empty"));
    return () => { alive = false; };
  }, [name]);

  return (
    <div
      className={`relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-secondary/80 to-background ${className}`}
      aria-hidden
    >
      {state === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-primary/5" />
      )}
      {state === "ok" && url && (
        <img
          src={url}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setState("empty")}
        />
      )}
      {state === "empty" && (
        <div className="relative grid h-full w-full place-items-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.18),transparent_60%)]" />
          <Dumbbell className="h-8 w-8 text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]" strokeWidth={2.2} />
        </div>
      )}
    </div>
  );
}
