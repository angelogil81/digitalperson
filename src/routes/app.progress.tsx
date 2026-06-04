import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, Card, SectionTitle } from "@/components/Shell";
import { useStore, getPlan, setPlan, todayISO } from "@/lib/pd-store";
import { TrendingDown, TrendingUp, Plus } from "lucide-react";
import { WeeklyGate } from "@/components/Premium";

export const Route = createFileRoute("/app/progress")({
  head: () => ({ meta: [{ title: "Evolução · Personal Digital" }, { name: "description", content: "Acompanhe sua evolução." }] }),
  component: Progress,
});

function Progress() {
  const { plan, profile } = useStore();
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [note, setNote] = useState("");

  if (!plan || !profile) return null;

  const entries = [...plan.progress].sort((a,b) => a.date.localeCompare(b.date));
  const first = entries[0];
  const last = entries[entries.length - 1];
  const diff = last ? last.weight - first.weight : 0;
  const trendingDown = diff < 0;

  function add() {
    if (!weight) return;
    const p = getPlan(); if (!p) return;
    p.progress.push({ date: todayISO(), weight: parseFloat(weight), waist: waist ? parseFloat(waist) : undefined, note });
    setPlan(p);
    setOpen(false); setWeight(""); setWaist(""); setNote("");
  }

  const max = entries.length ? Math.max(...entries.map(e => e.weight)) : 0;
  const min = entries.length ? Math.min(...entries.map(e => e.weight)) : 0;
  const range = max - min || 1;

  return (
    <Shell>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Sua jornada</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Evolução</h1>

      <WeeklyGate
        feature="progress"
        title="Evolução 1x por semana no Básico"
        description="Use seu acesso desta semana para registrar e visualizar sua evolução, ou tenha acompanhamento diário no Premium."
      >

      {last ? (
      <Card className="mt-5">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Peso atual</p>
            <div className="mt-1 text-4xl font-bold tabular-nums">{last.weight}<span className="text-base font-normal text-muted-foreground"> kg</span></div>
          </div>
          <div className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${trendingDown ? "bg-emerald-500/20 text-emerald-300" : diff > 0 ? "bg-orange-500/20 text-orange-300" : "bg-secondary text-muted-foreground"}`}>
            {trendingDown ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
            {diff > 0 ? "+" : ""}{diff.toFixed(1)} kg
          </div>
        </div>

        <div className="mt-5 h-24">
          <svg viewBox="0 0 300 100" className="h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.88 0.20 130)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="oklch(0.88 0.20 130)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {entries.length > 1 && (() => {
              const pts = entries.map((e, i) => {
                const x = (i / (entries.length - 1)) * 300;
                const y = 90 - ((e.weight - min) / range) * 70;
                return `${x},${y}`;
              });
              return <>
                <polyline points={`0,100 ${pts.join(" ")} 300,100`} fill="url(#g)" />
                <polyline points={pts.join(" ")} fill="none" stroke="oklch(0.88 0.20 130)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                {pts.map((p, i) => {
                  const [x, y] = p.split(",").map(Number);
                  return <circle key={i} cx={x} cy={y} r="3" fill="oklch(0.88 0.20 130)" />;
                })}
              </>;
            })()}
            {entries.length === 1 && <text x="150" y="55" textAnchor="middle" fill="oklch(0.70 0.02 250)" fontSize="11">Registre mais medições para ver o gráfico</text>}
          </svg>
        </div>
      </Card>
      ) : (
        <Card className="mt-5 text-center">
          <p className="text-sm text-muted-foreground">Nenhuma medição registrada ainda. Faça seu primeiro registro abaixo.</p>
        </Card>
      )}


      <button onClick={() => setOpen(true)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-lime transition active:scale-[0.98]">
        <Plus className="h-5 w-5" /> Registrar medição
      </button>

      <SectionTitle>Histórico</SectionTitle>
      <div className="space-y-2">
        {[...entries].reverse().map((e, i) => (
          <Card key={i} className="!p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{new Date(e.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</div>
                {e.note && <div className="mt-0.5 text-xs text-muted-foreground">{e.note}</div>}
              </div>
              <div className="text-right">
                <div className="text-lg font-bold tabular-nums">{e.weight} kg</div>
                {e.waist && <div className="text-[11px] text-muted-foreground">Cintura {e.waist} cm</div>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="mx-auto w-full max-w-md rounded-t-3xl bg-card p-6 shadow-elevated animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
            <h3 className="text-xl font-bold">Nova medição</h3>
            <div className="mt-4 space-y-3">
              <Input label="Peso (kg)" value={weight} onChange={setWeight} type="number" />
              <Input label="Cintura (cm) opcional" value={waist} onChange={setWaist} type="number" />
              <Input label="Anotação" value={note} onChange={setNote} placeholder="Como está se sentindo?" />
            </div>
            <button onClick={add} className="mt-5 w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground shadow-lime">Salvar</button>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} type={type} placeholder={placeholder} className="mt-1 w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-base outline-none focus:border-primary/60" />
    </label>
  );
}
