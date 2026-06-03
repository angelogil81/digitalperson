import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, Lock, User as UserIcon } from "lucide-react";
import { setAuth, getProfile } from "@/lib/pd-store";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar · Personal Digital" }, { name: "description", content: "Acesse sua conta Personal Digital." }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && !name)) return;
    setAuth({ email, name: name || email.split("@")[0] });
    const hasProfile = !!getProfile();
    navigate({ to: hasProfile ? "/app" : "/onboarding" });
  }

  return (
    <div className="mx-auto min-h-screen max-w-md px-6 pb-10 pt-8">
      <button onClick={() => navigate({ to: "/" })} className="flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="mt-8"><Logo /></div>

      <div className="mt-10">
        <h1 className="text-3xl font-bold tracking-tight">{mode === "signup" ? "Crie sua conta" : "Bem-vindo de volta"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signup" ? "Comece sua jornada personalizada em menos de 2 minutos." : "Continue de onde parou."}
        </p>
      </div>

      <div className="mt-6 flex gap-2 rounded-2xl border border-border bg-card/40 p-1">
        {(["signup", "login"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-xl py-2 text-sm font-medium transition-all ${
              mode === m ? "bg-primary text-primary-foreground shadow-lime" : "text-muted-foreground"
            }`}
          >
            {m === "signup" ? "Criar conta" : "Entrar"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-3">
        {mode === "signup" && (
          <Field icon={UserIcon} placeholder="Seu nome" value={name} onChange={setName} />
        )}
        <Field icon={Mail} placeholder="E-mail" type="email" value={email} onChange={setEmail} />
        <Field icon={Lock} placeholder="Senha" type="password" value={password} onChange={setPassword} />

        <button type="submit" className="mt-2 w-full rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lime transition active:scale-[0.98]">
          {mode === "signup" ? "Criar conta" : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Ao continuar você aceita nossos Termos e Política de Privacidade.
      </p>
    </div>
  );
}

function Field({ icon: Icon, ...props }: { icon: typeof Mail; placeholder: string; type?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 px-4 py-3.5 focus-within:border-primary/60">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <input
        {...props}
        type={props.type || "text"}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
