import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { setProfile, setPlan, getAuth, type Profile, type Goal, type Sex, type Activity } from "@/lib/pd-store";
import { generatePlan } from "@/lib/plan-generator";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Questionário · Personal Digital" }, { name: "description", content: "Monte seu plano em minutos." }] }),
  component: Onboarding,
});

type Answers = Partial<Profile>;

const steps = [
  "name", "age", "sex", "height", "weight", "activity", "goal",
  "daysPerWeek", "minutesPerSession", "gym", "diet", "injuries",
] as const;

function Onboarding() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [i, setI] = useState(0);
  const [a, setA] = useState<Answers>({ name: auth?.name || "", diet: "", injuries: "" });

  const progress = ((i + 1) / steps.length) * 100;
  const step = steps[i];

  function next() {
    if (i === steps.length - 1) {
      const profile: Profile = {
        name: a.name || "Atleta",
        email: auth?.email || "",
        age: a.age || 28,
        sex: a.sex || "M",
        height: a.height || 175,
        weight: a.weight || 75,
        activity: a.activity || "moderado",
        goal: a.goal || "saude",
        daysPerWeek: a.daysPerWeek || 4,
        minutesPerSession: a.minutesPerSession || 45,
        hasGym: a.hasGym ?? true,
        trainsHome: a.trainsHome ?? false,
        diet: a.diet || "Sem restrições",
        injuries: a.injuries || "Nenhuma",
      };
      setProfile(profile);
      setPlan(generatePlan(profile));
      navigate({ to: "/app" });
      return;
    }
    setI(i + 1);
  }
  function back() { if (i === 0) navigate({ to: "/auth" }); else setI(i - 1); }

  return (
    <div className="mx-auto min-h-screen max-w-md px-6 pb-8 pt-8">
      <div className="flex items-center justify-between">
        <button onClick={back} className="flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        <span className="text-xs text-muted-foreground">{i + 1} / {steps.length}</span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="bg-gradient-lime h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div key={step} className="mt-10 animate-fade-up">
        <StepView step={step} a={a} setA={setA} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-md bg-gradient-to-t from-background via-background/95 to-transparent px-6 pb-8 pt-6">
        <button
          onClick={next}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lime transition active:scale-[0.98]"
        >
          {i === steps.length - 1 ? <>Gerar meu plano <Check className="h-5 w-5" /></> : <>Continuar <ArrowRight className="h-5 w-5" /></>}
        </button>
      </div>
    </div>
  );
}

function StepView({ step, a, setA }: { step: typeof steps[number]; a: Answers; setA: (a: Answers) => void }) {
  const Title = ({ children, sub }: { children: React.ReactNode; sub?: string }) => (
    <div className="mb-6">
      <h1 className="text-3xl font-bold leading-tight tracking-tight">{children}</h1>
      {sub && <p className="mt-2 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );

  switch (step) {
    case "name":
      return <>
        <Title sub="Vamos personalizar tudo para você.">Como podemos te chamar?</Title>
        <TextInput value={a.name || ""} onChange={(v) => setA({ ...a, name: v })} placeholder="Seu primeiro nome" />
      </>;
    case "age":
      return <>
        <Title>Quantos anos você tem?</Title>
        <NumberInput value={a.age} onChange={(v) => setA({ ...a, age: v })} suffix="anos" />
      </>;
    case "sex":
      return <>
        <Title>Sexo biológico</Title>
        <Choice<Sex>
          value={a.sex}
          options={[{ v: "M", l: "Masculino" }, { v: "F", l: "Feminino" }, { v: "O", l: "Prefiro não dizer" }]}
          onChange={(v) => setA({ ...a, sex: v })}
        />
      </>;
    case "height":
      return <>
        <Title>Sua altura</Title>
        <NumberInput value={a.height} onChange={(v) => setA({ ...a, height: v })} suffix="cm" />
      </>;
    case "weight":
      return <>
        <Title>Seu peso atual</Title>
        <NumberInput value={a.weight} onChange={(v) => setA({ ...a, weight: v })} suffix="kg" />
      </>;
    case "activity":
      return <>
        <Title sub="Seja honesto, isso ajusta o plano.">Nível de atividade</Title>
        <Choice<Activity>
          value={a.activity}
          options={[
            { v: "sedentario", l: "Sedentário", d: "Pouca ou nenhuma atividade" },
            { v: "leve", l: "Leve", d: "1–2x por semana" },
            { v: "moderado", l: "Moderado", d: "3–5x por semana" },
            { v: "intenso", l: "Intenso", d: "6–7x por semana" },
          ]}
          onChange={(v) => setA({ ...a, activity: v })}
        />
      </>;
    case "goal":
      return <>
        <Title sub="É isso que vai guiar todo o seu plano.">Qual o seu objetivo?</Title>
        <Choice<Goal>
          value={a.goal}
          options={[
            { v: "emagrecer", l: "Emagrecer", d: "Reduzir gordura corporal" },
            { v: "massa", l: "Ganhar massa muscular", d: "Hipertrofia" },
            { v: "definicao", l: "Definição", d: "Cortar gordura mantendo músculo" },
            { v: "condicionamento", l: "Condicionamento físico", d: "Resistência e fôlego" },
            { v: "saude", l: "Saúde & bem-estar", d: "Hábitos saudáveis" },
          ]}
          onChange={(v) => setA({ ...a, goal: v })}
        />
      </>;
    case "daysPerWeek":
      return <>
        <Title>Quantos dias por semana você pode treinar?</Title>
        <Choice<number>
          value={a.daysPerWeek}
          options={[1,2,3,4,5,6,7].map((n) => ({ v: n, l: `${n} ${n === 1 ? "dia" : "dias"}` }))}
          onChange={(v) => setA({ ...a, daysPerWeek: v })}
        />
      </>;
    case "minutesPerSession":
      return <>
        <Title>Tempo por treino</Title>
        <Choice<number>
          value={a.minutesPerSession}
          options={[{v:20,l:"20 min"},{v:30,l:"30 min"},{v:45,l:"45 min"},{v:60,l:"60 min"},{v:90,l:"90 min"}]}
          onChange={(v) => setA({ ...a, minutesPerSession: v })}
        />
      </>;
    case "gym":
      return <>
        <Title>Onde você vai treinar?</Title>
        <Choice<string>
          value={a.hasGym ? "gym" : a.trainsHome ? "home" : undefined}
          options={[
            { v: "gym", l: "Tenho academia", d: "Aparelhos e pesos disponíveis" },
            { v: "home", l: "Treino em casa", d: "Pouco ou nenhum equipamento" },
            { v: "both", l: "Ambos", d: "Flexível" },
          ]}
          onChange={(v) => setA({ ...a, hasGym: v !== "home", trainsHome: v !== "gym" })}
        />
      </>;
    case "diet":
      return <>
        <Title sub="Vegetariano, lactose, glúten, etc. Deixe em branco se não houver.">Restrições alimentares</Title>
        <TextInput value={a.diet || ""} onChange={(v) => setA({ ...a, diet: v })} placeholder="Ex.: vegetariano, sem lactose" />
      </>;
    case "injuries":
      return <>
        <Title sub="Vamos adaptar os exercícios.">Lesões ou limitações</Title>
        <TextInput value={a.injuries || ""} onChange={(v) => setA({ ...a, injuries: v })} placeholder="Ex.: dor no joelho, hérnia" />
      </>;
  }
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-border bg-card/40 px-5 py-4 text-base outline-none placeholder:text-muted-foreground focus:border-primary/60"
    />
  );
}

function NumberInput({ value, onChange, suffix }: { value?: number; onChange: (v: number) => void; suffix: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 px-5 py-4 focus-within:border-primary/60">
      <input
        autoFocus
        type="number"
        inputMode="numeric"
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder="0"
        className="w-full bg-transparent text-3xl font-semibold tabular-nums outline-none placeholder:text-muted-foreground"
      />
      <span className="text-base text-muted-foreground">{suffix}</span>
    </div>
  );
}

function Choice<T extends string | number>({ value, options, onChange }: {
  value: T | undefined;
  options: { v: T; l: string; d?: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-2.5">
      {options.map((o) => {
        const active = value === o.v;
        return (
          <button
            key={String(o.v)}
            onClick={() => onChange(o.v)}
            className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition-all ${
              active ? "border-primary bg-primary/10 shadow-lime" : "border-border bg-card/40 hover:border-border/80"
            }`}
          >
            <div>
              <div className="text-base font-semibold">{o.l}</div>
              {o.d && <div className="mt-0.5 text-xs text-muted-foreground">{o.d}</div>}
            </div>
            <div className={`grid h-6 w-6 place-items-center rounded-full border-2 ${active ? "border-primary bg-primary" : "border-border"}`}>
              {active && <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
