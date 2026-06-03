import { Sparkles } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "h-14 w-14" : size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <div className="flex items-center gap-3">
      <div className={`bg-gradient-lime ${dims} grid place-items-center rounded-2xl shadow-lime`}>
        <Sparkles className="h-1/2 w-1/2 text-primary-foreground" strokeWidth={2.5} />
      </div>
      <div>
        <div className={`${text} font-semibold tracking-tight`}>Personal<span className="text-primary">.</span>Digital</div>
        {size !== "sm" && <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Seu coach 24/7</div>}
      </div>
    </div>
  );
}
