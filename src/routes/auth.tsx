import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
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

  async function handleGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth",
    });
    if (result.error) {
      setLoading(false);
      return toast.error("Falha ao entrar com Google.");
    }
    if (result.redirected) return; // browser redirecting
    // Already signed in via token flow
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setAuth({
        email: data.session.user.email ?? "",
        name:
          (data.session.user.user_metadata?.name as string) ??
          (data.session.user.user_metadata?.full_name as string) ??
          data.session.user.email?.split("@")[0] ??
          "",
      });
      navigate({ to: getProfile() ? "/app" : "/onboarding" });
    }
    setLoading(false);
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
          <Divider />
          <GoogleButton loading={loading} onClick={handleGoogle} />
        </form>
      )}

      {mode === "signup" && (
        <form onSubmit={handleSignup} className="mt-6 space-y-3">
          <Field icon={UserIcon} placeholder="Seu nome" value={name} onChange={setName} autoComplete="name" />
          <Field icon={Mail} placeholder="E-mail" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <PasswordField placeholder="Senha (mín. 6)" value={password} onChange={setPassword} show={showPw} onToggle={() => setShowPw((s) => !s)} autoComplete="new-password" />
          <PasswordField placeholder="Confirmar senha" value={confirm} onChange={setConfirm} show={showConfirm} onToggle={() => setShowConfirm((s) => !s)} autoComplete="new-password" />

          <SubmitButton loading={loading}>Criar conta</SubmitButton>
          <Divider />
          <GoogleButton loading={loading} onClick={handleGoogle} />
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

function Divider() {
  return (
    <div className="my-2 flex items-center gap-3 text-xs text-muted-foreground">
      <div className="h-px flex-1 bg-border" />
      ou
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function GoogleButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card/60 py-3.5 text-sm font-semibold text-foreground transition active:scale-[0.98] disabled:opacity-60"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.3 9.14 5.38 12 5.38z"/>
      </svg>
      Continuar com Google
    </button>
  );
}
