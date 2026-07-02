import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { setAuth, getProfile } from "@/lib/pd-store";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar · Personal Digital" },
      { name: "description", content: "Acesse sua conta Personal Digital." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Already signed in? Skip to app.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setAuth({
          email: data.session.user.email ?? "",
          name: (data.session.user.user_metadata?.name as string) ?? data.session.user.email?.split("@")[0] ?? "",
        });
        navigate({ to: getProfile() ? "/app" : "/onboarding" });
      }
    });
  }, [navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    setAuth({
      email: data.user?.email ?? email,
      name: (data.user?.user_metadata?.name as string) ?? email.split("@")[0],
    });
    navigate({ to: getProfile() ? "/app" : "/onboarding" });
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) return toast.error("Preencha todos os campos.");
    if (password.length < 6) return toast.error("A senha deve ter ao menos 6 caracteres.");
    if (password !== confirm) return toast.error("As senhas não coincidem.");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/app`,
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    if (data.session) {
      setAuth({ email, name });
      navigate({ to: "/onboarding" });
    } else {
      toast.success("Conta criada! Verifique seu e-mail para confirmar.");
      setMode("login");
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return toast.error("Informe seu e-mail.");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Enviamos um link de recuperação para seu e-mail.");
    setMode("login");
  }


  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-6 pb-10 pt-8 sm:px-8">
      <button onClick={() => navigate({ to: "/" })} className="flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="mt-8"><Logo /></div>

      <div className="mt-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {mode === "signup" ? "Crie sua conta" : mode === "forgot" ? "Recuperar senha" : "Bem-vindo de volta"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Comece sua jornada personalizada em menos de 2 minutos."
            : mode === "forgot"
            ? "Enviaremos um link para você redefinir sua senha."
            : "Continue de onde parou."}
        </p>
      </div>

      {mode !== "forgot" && (
        <div className="mt-6 flex gap-2 rounded-2xl border border-border bg-card/40 p-1">
          {(["login", "signup"] as const).map((m) => (
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
      )}

      {mode === "login" && (
        <form onSubmit={handleLogin} className="mt-6 space-y-3">
          <Field icon={Mail} placeholder="E-mail" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <PasswordField placeholder="Senha" value={password} onChange={setPassword} show={showPw} onToggle={() => setShowPw((s) => !s)} autoComplete="current-password" />

          <button type="button" onClick={() => setMode("forgot")} className="ml-auto block text-xs font-medium text-primary">
            Esqueceu a senha?
          </button>

          <SubmitButton loading={loading}>Entrar</SubmitButton>
        </form>
      )}

      {mode === "signup" && (
        <form onSubmit={handleSignup} className="mt-6 space-y-3">
          <Field icon={UserIcon} placeholder="Seu nome" value={name} onChange={setName} autoComplete="name" />
          <Field icon={Mail} placeholder="E-mail" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <PasswordField placeholder="Senha (mín. 6)" value={password} onChange={setPassword} show={showPw} onToggle={() => setShowPw((s) => !s)} autoComplete="new-password" />
          <PasswordField placeholder="Confirmar senha" value={confirm} onChange={setConfirm} show={showConfirm} onToggle={() => setShowConfirm((s) => !s)} autoComplete="new-password" />

          <SubmitButton loading={loading}>Criar conta</SubmitButton>
        </form>
      )}

      {mode === "forgot" && (
        <form onSubmit={handleForgot} className="mt-6 space-y-3">
          <Field icon={Mail} placeholder="E-mail" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <SubmitButton loading={loading}>Enviar link</SubmitButton>
          <button type="button" onClick={() => setMode("login")} className="w-full text-center text-sm text-muted-foreground">
            Voltar para login
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Ao continuar você aceita nossos Termos e Política de Privacidade.
      </p>
    </div>
  );
}

function Field({
  icon: Icon,
  ...props
}: {
  icon: typeof Mail;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 px-4 py-3.5 focus-within:border-primary/60">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <input
        placeholder={props.placeholder}
        type={props.type || "text"}
        value={props.value}
        autoComplete={props.autoComplete}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

function PasswordField({
  placeholder,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  autoComplete?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 px-4 py-3.5 focus-within:border-primary/60">
      <Lock className="h-5 w-5 text-muted-foreground" />
      <input
        placeholder={placeholder}
        type={show ? "text" : "password"}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={show ? "Ocultar senha" : "Mostrar senha"}
        className="text-muted-foreground transition hover:text-foreground"
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lime transition active:scale-[0.98] disabled:opacity-60"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

