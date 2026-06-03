import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Flame, HeartPulse } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Personal Digital — Seu personal trainer e nutricionista no bolso" },
      { name: "description", content: "Planos personalizados de treino, alimentação e evolução. Resultados reais com acompanhamento inteligente." },
      { property: "og:title", content: "Personal Digital" },
      { property: "og:description", content: "Treino, dieta e evolução em um único app premium." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-hero relative mx-auto min-h-screen max-w-md overflow-hidden px-6 pb-10 pt-10">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />

      <div className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col">
        <Logo />

        <div className="mt-16 animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-primary pulse-ring" /> Novo · IA de plano fitness 2026
          </p>
          <h1 className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight">
            Seu corpo,<br/>
            <span className="bg-gradient-lime bg-clip-text text-transparent">no seu ritmo.</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Treino, alimentação e evolução personalizados em segundos. Sem academia confusa, sem dieta genérica.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { icon: Flame, label: "Plano sob medida" },
            { icon: HeartPulse, label: "Acompanha você" },
            { icon: ShieldCheck, label: "Seguro & privado" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="glass rounded-2xl p-3 text-center">
              <Icon className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-2 text-[11px] leading-tight text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-10">
          <button
            onClick={() => navigate({ to: "/auth" })}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lime transition-all active:scale-[0.98]"
          >
            Começar agora
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/auth" className="font-medium text-foreground underline-offset-4 hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
