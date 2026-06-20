import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Redefinir senha · Personal Digital" },
      { name: "description", content: "Defina uma nova senha para sua conta." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [showC, setShowC] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return toast.error("A senha deve ter ao menos 6 caracteres.");
    if (password !== confirm) return toast.error("As senhas não coincidem.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Senha redefinida com sucesso.");
    navigate({ to: "/auth" });
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-6 pb-10 pt-8 sm:px-8">
      <button onClick={() => navigate({ to: "/auth" })} className="flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>
      <div className="mt-8"><Logo /></div>

      <h1 className="mt-8 text-3xl font-bold tracking-tight">Redefinir senha</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {ready ? "Crie uma nova senha para sua conta." : "Validando o link de recuperação..."}
      </p>

      <form onSubmit={submit} className="mt-6 space-y-3">
        <PwField placeholder="Nova senha" value={password} onChange={setPassword} show={show} onToggle={() => setShow((s) => !s)} />
        <PwField placeholder="Confirmar nova senha" value={confirm} onChange={setConfirm} show={showC} onToggle={() => setShowC((s) => !s)} />
        <button
          type="submit"
          disabled={loading || !ready}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lime transition active:scale-[0.98] disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Salvar nova senha
        </button>
      </form>
    </div>
  );
}

function PwField({
  placeholder, value, onChange, show, onToggle,
}: { placeholder: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 px-4 py-3.5 focus-within:border-primary/60">
      <Lock className="h-5 w-5 text-muted-foreground" />
      <input
        type={show ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        autoComplete="new-password"
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <button type="button" onClick={onToggle} className="text-muted-foreground hover:text-foreground" aria-label={show ? "Ocultar" : "Mostrar"}>
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}
