import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Dumbbell,
  Apple,
  Droplets,
  LineChart,
  Sparkles,
  Trophy,
  Calendar,
  ShieldCheck,
  Check,
  Crown,
  Flame,
} from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Personal Digital — Treino, dieta e evolução personalizados" },
      {
        name: "description",
        content:
          "App fitness completo: treino semanal com imagens dos exercícios, plano alimentar, hidratação, evolução e coach IA. Premium vitalício por R$ 29,90.",
      },
      { property: "og:title", content: "Personal Digital — Seu personal no bolso" },
      {
        property: "og:description",
        content:
          "Treino semanal, dieta, hidratação, missões e evolução em um único app. Premium vitalício por R$ 29,90.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="bg-gradient-hero min-h-screen text-foreground">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}

function CTAButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <Link
      to="/auth"
      className={`group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lime transition-all active:scale-[0.98] ${className}`}
    >
      {children}
      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#recursos" className="hover:text-foreground">Recursos</a>
          <a href="#como-funciona" className="hover:text-foreground">Como funciona</a>
          <a href="#planos" className="hover:text-foreground">Planos</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <Link
          to="/auth"
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lime md:text-sm"
        >
          Adquira agora
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-16 md:grid-cols-2 md:px-8 md:pt-24">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="pulse-ring h-2 w-2 rounded-full bg-primary" />
            Plano fitness inteligente · 2026
          </p>

          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Seu corpo,<br />
            <span className="bg-gradient-lime bg-clip-text text-transparent">no seu ritmo.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            Treino semanal com imagens dos exercícios, dieta personalizada, hidratação,
            missões diárias e evolução real — tudo em um único app.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTAButton>Adquira agora</CTAButton>
            <a
              href="#recursos"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/40 px-6 py-4 text-sm font-medium text-foreground backdrop-blur hover:bg-card/60"
            >
              Ver recursos
            </a>
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> Seguro e privado
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Crown className="h-4 w-4 text-primary" /> Pagamento único
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="bg-gradient-card relative mx-auto w-full max-w-sm rounded-3xl border border-border/60 p-6 shadow-elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Hoje · Treino</p>
                <p className="font-display text-2xl font-bold">Peito + Tríceps</p>
              </div>
              <div className="bg-gradient-lime grid h-12 w-12 place-items-center rounded-2xl shadow-lime">
                <Dumbbell className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { name: "Supino reto", sets: "4 x 10", rest: "60s" },
                { name: "Crucifixo inclinado", sets: "3 x 12", rest: "45s" },
                { name: "Tríceps corda", sets: "4 x 12", rest: "45s" },
              ].map((ex) => (
                <div
                  key={ex.name}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/40 p-3"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{ex.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ex.sets} · descanso {ex.rest}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Água", value: "2.4L" },
                { label: "Kcal", value: "2150" },
                { label: "XP", value: "+45" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-background/40 px-2 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <p className="text-sm font-bold text-primary">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: Calendar,
    title: "Treino semanal",
    desc: "Plano de segunda a sábado com foco do dia, séries, repetições e descanso. Domingo é dia de descanso.",
  },
  {
    icon: Dumbbell,
    title: "Imagens dos exercícios",
    desc: "Cada exercício vem com ilustração de execução — sem dúvidas sobre como fazer.",
  },
  {
    icon: Apple,
    title: "Dieta personalizada",
    desc: "Café, almoço, lanche e jantar calculados a partir do seu objetivo, peso e rotina.",
  },
  {
    icon: Droplets,
    title: "Hidratação diária",
    desc: "Meta de água do dia ajustada ao seu corpo, com acompanhamento simples.",
  },
  {
    icon: LineChart,
    title: "Evolução real",
    desc: "Registre peso, medidas e veja sua curva de progresso ao longo do tempo.",
  },
  {
    icon: Sparkles,
    title: "Coach diário",
    desc: "Check-ins de humor, energia, sono e motivação — ajustes inteligentes a cada dia.",
  },
  {
    icon: Trophy,
    title: "Missões e XP",
    desc: "Hábitos viram missões, missões viram XP e conquistas. Disciplina vira jogo.",
  },
  {
    icon: Flame,
    title: "Plano sob medida",
    desc: "Treina em casa? Tem academia? Algum machucado? O plano se adapta a você.",
  },
];

function Features() {
  return (
    <section id="recursos" className="border-t border-border/40 bg-background/40 py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Recursos</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Tudo o que você precisa para treinar com consistência.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Personal Digital reúne treino, alimentação, hidratação, evolução e gamificação em um só app.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-gradient-card group rounded-3xl border border-border/60 p-5 shadow-elevated transition hover:border-primary/40"
            >
              <div className="bg-gradient-lime grid h-11 w-11 place-items-center rounded-2xl shadow-lime">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Crie sua conta",
      desc: "Cadastro rápido por e-mail ou Google. Seguro e privado.",
    },
    {
      n: "02",
      title: "Conte sobre você",
      desc: "Objetivo, peso, altura, rotina, restrições. Em menos de 2 minutos.",
    },
    {
      n: "03",
      title: "Receba seu plano",
      desc: "Treino semanal, dieta, hidratação e missões prontos para começar hoje.",
    },
    {
      n: "04",
      title: "Evolua todo dia",
      desc: "Check-ins diários, XP, conquistas e acompanhamento real da sua jornada.",
    },
  ];
  return (
    <section id="como-funciona" className="py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Como funciona</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Do cadastro ao primeiro treino em minutos.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="bg-gradient-card rounded-3xl border border-border/60 p-5 shadow-elevated"
            >
              <p className="bg-gradient-lime bg-clip-text font-display text-3xl font-bold text-transparent">
                {s.n}
              </p>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="planos" className="border-t border-border/40 bg-background/40 py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Planos</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Escolha como quer evoluir.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Comece grátis ou destrave tudo de uma vez, para sempre.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
          <PlanCard
            title="Básico"
            price="Grátis"
            tag="Para testar"
            features={[
              "1 acesso por semana a cada módulo",
              "Treino, dieta, hidratação e evolução",
              "Plano semanal limitado",
              "Com anúncios",
            ]}
          />
          <PlanCard
            title="Premium"
            price="R$ 29,90"
            priceSuffix="· pagamento único · vitalício"
            tag="Mais escolhido"
            highlighted
            features={[
              "Acesso diário e ilimitado a todos os módulos",
              "Treino, dieta, hidratação e evolução todos os dias",
              "Plano semanal completo",
              "Coach diário, missões e XP",
              "Sem anúncios",
              "Atualizações futuras incluídas",
            ]}
          />
        </div>

        <div className="mt-10 flex justify-center">
          <CTAButton className="px-10">Adquira agora</CTAButton>
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  title,
  price,
  priceSuffix,
  tag,
  features,
  highlighted = false,
}: {
  title: string;
  price: string;
  priceSuffix?: string;
  tag?: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`relative rounded-3xl border p-6 shadow-elevated ${
        highlighted
          ? "border-primary/50 bg-gradient-to-br from-primary/15 via-card to-card"
          : "border-border/60 bg-gradient-card"
      }`}
    >
      {tag && (
        <span
          className={`absolute -top-3 left-6 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
            highlighted ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          }`}
        >
          {tag}
        </span>
      )}
      <h3 className="font-display text-2xl font-bold">{title}</h3>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-4xl font-bold">{price}</span>
      </div>
      {priceSuffix && <p className="mt-1 text-xs text-muted-foreground">{priceSuffix}</p>}

      <ul className="mt-6 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const FAQS = [
  {
    q: "Preciso de academia?",
    a: "Não. No cadastro você informa se treina em casa, na academia ou ambos. O plano se adapta aos seus equipamentos.",
  },
  {
    q: "Como funciona o plano alimentar?",
    a: "Café, almoço, lanche e jantar são montados a partir do seu objetivo, peso, altura e nível de atividade.",
  },
  {
    q: "O Premium é assinatura?",
    a: "Não. É pagamento único, vitalício. Pagou, é seu para sempre — com todas as atualizações futuras.",
  },
  {
    q: "Posso testar antes de pagar?",
    a: "Sim. No plano Básico você tem 1 acesso por semana a cada módulo. Quando quiser uso diário, libera o Premium.",
  },
  {
    q: "Meus dados estão seguros?",
    a: "Seu cadastro e progresso ficam protegidos com autenticação por e-mail ou Google.",
  },
];

function FAQ() {
  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Perguntas frequentes</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Ainda em dúvida?
        </h2>

        <div className="mt-8 space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="bg-gradient-card group rounded-2xl border border-border/60 p-5 shadow-elevated"
            >
              <summary className="flex cursor-pointer items-center justify-between font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-primary transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-8 text-center">
          <h3 className="font-display text-2xl font-bold">Pronto para começar?</h3>
          <p className="max-w-md text-sm text-muted-foreground">
            Acesse o app, crie sua conta e receba seu plano em minutos.
          </p>
          <CTAButton className="px-10">Adquira agora</CTAButton>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-xs text-muted-foreground md:flex-row md:px-8">
        <p>© {new Date().getFullYear()} Personal Digital. Todos os direitos reservados.</p>
        <p>Treino · Dieta · Evolução</p>
      </div>
    </footer>
  );
}
